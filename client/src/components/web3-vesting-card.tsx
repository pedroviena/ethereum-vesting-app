import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Coins, Download, Clock, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Confetti } from "@/components/confetti";
import { useVestingContractInfo, useClaimVestedTokens, useNetworkValidation } from "@/hooks/use-web3-vesting";
import { useWallet } from "@/hooks/use-wallet";

export function Web3VestingCard() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { walletAddress } = useWallet();
  const { toast } = useToast();
  const { isValidNetwork, currentNetwork } = useNetworkValidation();
  
  const { data: contractInfo, isLoading, error } = useVestingContractInfo(walletAddress);
  const { claimTokens, isPending, isConfirming, isSuccess, error: claimError, hash } = useClaimVestedTokens();

  const handleClaim = async () => {
    if (!isValidNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia testnet to claim tokens.",
        variant: "destructive",
      });
      return;
    }

    if (!contractInfo || parseFloat(contractInfo.releasableAmount) <= 0) return;

    try {
      await claimTokens();
      setShowConfetti(true);
      
      toast({
        title: "Transaction Submitted",
        description: "Your claim transaction has been submitted to the blockchain.",
      });
    } catch (error) {
      console.error('Claim transaction failed:', error);
      toast({
        title: "Transaction Failed",
        description: "Failed to submit claim transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle transaction success
  if (isSuccess && !showConfetti) {
    setShowConfetti(true);
    toast({
      title: "Tokens Claimed Successfully!",
      description: `Your tokens have been successfully claimed and transferred to your wallet.`,
    });
  }

  if (isLoading) {
    return (
      <Card className="hover-lift transition-all duration-300 border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-3 bg-gray-300 rounded w-12"></div>
              </div>
            </div>
            <div className="h-2 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-gray-300 rounded"></div>
              <div className="h-16 bg-gray-300 rounded"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="hover-lift transition-all duration-300 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load vesting contract data</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contractInfo) {
    return null;
  }

  const totalTokens = parseFloat(contractInfo.totalAllocation);
  const vestedTokens = parseFloat(contractInfo.vestedAmount);
  const releasableTokens = parseFloat(contractInfo.releasableAmount);
  const releasedTokens = parseFloat(contractInfo.releasedAmount);
  const remainingTokens = totalTokens - vestedTokens;
  const progressPercentage = totalTokens > 0 ? (vestedTokens / totalTokens) * 100 : 0;

  const isClaimable = releasableTokens > 0;
  const gradientClass = "bg-gradient-to-br from-blue-500 to-purple-600";

  // Calculate dates from contract info
  const startDate = new Date(contractInfo.startTime * 1000);
  const endDate = new Date((contractInfo.startTime + contractInfo.duration) * 1000);
  const cliffDate = new Date((contractInfo.startTime + contractInfo.cliffDuration) * 1000);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="hover-lift transition-all duration-300 border-border/50 hover:border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${gradientClass}`}>
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Token Vesting</h3>
                  <Badge variant="secondary" className="text-xs">
                    Smart Contract
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {totalTokens.toLocaleString()} {contractInfo.tokenInfo.symbol}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Allocation
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Vesting Progress</span>
                <span className="text-sm text-muted-foreground">{progressPercentage.toFixed(1)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {vestedTokens.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Vested</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {remainingTokens.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Vesting End</span>
                <span className="font-medium">
                  {endDate.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Already Claimed</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {releasedTokens.toFixed(2)} Tokens
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available to Claim</span>
                <span className={`font-medium ${isClaimable ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                  {isClaimable ? `${releasableTokens.toFixed(2)} Tokens` : 'Not Ready'}
                </span>
              </div>
            </div>

            <Button
              onClick={handleClaim}
              disabled={!isClaimable || isPending || isConfirming}
              className={`w-full font-medium transition-all duration-300 hover-lift ${
                isClaimable
                  ? `${gradientClass} hover:opacity-90 text-white`
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isPending || isConfirming ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Clock className="h-4 w-4" />
                  </motion.div>
                  {isPending ? 'Submitting...' : 'Confirming...'}
                </>
              ) : isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Claimed Successfully
                </>
              ) : isClaimable ? (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Claim Available Tokens
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Vesting in Progress
                </>
              )}
            </Button>

            {hash && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700 dark:text-green-300 text-sm">
                  <Check className="w-4 h-4" />
                  <span className="font-medium">Transaction Hash:</span>
                  <a 
                    href={`${currentNetwork?.blockExplorer || 'https://sepolia.etherscan.io'}/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    {hash.slice(0, 8)}...{hash.slice(-6)}
                  </a>
                </div>
              </div>
            )}

            {!isValidNetwork && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-300 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Please switch to Sepolia testnet to use this feature</span>
                </div>
              </div>
            )}

            {claimError && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Transaction failed: {claimError.message}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <Confetti 
        active={showConfetti} 
        onComplete={() => setShowConfetti(false)}
      />
    </>
  );
}