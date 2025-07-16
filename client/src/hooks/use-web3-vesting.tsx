import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { VESTING_CONTRACT_ABI, VESTING_CONTRACT_ADDRESS, formatTokenAmount } from '@/lib/web3';

export interface VestingContractInfo {
  totalAllocation: string;
  vestedAmount: string;
  releasableAmount: string;
  releasedAmount: string;
  startTime: number;
  duration: number;
  cliffDuration: number;
  isActive: boolean;
}

export function useVestingContractInfo(walletAddress: `0x${string}` | undefined) {
  // Read contract data
  const { data: totalAllocation } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'getTotalAllocation',
    query: { enabled: !!walletAddress }
  });

  const { data: vestedAmount } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'vestedAmount',
    args: walletAddress ? [walletAddress] : undefined,
    query: { enabled: !!walletAddress }
  });

  const { data: releasableAmount } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'releasable',
    args: walletAddress ? [walletAddress] : undefined,
    query: { enabled: !!walletAddress }
  });

  const { data: releasedAmount } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'released',
    args: walletAddress ? [walletAddress] : undefined,
    query: { enabled: !!walletAddress }
  });

  const { data: startTime } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'getStartTime',
    query: { enabled: !!walletAddress }
  });

  const { data: duration } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'getDuration',
    query: { enabled: !!walletAddress }
  });

  const { data: cliffDuration } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'getCliffDuration',
    query: { enabled: !!walletAddress }
  });

  return useQuery({
    queryKey: ['vestingContract', walletAddress, totalAllocation, vestedAmount, releasableAmount, releasedAmount, startTime, duration, cliffDuration],
    queryFn: (): VestingContractInfo => {
      if (!totalAllocation || !vestedAmount || !releasableAmount || !releasedAmount || !startTime || !duration || !cliffDuration) {
        throw new Error('Contract data not available');
      }

      return {
        totalAllocation: formatTokenAmount(totalAllocation),
        vestedAmount: formatTokenAmount(vestedAmount),
        releasableAmount: formatTokenAmount(releasableAmount),
        releasedAmount: formatTokenAmount(releasedAmount),
        startTime: Number(startTime),
        duration: Number(duration),
        cliffDuration: Number(cliffDuration),
        isActive: Number(releasableAmount) > 0 || Number(vestedAmount) > 0
      };
    },
    enabled: !!walletAddress && !!totalAllocation && !!vestedAmount && !!releasableAmount && !!releasedAmount && !!startTime && !!duration && !!cliffDuration
  });
}

export function useClaimVestedTokens() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claimTokens = async () => {
    writeContract({
      address: VESTING_CONTRACT_ADDRESS,
      abi: VESTING_CONTRACT_ABI,
      functionName: 'release',
    });
  };

  return {
    claimTokens,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
}

// Hook for multiple vesting contracts (if user has multiple)
export function useMultipleVestingContracts(walletAddress: `0x${string}` | undefined, contractAddresses: `0x${string}`[]) {
  return useQuery({
    queryKey: ['multipleVestingContracts', walletAddress, contractAddresses],
    queryFn: async () => {
      if (!walletAddress || !contractAddresses.length) return [];

      // This would typically call a factory contract or use a subgraph
      // For now, we'll return the single contract configured
      return contractAddresses.map(address => ({
        address,
        // This would be populated by actual contract calls
        totalAllocation: '0',
        vestedAmount: '0',
        releasableAmount: '0',
        releasedAmount: '0',
        startTime: 0,
        duration: 0,
        cliffDuration: 0,
        isActive: false
      }));
    },
    enabled: !!walletAddress && contractAddresses.length > 0
  });
}