import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Coins, Download, Clock, Check } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import { useClaimTokens } from "@/hooks/use-vesting";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { Confetti } from "@/components/confetti";
import type { VestingContract } from "@shared/schema";

interface VestingCardProps {
  contract: VestingContract;
  index: number;
}

export function VestingCard({ contract, index }: VestingCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const { walletAddress } = useWallet();
  const { toast } = useToast();
  const claimTokens = useClaimTokens();

  const totalTokens = parseFloat(contract.totalTokens);
  const vestedTokens = parseFloat(contract.vestedTokens);
  const claimedTokens = parseFloat(contract.claimedTokens);
  const remainingTokens = totalTokens - vestedTokens;
  const availableToClaim = vestedTokens - claimedTokens;
  const progressPercentage = (vestedTokens / totalTokens) * 100;

  const gradientColors = JSON.parse(contract.gradientColors);
  const gradientClass = `bg-gradient-to-br ${gradientColors[0]} ${gradientColors[1]}`;

  const handleClaim = async () => {
    if (!walletAddress || availableToClaim <= 0) return;

    try {
      await claimTokens.mutateAsync({
        contractId: contract.id,
        amount: availableToClaim.toString(),
        walletAddress,
      });

      setHasClaimed(true);
      setShowConfetti(true);
      
      toast({
        title: "Tokens Claimed Successfully!",
        description: `${availableToClaim.toFixed(2)} ${contract.tokenSymbol} tokens have been claimed.`,
      });
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Failed to claim tokens. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isClaimable = availableToClaim > 0 && !hasClaimed;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="hover-lift transition-all duration-300 border-border/50 hover:border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${gradientClass}`}>
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{contract.tokenSymbol} Vesting</h3>
                  <Badge variant="secondary" className="text-xs">
                    {contract.contractType}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Tokens</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
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
                <span className="text-muted-foreground">Next Unlock</span>
                <span className="font-medium">
                  {format(new Date(contract.endDate), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available to Claim</span>
                <span className={`font-medium ${isClaimable ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {isClaimable ? `${availableToClaim.toFixed(2)} ${contract.tokenSymbol}` : 'Not Ready'}
                </span>
              </div>
            </div>

            <Button
              onClick={handleClaim}
              disabled={!isClaimable || claimTokens.isPending}
              className={`w-full font-medium transition-all duration-300 hover-lift ${
                isClaimable
                  ? `${gradientClass} hover:opacity-90 text-white`
                  : hasClaimed
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 cursor-not-allowed'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {claimTokens.isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Clock className="h-4 w-4" />
                  </motion.div>
                  Processing...
                </>
              ) : hasClaimed ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Claimed
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
