# BigBlackBox – English Version

## 1. Overview

BIGBLACKBOX is a privacy-preserving marketplace for personalized content (for example, NSFW illustrations) where users can buy and sell without exposing sensitive data.
The platform uses Zero-Knowledge Proofs (Noir + Barretenberg) to verify that a user is over 18 without revealing their real age, Soroban contracts to handle on-chain payments and ownership, USDC on the Stellar network for fast and inexpensive transactions, and Postgres to store non-sensitive metadata.

## 2. Problem

Current platforms require users to share personal documents or sensitive information to verify age or identity. This compromises privacy, restricts access, and keeps digital content off-chain with no verifiable ownership.

### Who is affected

- Content creators
- Consumers of custom digital content

### Why this matters

Many people avoid using these platforms due to privacy risks. Privacy is a fundamental right, and digital content ownership should be verifiable and interoperable.

## 3. Target User & Need

**Primary user:**
Consumers of custom digital content (illustrations and on-demand creative work).

**Core need:**
Verify adulthood without sharing personal information.

**Current situation:**
Users must share real documents or abandon the platform entirely.

## 4. Solution

BIGBLACKBOX allows users to browse content, request custom artwork, verify age privately via ZK, and pay in USDC without exposing sensitive data.
All purchased content is associated with the user via Soroban smart contracts.

### Example use case

A user who normally pays high commissions on Fiverr and submits sensitive documents can now request private illustrations, verify age using Zero-Knowledge proofs, and pay in USDC in seconds.

## 5. Why Stellar?

- Instant global low-cost payments
- Reliable stablecoins (USDC)
- Soroban smart contracts with parallel execution
- Protocol 24 enables ZK-friendly verification (BN254 + RISC Zero verifier)
- Simple integration with the Freighter wallet
- Ideal ecosystem for privacy + micropayments + digital content

### Stellar technologies used:

- Stellar Network (USDC)
- Soroban Smart Contracts
- Freighter Wallet
- Soroswap (optional)
- Noir (ZK circuits)
- Barretenberg (proof generation)

## 6. Key Features (Hackathon MVP)

- Freighter wallet connection
- Age verification via Zero-Knowledge (Noir + Barretenberg)
- Soroban marketplace (publish content, purchase content, on-chain ownership)
- Postgres database for metadata
- USDC payment on testnet
- Optional: Soroswap integration

## 7. MVP Architecture

**Frontend:** React + Vite
**Backend:** Express + Node.js + Noir CLI + Barretenberg + Stellar SDK JS
**Smart Contracts:** Soroban (Rust)
**Database:** Postgres
**Wallet:** Freighter

### Architecture Diagram (text)

```
User
↓
Frontend (React + Freighter)
↓
Backend/API (Express, Noir, Postgres)
↓
Soroban Smart Contract
↓
Stellar Network (USDC)
↓
ZK Services (Noir + Barretenberg)
```

## 8. Installation & Setup

### 1. Clone the project

```
git clone https://github.com/BBB-Team/bigblackbox.git
cd bigblackbox
```

### 2. Backend

```
cd backend
npm install
npm start
```

### 3. Frontend

```
cd frontend
npm install
npm run dev
```

### 4. Database

Local Postgres:

```
CREATE DATABASE bigblackbox;
```

Environment variable:

```
DATABASE_URL=postgres://user:pass@localhost:5432/bigblackbox
```

### 5. Soroban Contract

```
rustup target add wasm32v1-none
stellar contract build
stellar contract deploy ...
```

### 6. Noir

```
noirup
nargo check
nargo execute
```

## 9. Success Criteria (Hackathon)

The MVP is successful if:

- A user can complete the full flow: browse → verify age with ZK → pay with USDC → receive content.
- The Soroban smart contract executes real transactions on testnet.
- Noir proof generation is demonstrated and connected to the backend.
- Postgres stores and retrieves metadata correctly.

## 10. Team

BBB Team
Andrea Junes – Backend & ZK
Arlette Salal – Product
Eduardo Ruiz – Backend / Infra
Natalia (…) – Frontend
María Eugenia Funes – UX / Marketplace

## 11. Progress (First 24 Hours)

- Soroban smart contract running (registration, artwork, purchases).
- Noir circuit created and tested with witness.
- Express backend connected to Postgres.
- Initial UI built with Freighter integration.
- End-to-end mock flow operational.

## 12. Next Steps

- Full integration: Noir → Barretenberg → Soroban
- Functional USDC payment on testnet
- Final UI/UX
- Recorded demo
- Optional Soroswap integration
