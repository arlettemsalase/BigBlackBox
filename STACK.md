# Black Big Box - Tech Stack

## Frontend Stack
- **Framework**: React 18.3
- **Build Tool**: Vite 6.0
- **Styling**: TailwindCSS 4.1
- **Routing**: React Router DOM 6.28
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Type Safety**: TypeScript 5.6

## Development
- **Package Manager**: npm/pnpm/yarn
- **Dev Server**: Vite dev server (port 5173)
- **Build Output**: Static files (dist/)

## Backend (Pending Integration)
- **Blockchain**: Stellar Network
- **Payment**: USDC on Stellar
- **Storage**: MongoDB + Mongoose (to be integrated)
- **API**: Node.js + Express (to be integrated)

## Current State
All backend functionality is mocked in `src/lib/mock-backend.ts`:
- Wallet connection simulation
- Content purchase simulation  
- Data stored in localStorage

## Next Steps
1. Install Stellar SDK
2. Integrate with Stellar wallet (Freighter/Albedo)
3. Connect to MongoDB backend
4. Replace mock-backend.ts with real API calls
