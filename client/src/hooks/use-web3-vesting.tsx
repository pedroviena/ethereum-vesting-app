import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { VESTING_CONTRACT_ABI, ERC20_ABI, FACTORY_ABI } from '@/lib/abis';
import { VESTING_CONTRACT_ADDRESS, FACTORY_ADDRESS, FEE_RECIPIENT, FEE_AMOUNT, GAS_LIMIT, formatTokenAmount, SUPPORTED_NETWORKS } from '@/lib/web3';

export interface VestingContractInfo {
  totalAllocation: string;
  vestedAmount: string;
  releasableAmount: string;
  releasedAmount: string;
  startTime: number;
  duration: number;
  cliffDuration: number;
  isActive: boolean;
  beneficiary: `0x${string}`;
  token: `0x${string}`;
  revocable: boolean;
  revoked: boolean;
  tokenInfo: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export function useNetworkValidation() {
  const chainId = useChainId();
  const { toast } = useToast();
  
  const isValidNetwork = chainId === 1 || chainId === 11155111; // Mainnet or Sepolia
  const currentNetwork = Object.values(SUPPORTED_NETWORKS).find(n => n.id === chainId);
  
  const validateNetwork = () => {
    if (!isValidNetwork) {
      toast({
        title: "Wrong Network",
        description: `Please switch to ${SUPPORTED_NETWORKS.sepolia.name} to use this dApp.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return { isValidNetwork, currentNetwork, validateNetwork };
}

export function useVestingContractInfo(walletAddress: `0x${string}` | undefined) {
  const { validateNetwork } = useNetworkValidation();
  const { toast } = useToast();

  // Read contract data
  const { data: totalAllocation, error: allocationError } = useReadContract({
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

  const { data: beneficiary } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'getBeneficiary',
    query: { enabled: !!walletAddress }
  });

  const { data: token } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'getToken',
    query: { enabled: !!walletAddress }
  });

  const { data: revocable } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'getRevocable',
    query: { enabled: !!walletAddress }
  });

  const { data: revoked } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_CONTRACT_ABI,
    functionName: 'getRevoked',
    query: { enabled: !!walletAddress }
  });

  // Token info
  const { data: tokenName } = useReadContract({
    address: token,
    abi: ERC20_ABI,
    functionName: 'name',
    query: { enabled: !!token }
  });

  const { data: tokenSymbol } = useReadContract({
    address: token,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: { enabled: !!token }
  });

  const { data: tokenDecimals } = useReadContract({
    address: token,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: !!token }
  });

  return useQuery({
    queryKey: ['vestingContract', walletAddress, totalAllocation, vestedAmount, releasableAmount, releasedAmount, startTime, duration, cliffDuration, beneficiary, token, revocable, revoked, tokenName, tokenSymbol, tokenDecimals],
    queryFn: (): VestingContractInfo => {
      if (!validateNetwork()) {
        throw new Error('Invalid network');
      }

      if (!totalAllocation || !vestedAmount || !releasableAmount || !releasedAmount || !startTime || !duration || !cliffDuration || !beneficiary || !token) {
        throw new Error('Contract data not available');
      }

      return {
        totalAllocation: formatTokenAmount(totalAllocation, tokenDecimals || 18),
        vestedAmount: formatTokenAmount(vestedAmount, tokenDecimals || 18),
        releasableAmount: formatTokenAmount(releasableAmount, tokenDecimals || 18),
        releasedAmount: formatTokenAmount(releasedAmount, tokenDecimals || 18),
        startTime: Number(startTime),
        duration: Number(duration),
        cliffDuration: Number(cliffDuration),
        isActive: Number(releasableAmount) > 0 || Number(vestedAmount) > 0,
        beneficiary,
        token,
        revocable: !!revocable,
        revoked: !!revoked,
        tokenInfo: {
          name: tokenName || 'Unknown Token',
          symbol: tokenSymbol || 'UNK',
          decimals: tokenDecimals || 18,
        }
      };
    },
    enabled: !!walletAddress && !!totalAllocation && !!vestedAmount && !!releasableAmount && !!releasedAmount && !!startTime && !!duration && !!cliffDuration && !!beneficiary && !!token,
    retry: 3,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

export function useClaimVestedTokens() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { validateNetwork } = useNetworkValidation();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    onSettled(data, error) {
      if (error) {
        toast({
          title: "Transaction Failed",
          description: "Failed to claim tokens. Please try again.",
          variant: "destructive",
        });
      } else if (data && data.status === 'success') {
        toast({
          title: "Tokens Claimed Successfully!",
          description: "Your tokens have been successfully claimed and transferred to your wallet.",
        });
      }
    },
  });

  const claimTokens = async () => {
    if (!validateNetwork()) {
      throw new Error('Invalid network');
    }

    toast({
      title: "Transaction Submitted",
      description: "Waiting for confirmation on the blockchain...",
    });

    try {
      writeContract({
        address: VESTING_CONTRACT_ADDRESS,
        abi: VESTING_CONTRACT_ABI,
        functionName: 'release',
        value: FEE_AMOUNT, // Include fee for each transaction
        gas: GAS_LIMIT,
      });

      // Invalidate relevant queries after successful submission
      queryClient.invalidateQueries({ 
        queryKey: ['vestingContract'] 
      });
      // O toast de sucesso será disparado pelo onSettled do useWaitForTransactionReceipt
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to submit claim transaction. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
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

// Hook for multiple vesting contracts from factory
export function useMultipleVestingContracts(walletAddress: `0x${string}` | undefined) {
  const { validateNetwork } = useNetworkValidation();

  const { data: contractAddresses } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getVestingContracts',
    args: walletAddress ? [walletAddress] : undefined,
    query: { enabled: !!walletAddress }
  });

  return useQuery({
    queryKey: ['multipleVestingContracts', walletAddress, contractAddresses],
    queryFn: async () => {
      if (!validateNetwork() || !walletAddress || !contractAddresses?.length) return [];

      console.log(`Found ${contractAddresses.length} vesting contracts for ${walletAddress}`);
      
      return contractAddresses.map(address => ({
        address,
        // Additional contract data would be fetched here
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
    enabled: !!walletAddress && !!contractAddresses?.length,
    staleTime: 60000, // 1 minute
  });
}

// Hook for creating new vesting contracts
export function useCreateVestingContract() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { validateNetwork } = useNetworkValidation();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    onSettled(data, error) {
      if (error) {
        toast({
          title: "Transaction Failed",
          description: "Failed to create vesting contract. Please try again.",
          variant: "destructive",
        });
      } else if (data && data.status === 'success') {
        toast({
          title: "Vesting Contract Created!",
          description: "Your vesting contract was created successfully.",
        });
      }
    },
  });

  const createContract = async (params: {
    beneficiary: `0x${string}`;
    start: number;
    cliffDuration: number;
    duration: number;
    revocable: boolean;
    token: `0x${string}`;
  }) => {
    if (!validateNetwork()) {
      throw new Error('Invalid network');
    }

    toast({
      title: "Transaction Submitted",
      description: "Waiting for confirmation on the blockchain...",
    });

    try {
      writeContract({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: 'createVestingContract',
        args: [
          params.beneficiary,
          BigInt(params.start),
          BigInt(params.cliffDuration),
          BigInt(params.duration),
          params.revocable,
          params.token,
        ],
        value: FEE_AMOUNT, // Include fee for contract creation
        gas: GAS_LIMIT,
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ['multipleVestingContracts'] 
      });
      // O toast de sucesso será disparado pelo onSettled do useWaitForTransactionReceipt
    } catch (error) {
      toast({
        title: "Contract Creation Failed",
        description: "Failed to create vesting contract. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    createContract,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  };
}