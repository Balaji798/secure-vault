Secure Vault
A modern, client-side encrypted password manager built with Next.js. Your secrets are encrypted locally before storage, ensuring zero-knowledge security.

🔐 Security Features
Zero-Knowledge Architecture - All encryption happens client-side
AES-256-GCM Encryption - Military-grade encryption with integrity protection
PBKDF2 Key Derivation - 100,000 iterations to prevent brute-force attacks
Secure Random Generation - Cryptographically secure salts and IVs
Modern UI - Beautiful glassmorphism interface with Tailwind CSS
🚀 Quick Start
Prerequisites
Node.js 18+
Modern browser (Chrome, Firefox, Safari, Edge)
Installation
bash

# Clone and setup

git clone <repository-url>
cd secure-vault
npm install

# Run development server

npm run dev

# Open browser

# Navigate to http://localhost:3000

Production Build
bash
npm run build
npm start
🏗️ Architecture
Core Design Decisions
Client-Side Encryption

All crypto operations happen in the browser
Your master password never leaves your device
Zero-knowledge security model
Technology Stack

Next.js 16 with App Router
TypeScript for type safety
Tailwind CSS v4 for styling
Web Crypto API for cryptography
Data Storage

Encrypted data stored in localStorage
Only salt and metadata stored in plaintext
No backend required - works offline
Key Management

PBKDF2 with 100,000 iterations
Unique salt per vault
Non-extractable keys for memory safety
256-bit AES-GCM encryption
📋 Assumptions & Limitations
Security Assumptions
✅ Device is not compromised by malware
✅ Browser's Web Crypto API is secure
✅ Users choose strong master passwords
Known Limitations
⚠️ No automatic backup system
⚠️ No cross-device synchronization
⚠️ Lost master password = lost data
⚠️ Keys remain in memory until page refresh
🛡️ Security Overview
What's Protected
✅ Passwords, usernames, and notes (encrypted)
✅ Individual IVs prevent pattern analysis
✅ Authenticated encryption prevents tampering
✅ Strong key derivation prevents brute force
What's Not Protected
⚠️ Metadata (names, timestamps) in plaintext
⚠️ Vulnerable to local malware attacks
⚠️ Browser extensions could access data
🔧 Project Structure
secure-vault/
├── app/
│ ├── globals.css # Tailwind styles
│ ├── layout.tsx # Root layout
│ └── page.tsx # Main application
├── hooks/
│ └── use-vault.ts # Vault state management
├── lib/
│ ├── crypto.ts # Cryptographic operations
│ └── vault-storage.ts # Local storage management
└── public/ # Static assets
📄 License
Provided as-is for educational and personal use. Review security implications before production use.

Feedback submitted

Command Awaiting Approval
