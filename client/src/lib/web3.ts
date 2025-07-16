import { createConfig, http } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { injected, walletConnect, metaMask } from 'wagmi/connectors';
import { parseEther } from 'viem';

// Contract addresses from environment variables
export const VESTING_CONTRACT_ADDRESS = import.meta.env.VITE_VESTING_CONTRACT_ADDRESS as `0x${string}`;
export const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS as `0x${string}`;
export const FEE_RECIPIENT = import.meta.env.VITE_FEE_RECIPIENT as `0x${string}`;

// Chain configuration
export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 11155111;
export const MAINNET_URL = import.meta.env.VITE_MAINNET_URL;
export const SEPOLIA_URL = import.meta.env.VITE_SEPOLIA_URL;
export const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

// Network configuration
export const SUPPORTED_NETWORKS = {
  mainnet: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: MAINNET_URL,
    blockExplorer: 'https://etherscan.io',
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: SEPOLIA_URL,
    blockExplorer: 'https://sepolia.etherscan.io',
  },
};

// Wagmi configuration
export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id',
    }),
    metaMask(), // Adicionado connector MetaMask
  ],
  transports: {
    [sepolia.id]: http(SEPOLIA_URL),
    [mainnet.id]: http(MAINNET_URL),
  },
});

// Fee configuration
export const FEE_AMOUNT = parseEther('0.001'); // 0.001 ETH fee for each transaction
export const GAS_LIMIT = 300000n; // Default gas limit for transactions

// Utility functions for token amount formatting
export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const divisor = 10n ** BigInt(decimals);
  const wholePart = amount / divisor;
  const fractionalPart = amount % divisor;
  
  if (fractionalPart === 0n) {
    return wholePart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');
  
  return `${wholePart}.${trimmedFractional}`;
}

export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  const [wholePart, fractionalPart = ''] = amount.split('.');
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(wholePart) * (10n ** BigInt(decimals)) + BigInt(paddedFractional);
}