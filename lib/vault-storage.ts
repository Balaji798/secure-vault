import { Secret } from './crypto';

export interface VaultData {
  salt: string;
  secrets: Array<{
    id: string;
    encryptedData: string;
    iv: string;
    createdAt: number;
  }>;
}

export class VaultStorage {
  private static readonly VAULT_KEY = 'secure_vault_data';

  static saveVault(vaultData: VaultData): void {
    localStorage.setItem(this.VAULT_KEY, JSON.stringify(vaultData));
  }

  static loadVault(): VaultData | null {
    const data = localStorage.getItem(this.VAULT_KEY);
    return data ? JSON.parse(data) : null;
  }

  static clearVault(): void {
    localStorage.removeItem(this.VAULT_KEY);
  }
}