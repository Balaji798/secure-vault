# Secure Vault

A frontend-only secure vault application built with Next.js that allows users to securely store secrets locally in the browser.

The application encrypts all secret data before persisting it to localStorage and decrypts secrets only in memory after successful authentication using a master password.

---

## Assignment Requirements Covered

### Vault & Secret Management

* Create a secret
* View stored secrets
* Delete secrets
* Search secrets (performed only in decrypted memory)

Each secret contains:

* Name
* Username
* Password
* Optional notes

---

## Security Implementation

### Encryption

* Browser Web Crypto API
* AES-256-GCM for authenticated encryption
* Unique IV per encrypted secret

### Key Derivation

* PBKDF2
* SHA-256
* 100,000 iterations
* Unique salt per vault

### Storage Policy

Only encrypted vault data is stored in localStorage.

Stored:

* Encrypted secret data
* Salt
* Metadata

Never Stored:

* Master password
* Encryption key
* Plaintext secrets

---

## Lock / Unlock Flow

1. Application starts in locked state
2. User enters master password
3. Encryption key derived in browser
4. Secrets decrypted in memory only
5. Vault automatically locks on refresh

---

## Tech Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS v4
* Browser Web Crypto API
* LocalStorage

---

## Getting Started

### Install

```bash
git clone <repository-url>
cd secure-vault
npm install
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```text
secure-vault/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── hooks/
│   └── use-vault.ts
├── lib/
│   ├── crypto.ts
│   └── vault-storage.ts
└── public/
```

---

## Security Notes

Assumptions:

* Browser Web Crypto implementation is trusted
* User chooses a strong master password
* Device environment is not compromised

Limitations:

* No backend or synchronization
* No recovery if master password is lost
* Keys exist only during active session

---

## Repository

GitHub:
https://github.com/Balaji798/secure-vault
