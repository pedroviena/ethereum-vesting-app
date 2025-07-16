import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { VestingContract } from "@shared/schema";

export function useVestingContracts(walletAddress: string | null) {
  return useQuery({
    queryKey: ["/api/vesting", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      const response = await fetch(`/api/vesting/${walletAddress}`);
      if (!response.ok) throw new Error("Failed to fetch vesting contracts");
      return response.json() as Promise<VestingContract[]>;
    },
    enabled: !!walletAddress,
  });
}

export function useClaimTokens() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contractId, amount, walletAddress }: {
      contractId: number;
      amount: string;
      walletAddress: string;
    }) => {
      const response = await apiRequest("POST", "/api/claim", {
        contractId,
        amount,
        walletAddress,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/vesting", variables.walletAddress] });
    },
  });
}

export function useVestingContract(contractId: number) {
  return useQuery({
    queryKey: ["/api/vesting/contract", contractId],
    queryFn: async () => {
      const response = await fetch(`/api/vesting/contract/${contractId}`);
      if (!response.ok) throw new Error("Failed to fetch contract");
      return response.json() as Promise<VestingContract>;
    },
    enabled: !!contractId,
  });
}
