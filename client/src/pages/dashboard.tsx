import { motion } from "framer-motion";
import { Coins, Lock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/hooks/use-wallet";
import { useVestingContracts } from "@/hooks/use-vesting";
import { VestingCard } from "@/components/vesting-card";
import { PortfolioSummary } from "@/components/portfolio-summary";

export default function Dashboard() {
  const { isConnected, walletAddress } = useWallet();
  const { data: contracts, isLoading, error } = useVestingContracts(walletAddress);

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
          <h3 className="text-2xl font-semibold mb-4">No Vesting Contracts Found</h3>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to view your vesting schedules, or contact your team if you expect to have contracts.
          </p>
          <Button className="hover-lift">
            <Coins className="mr-2 h-4 w-4" />
            Learn More
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-full mb-6" />
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
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
          <h3 className="text-2xl font-semibold mb-4">Error Loading Contracts</h3>
          <p className="text-muted-foreground mb-8">
            There was an error loading your vesting contracts. Please try again.
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

  if (!contracts || contracts.length === 0) {
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
          <h3 className="text-2xl font-semibold mb-4">No Vesting Contracts Found</h3>
          <p className="text-muted-foreground mb-8">
            You don't have any vesting contracts associated with this wallet address.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map((contract, index) => (
          <VestingCard key={contract.id} contract={contract} index={index} />
        ))}
      </div>
      
      <PortfolioSummary contracts={contracts} />
    </div>
  );
}
