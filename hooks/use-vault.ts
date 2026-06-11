"use client";

import { useState, useEffect, useCallback } from "react";
import { CryptoService, Secret } from "@/lib/crypto";
import { VaultData, VaultStorage } from "@/lib/vault-storage";

export function useVault() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);

  const lockVault = useCallback(() => {
    setIsUnlocked(false);
    setSecrets(() => []);
    setEncryptionKey(null);
    setError(null);
  }, []);

  const unlockVault = useCallback(
    async (password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const vaultData = VaultStorage.loadVault();

        if (!vaultData) {
          // First time setup
          const salt = CryptoService.generateSalt();
          const key = await CryptoService.deriveKey(password, salt);

          VaultStorage.saveVault({
            salt: CryptoService.arrayBufferToBase64(
              new Uint8Array(salt).buffer,
            ),
            secrets: [],
          });

          setEncryptionKey(key);
          setIsUnlocked(true);
          setSecrets([]);
          return true;
        }

        // Existing vault
        const salt = CryptoService.base64ToArrayBuffer(vaultData.salt);
        const key = await CryptoService.deriveKey(
          password,
          new Uint8Array(salt),
        );

        // Decrypt all secrets
        const decryptedSecrets = await Promise.all(
          vaultData.secrets.map(async (secret) => {
            const decryptedData = await CryptoService.decryptSecret(
              secret.encryptedData,
              secret.iv,
              key,
            );

            return {
              ...decryptedData,
              id: secret.id,
              createdAt: secret.createdAt,
            };
          }),
        );

        setEncryptionKey(key);
        setIsUnlocked(true);
        setSecrets(decryptedSecrets);
        return true;
      } catch (error) {
        setError("Invalid master password");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const saveSecrets = useCallback(
    async (updatedSecrets: Secret[]) => {
      if (!encryptionKey) throw new Error("Vault not unlocked");

      const vaultData = VaultStorage.loadVault();
      if (!vaultData) throw new Error("Vault data not found");

      const encryptedSecrets = [];
      for (const secret of updatedSecrets) {
        const { encryptedData, iv } = await CryptoService.encryptSecret(
          {
            name: secret.name,
            username: secret.username,
            password: secret.password,
            notes: secret.notes,
          },
          encryptionKey,
        );
        encryptedSecrets.push({
          id: secret.id,
          encryptedData,
          iv,
          createdAt: secret.createdAt,
        });
      }

      VaultStorage.saveVault({
        ...vaultData,
        secrets: encryptedSecrets,
      });
    },
    [encryptionKey],
  );

  const createSecret = useCallback(
    async (secretData: Omit<Secret, "id" | "createdAt">) => {
      if (!encryptionKey) throw new Error("Vault not unlocked");

      const newSecret: Secret = {
        ...secretData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };

      const updatedSecrets = [...secrets, newSecret];
      setSecrets(updatedSecrets);
      await saveSecrets(updatedSecrets);
    },
    [encryptionKey, secrets, saveSecrets],
  );

  const deleteSecret = useCallback(
    async (id: string) => {
      const updatedSecrets = secrets.filter((secret) => secret.id !== id);
      setSecrets(updatedSecrets);
      await saveSecrets(updatedSecrets);
    },
    [secrets, saveSecrets],
  );

  const generatePassword = useCallback((length: number = 16): string => {
    return CryptoService.generatePassword(length);
  }, []);

  const searchSecrets = useCallback(
    (query: string): Secret[] => {
      if (!query.trim()) return secrets;

      const lowercaseQuery = query.toLowerCase();
      return secrets.filter(
        (secret) =>
          secret.name.toLowerCase().includes(lowercaseQuery) ||
          secret.username.toLowerCase().includes(lowercaseQuery) ||
          (secret.notes && secret.notes.toLowerCase().includes(lowercaseQuery)),
      );
    },
    [secrets],
  );

  // Auto-lock on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isUnlocked) {
        lockVault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isUnlocked, lockVault]);

  return {
    isUnlocked,
    isLoading,
    secrets,
    error,
    unlockVault,
    lockVault,
    createSecret,
    deleteSecret,
    generatePassword,
    searchSecrets,
  };
}
