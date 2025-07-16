# VestFlow - Token Vesting Dashboard

A professional-grade Web3 token vesting management application built with React, TypeScript, and Ethereum smart contracts. Features premium Apple/Stripe-inspired design with smooth animations and real blockchain integration.

## Features

- **Real Web3 Integration**: Connect MetaMask and WalletConnect wallets
- **Smart Contract Interaction**: Direct calls to vesting contracts on Ethereum Sepolia
- **Premium UI**: Apple/Stripe-inspired design with smooth animations
- **Dual Mode**: Switch between mock demo and real Web3 functionality
- **Automatic Fee Collection**: Built-in fee collection for all transactions
- **Production Ready**: Optimized for Vercel deployment

## Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
# Web3 Configuration - Frontend (VITE_ prefix required)
VITE_MAINNET_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
VITE_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
VITE_ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
VITE_FEE_RECIPIENT=0xYourFeeRecipientAddress
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Contract Configuration
VITE_FACTORY_ADDRESS=0xYourFactoryContractAddress
VITE_VESTING_CONTRACT_ADDRESS=0xYourVestingContractAddress
VITE_CHAIN_ID=11155111

# Backend Configuration (Server-side only)
MAINNET_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_private_key_for_backend_operations
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
FEE_RECIPIENT=0xYourFeeRecipientAddress
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5000` to see the application.

## Using the dApp

### Switching to Web3 Mode

1. Click the "Web3 Mode" toggle in the navigation
2. Connect your MetaMask wallet
3. Ensure you're on the Sepolia testnet (Chain ID: 11155111)
4. The app will automatically fetch your real vesting contract data

### Mock Mode

The app also includes a mock mode for demonstration purposes with simulated vesting contracts and transactions.

## Smart Contract Integration

### Contract ABI Configuration

The application uses dynamic ABI loading from `client/src/lib/abis.ts`. To update contract interfaces:

1. Edit `client/src/lib/abis.ts`
2. Update the `VESTING_CONTRACT_ABI`, `ERC20_ABI`, or `FACTORY_ABI` arrays
3. Restart the development server

### Contract Address Configuration

Contract addresses are configured via environment variables:

- `VITE_VESTING_CONTRACT_ADDRESS`: Main vesting contract
- `VITE_FACTORY_ADDRESS`: Factory contract for creating new vesting contracts
- `VITE_FEE_RECIPIENT`: Address to receive fees from transactions

### Fee Collection

Every transaction includes an automatic fee sent to the `FEE_RECIPIENT` address:

- **Token Claims**: 0.001 ETH fee per claim
- **Contract Creation**: 0.001 ETH fee per new vesting contract
- **Gas Limit**: 300,000 gas limit for all transactions

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Environment Variables**
   Add all the environment variables from your `.env` file to the Vercel dashboard under Settings > Environment Variables.

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**
   The built application will be in the `dist` directory, ready for deployment to any static hosting service.

## Production Configuration

### Environment Variables for Production

Ensure these variables are set in your production environment:

```bash
# Required for Web3 functionality
VITE_MAINNET_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
VITE_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
VITE_FEE_RECIPIENT=0xYourFeeRecipientAddress

# Contract addresses
VITE_VESTING_CONTRACT_ADDRESS=0xYourVestingContractAddress
VITE_FACTORY_ADDRESS=0xYourFactoryContractAddress

# Network configuration
VITE_CHAIN_ID=11155111
```

### Updating Contract Addresses

To deploy with different contract addresses:

1. Update the environment variables in your deployment platform
2. Redeploy the application
3. No code changes required - the app reads addresses dynamically

## Smart Contract Requirements

Your vesting contracts should implement these functions:

```solidity
// View functions
function getTotalAllocation() external view returns (uint256);
function getStartTime() external view returns (uint256);
function getDuration() external view returns (uint256);
function getCliffDuration() external view returns (uint256);
function getBeneficiary() external view returns (address);
function getToken() external view returns (address);
function getRevocable() external view returns (bool);
function getRevoked() external view returns (bool);
function vestedAmount(address beneficiary) external view returns (uint256);
function releasable(address beneficiary) external view returns (uint256);
function released(address beneficiary) external view returns (uint256);

// Write functions
function release() external payable;
function release(address token) external payable;
```

## Technical Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Web3**: Wagmi, Viem, RainbowKit for wallet connections
- **Backend**: Express.js, Node.js (for mock mode)
- **Database**: PostgreSQL with Drizzle ORM (for mock mode)
- **Deployment**: Vercel optimized

## Development

### File Structure

```
client/
├── src/
│   ├── components/       # UI components
│   ├── hooks/           # React hooks for Web3 and state
│   ├── lib/             # Utilities and configurations
│   ├── pages/           # Page components
│   └── App.tsx          # Main application component
├── lib/
│   ├── abis.ts          # Smart contract ABIs
│   ├── web3.ts          # Web3 configuration
│   └── utils.ts         # Utility functions
server/                  # Backend for mock mode
shared/                  # Shared types and schemas
```

### Key Files

- `client/src/lib/web3.ts`: Web3 configuration and utilities
- `client/src/lib/abis.ts`: Smart contract ABIs
- `client/src/hooks/use-web3-vesting.tsx`: Web3 vesting hooks
- `client/src/components/web3-vesting-card.tsx`: Main vesting interface
- `.env`: Environment configuration

## Support

For issues or questions:

1. Check the console logs for Web3 connection errors
2. Verify your wallet is on the correct network (Sepolia)
3. Ensure contract addresses are correctly configured
4. Check that your MetaMask has sufficient ETH for gas fees

## License

MIT License - see LICENSE file for details.