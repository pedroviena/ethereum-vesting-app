import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { VestingContract } from "@shared/schema";

interface PortfolioSummaryProps {
  contracts: VestingContract[];
}

export function PortfolioSummary({ contracts }: PortfolioSummaryProps) {
  const totalValue = contracts.reduce((sum, contract) => sum + parseFloat(contract.totalTokens), 0);
  const totalVested = contracts.reduce((sum, contract) => sum + parseFloat(contract.vestedTokens), 0);
  const totalRemaining = totalValue - totalVested;
  const totalAvailable = contracts.reduce((sum, contract) => {
    const vested = parseFloat(contract.vestedTokens);
    const claimed = parseFloat(contract.claimedTokens);
    return sum + (vested - claimed);
  }, 0);

  const stats = [
    {
      label: "Total Value",
      value: `$${(totalValue * 1.2).toLocaleString()}`, // Mock USD conversion
      color: "text-foreground",
    },
    {
      label: "Total Vested",
      value: `$${(totalVested * 1.2).toLocaleString()}`,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total Remaining",
      value: `$${(totalRemaining * 1.2).toLocaleString()}`,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Available to Claim",
      value: `$${(totalAvailable * 1.2).toLocaleString()}`,
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
