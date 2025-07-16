// Token Vesting Contract ABI - Complete interface for production use
export const VESTING_CONTRACT_ABI = [
  // View functions
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
  {
    inputs: [],
    name: 'getBeneficiary',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getToken',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRevocable',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRevoked',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [],
    name: 'release',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'token', type: 'address' }],
    name: 'release',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'token', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'TokensReleased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'token', type: 'address' },
    ],
    name: 'TokenVestingRevoked',
    type: 'event',
  },
] as const;

// ERC20 Token ABI - for token interaction
export const ERC20_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const;

// Factory Contract ABI - for creating new vesting contracts
export const FACTORY_ABI = [
  {
    inputs: [
      { name: 'beneficiary', type: 'address' },
      { name: 'start', type: 'uint256' },
      { name: 'cliffDuration', type: 'uint256' },
      { name: 'duration', type: 'uint256' },
      { name: 'revocable', type: 'bool' },
      { name: 'token', type: 'address' },
    ],
    name: 'createVestingContract',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'beneficiary', type: 'address' }],
    name: 'getVestingContracts',
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'beneficiary', type: 'address' },
      { indexed: true, name: 'vestingContract', type: 'address' },
      { indexed: false, name: 'token', type: 'address' },
    ],
    name: 'VestingContractCreated',
    type: 'event',
  },
] as const;

// Type definitions for contract interactions
export type VestingContractData = {
  beneficiary: `0x${string}`;
  token: `0x${string}`;
  totalAllocation: bigint;
  startTime: bigint;
  duration: bigint;
  cliffDuration: bigint;
  vestedAmount: bigint;
  releasableAmount: bigint;
  releasedAmount: bigint;
  revocable: boolean;
  revoked: boolean;
};

export type TokenData = {
  name: string;
  symbol: string;
  decimals: number;
  balance: bigint;
};