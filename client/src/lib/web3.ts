import { createConfig, http } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Contract addresses from environment variables
export const VESTING_CONTRACT_ADDRESS = import.meta.env.VITE_VESTING_CONTRACT_ADDRESS as `0x${string}`;
export const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS as `0x${string}`;

// Chain configuration
export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 11155111;
export const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID';

// Wagmi configuration
export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id',
    }),
  ],
  transports: {
    [sepolia.id]: http(RPC_URL),
    [mainnet.id]: http(),
  },
});

// Sample vesting contract ABI - minimal interface for demonstration
export const VESTING_CONTRACT_ABI = [
  {
    inputs: [{ name: 'beneficiary', type: 'address' }],
    name: 'releasable',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'beneficiary', type: 'address' }],
    name: 'released',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'release',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'beneficiary', type: 'address' }],
    name: 'vestedAmount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalAllocation',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStartTime',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDuration',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCliffDuration',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Helper function to format token amounts
export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const formatted = Number(amount) / Number(divisor);
  return formatted.toFixed(6);
}

// Helper function to parse token amounts
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  const factor = BigInt(10 ** decimals);
  return BigInt(Math.floor(parseFloat(amount) * Number(factor)));
}