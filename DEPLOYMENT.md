# VestFlow - Production Deployment Guide

## Quick Deploy to Vercel

### Step 1: Prepare Environment Variables

Create these environment variables in your Vercel dashboard:

```bash
# Required Web3 Configuration
VITE_MAINNET_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
VITE_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
VITE_ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
VITE_FEE_RECIPIENT=0xYourFeeRecipientAddress

# Smart Contract Addresses
VITE_FACTORY_ADDRESS=0xYourFactoryContractAddress
VITE_VESTING_CONTRACT_ADDRESS=0xYourVestingContractAddress
VITE_CHAIN_ID=11155111

# Optional: WalletConnect
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Step 2: Deploy to Vercel

1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Or via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Add the environment variables above
   - Deploy

### Step 3: Update Smart Contract Addresses

After deployment, you can update contract addresses anytime by:
1. Going to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Updating the contract addresses
3. Redeploying (happens automatically)

## Contract Requirements

Your smart contracts must implement these interfaces:

### Vesting Contract Interface
```solidity
interface IVestingContract {
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
    
    // Write functions (must be payable to receive fees)
    function release() external payable;
    function release(address token) external payable;
    
    // Events
    event TokensReleased(address indexed token, uint256 amount);
    event TokenVestingRevoked(address indexed token);
}
```

### Factory Contract Interface
```solidity
interface IVestingFactory {
    function createVestingContract(
        address beneficiary,
        uint256 start,
        uint256 cliffDuration,
        uint256 duration,
        bool revocable,
        address token
    ) external payable returns (address);
    
    function getVestingContracts(address beneficiary) external view returns (address[]);
    
    event VestingContractCreated(
        address indexed beneficiary,
        address indexed vestingContract,
        address token
    );
}
```

## Fee Integration

The dApp automatically includes a 0.001 ETH fee with every transaction:
- **Token Claims**: Fee sent to `FEE_RECIPIENT` on each claim
- **Contract Creation**: Fee sent to `FEE_RECIPIENT` on contract creation
- **Gas Limit**: 300,000 gas limit for all transactions

Ensure your smart contracts can receive ETH fees:
```solidity
function release() external payable {
    // Fee is automatically sent to FEE_RECIPIENT
    // Your contract logic here
}
```

## Testing on Sepolia

1. **Get Sepolia ETH**
   - Use [Sepolia Faucet](https://sepoliafaucet.com/)
   - Or [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

2. **Deploy Contracts**
   - Deploy your vesting contracts to Sepolia
   - Update the environment variables with contract addresses

3. **Test Features**
   - Connect MetaMask to Sepolia
   - Test token claiming with real transactions
   - Verify fee collection works correctly

## Production Checklist

### Before Going Live:
- [ ] Smart contracts audited and deployed
- [ ] Contract addresses updated in environment variables
- [ ] Fee recipient address configured
- [ ] Alchemy API keys configured
- [ ] Etherscan API key configured
- [ ] WalletConnect project ID configured
- [ ] Network switching works correctly
- [ ] Transaction fees are collected properly

### Post-Deployment:
- [ ] Test wallet connection (MetaMask, WalletConnect)
- [ ] Test token claiming functionality
- [ ] Verify transaction hashes link to Etherscan
- [ ] Test network validation (wrong network warnings)
- [ ] Verify fee collection to recipient address
- [ ] Test with multiple wallet addresses

## Troubleshooting

### Common Issues:

1. **"Wrong Network" Error**
   - Ensure user is on Sepolia testnet (Chain ID: 11155111)
   - Check that `VITE_CHAIN_ID` matches your network

2. **Contract Connection Failed**
   - Verify contract addresses are correct
   - Check that contracts are deployed and verified
   - Ensure ABI matches your contract interface

3. **Transaction Fails**
   - Check user has sufficient ETH for gas + fees
   - Verify contract functions are payable
   - Check gas limits are sufficient

4. **Fee Collection Issues**
   - Ensure `FEE_RECIPIENT` address is correct
   - Verify contracts can receive ETH
   - Check fee amount in `FEE_AMOUNT` constant

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_MAINNET_URL` | Alchemy Mainnet RPC URL | `https://eth-mainnet.g.alchemy.com/v2/...` |
| `VITE_SEPOLIA_URL` | Alchemy Sepolia RPC URL | `https://eth-sepolia.g.alchemy.com/v2/...` |
| `VITE_ETHERSCAN_API_KEY` | Etherscan API key | `MGIQPJRXNUV97G3KARPVYZFX6EWUF979DI` |
| `VITE_FEE_RECIPIENT` | Your fee collection address | `0xECdc63133B1334AeAD6F749a1F99a9EA39dd3aB0` |
| `VITE_FACTORY_ADDRESS` | Factory contract address | `0x742d35Cc6634C0532925a3b8D000000000000000` |
| `VITE_VESTING_CONTRACT_ADDRESS` | Main vesting contract | `0x1234567890123456789012345678901234567890` |
| `VITE_CHAIN_ID` | Network chain ID | `11155111` (Sepolia) |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | `your_project_id` |

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Test with a fresh wallet on Sepolia testnet
4. Ensure contracts are deployed and verified on Etherscan