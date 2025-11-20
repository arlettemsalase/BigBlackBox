# Black Big Box

A creator economy marketplace powered by Stellar blockchain.

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router
- **Backend**: Node.js + Express (coming soon)
- **Database**: MongoDB + Mongoose (coming soon)
- **Blockchain**: Stellar Network (coming soon)

## Current Status

This is a **frontend-only** prototype with mock data. All backend functionality is simulated using localStorage and mock functions in `src/lib/mock-backend.ts`.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Mock Backend

The app currently uses a mock backend system located in `src/lib/mock-backend.ts`. This simulates:

- Stellar wallet connection
- Content purchases and transactions
- User library and ownership
- Reviews and ratings

**To integrate with real Stellar blockchain:**

1. Install stellar-scaffold or Stellar SDK
2. Replace functions in `src/lib/mock-backend.ts` with real Stellar calls
3. Update wallet connection in `src/lib/wallet-context.tsx`

## Features

- Stellar wallet connection
- Content marketplace (videos, PDFs, live calls)
- Purchase flow with USDC
- Personal library of owned content
- Content access (video player, PDF viewer, live call)
- Review system

## Design

- Dark theme with pure black background
- Primary: Purple `#D866E6`
- Accent: Yellow `#FAE60D`
- Mobile-first responsive design
