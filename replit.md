# VestFlow - Token Vesting Dashboard

## Overview

VestFlow is a modern web application for managing and tracking token vesting contracts. Built with React, TypeScript, and Express.js, it provides a comprehensive dashboard for users to view their vesting schedules, claim tokens, and monitor their portfolio performance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for local state
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for smooth transitions and interactions
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple

### Development Setup
- **Monorepo Structure**: Shared types and schemas between client and server
- **Hot Reload**: Vite middleware integration with Express in development
- **Type Safety**: Shared TypeScript types and Zod schemas for validation

## Key Components

### Database Schema
Located in `shared/schema.ts`:
- **vesting_contracts**: Stores vesting contract details including token amounts, dates, and wallet addresses
- **transactions**: Tracks claim transactions with status and blockchain hashes
- **Data Types**: Uses decimal precision for token amounts, timestamps for dates

### API Endpoints
- `GET /api/vesting/:walletAddress` - Fetch vesting contracts for a wallet
- `GET /api/vesting/contract/:id` - Get specific contract details
- `POST /api/claim` - Process token claiming with blockchain simulation

### UI Components
- **VestingCard**: Displays individual vesting contract information with claim functionality
- **PortfolioSummary**: Shows aggregated portfolio metrics
- **WalletConnect**: Mock wallet connection component
- **Theme Provider**: Light/dark mode toggle functionality

### State Management
- **React Query**: Handles API calls, caching, and optimistic updates
- **Wallet Context**: Manages wallet connection state (currently mocked)
- **Toast System**: User feedback for actions and errors

## Data Flow

**Web3 Mode (NEW)**
1. **Wallet Connection**: Real Web3 wallet connection via Wagmi + Viem
2. **Smart Contract Interaction**: Direct calls to vesting contracts on Sepolia
3. **Real-time Blockchain Data**: Live token balances and vesting information
4. **Transaction Execution**: Actual blockchain transactions for token claims
5. **Network Status**: Connection to Sepolia testnet with proper error handling

**Mock Mode (Original)**
1. **User Authentication**: Mock wallet connection provides a demo wallet address
2. **Data Fetching**: React Query fetches vesting contracts from the API
3. **Real-time Updates**: Optimistic updates when claiming tokens
4. **Transaction Simulation**: Claims generate mock blockchain transaction hashes
5. **Portfolio Calculation**: Client-side aggregation of contract data for summary metrics

## External Dependencies

### Frontend Dependencies
- **UI Framework**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for enhanced user experience
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date formatting and manipulation
- **Web3 Integration**: Wagmi + Viem for blockchain interactions
- **Wallet Connection**: Support for MetaMask and WalletConnect

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod schemas for request validation
- **Session Storage**: PostgreSQL session store
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Vite Plugins**: React plugin, runtime error overlay, Replit cartographer
- **TypeScript**: Strict mode with path mapping for clean imports
- **ESLint/Prettier**: Code quality and formatting (implied by project structure)

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle Kit handles schema migrations
4. **Environment Variables**: DATABASE_URL required for production

### Production Configuration
- **Static Assets**: Served from `dist/public` directory
- **API Routes**: Express server handles `/api` routes
- **Database**: PostgreSQL connection via environment variable
- **Session Storage**: Persistent sessions in PostgreSQL

### Development Workflow
- **Hot Reload**: Vite dev server with Express middleware
- **Database Push**: `db:push` command for schema synchronization
- **TypeScript Checking**: `check` command for type validation
- **Mock Data**: In-memory storage with sample vesting contracts for development

The application uses a mock wallet system for demonstration purposes, but the architecture supports real Web3 wallet integration. The database schema and API are designed to handle real blockchain interactions when integrated with actual smart contracts.