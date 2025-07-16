import { motion } from "framer-motion";
import { Coins, Lock, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { useVestingContractInfo } from "@/hooks/use-web3-vesting";
import { Web3VestingCard } from "@/components/web3-vesting-card";

export default function Web3Dashboard() {
  const { isConnected, walletAddress } = useWallet();
  const { data: contractInfo, isLoading, error } = useVestingContractInfo(walletAddress);

  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
            <Lock className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">Connect Your Wallet</h3>
          <p className="text-muted-foreground mb-8">
            Connect your Web3 wallet to view your vesting contracts and claim tokens directly from the blockchain.
          </p>
          <Button className="hover-lift">
            <Coins className="mr-2 h-4 w-4" />
            Learn More About Web3 Vesting
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Loading Contract Data</h3>
          <p className="text-muted-foreground">
            Fetching your vesting information from the blockchain...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-4">Contract Connection Error</h3>
          <p className="text-muted-foreground mb-8">
            Unable to connect to the vesting contract. Please check your network connection and try again.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="hover-lift"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!contractInfo || !contractInfo.isActive) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
            <Lock className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">No Active Vesting Contract</h3>
          <p className="text-muted-foreground mb-8">
            This wallet address doesn't have any active vesting contracts on the connected network.
          </p>
          <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
            <p>Connected to: <strong>{walletAddress}</strong></p>
            <p>Make sure you're on the correct network (Sepolia Testnet)</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Your Web3 Vesting Contract</h2>
        <p className="text-muted-foreground">
          Connected to smart contract on Sepolia Testnet
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        <Web3VestingCard />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-muted/30 p-6 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-4">Contract Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Contract Address:</span>
            <p className="font-mono text-xs break-all">{import.meta.env.VITE_VESTING_CONTRACT_ADDRESS}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Network:</span>
            <p>Sepolia Testnet</p>
          </div>
          <div>
            <span className="text-muted-foreground">Your Address:</span>
            <p className="font-mono text-xs break-all">{walletAddress}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total Allocation:</span>
            <p>{contractInfo.totalAllocation} tokens</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}