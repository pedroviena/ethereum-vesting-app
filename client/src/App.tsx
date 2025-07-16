import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { WalletProvider } from "@/hooks/use-wallet";
import { WalletConnect } from "@/components/wallet-connect";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Coins } from "lucide-react";
import { motion } from "framer-motion";
import Dashboard from "@/pages/dashboard";
import Web3Dashboard from "@/pages/web3-dashboard";
import NotFound from "@/pages/not-found";
import { config } from "@/lib/web3";
import { useState } from "react";
import Help from "@/pages/help";
import TermsAndPrivacy from "./pages/terms";

function Navigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Coins className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="text-lg sm:text-xl font-bold">VestFlow</div>
          </motion.div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a href="/help" className="hidden sm:block text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1">Help</a>
            <a href="/terms" className="hidden sm:block text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1">Terms & Privacy</a>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover-lift w-8 h-8 sm:w-10 sm:h-10"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Token Vesting Dashboard</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Connect your wallet and claim tokens directly from smart contracts on Ethereum
          </p>
        </motion.div>
        <Switch>
          <Route path="/" component={Web3Dashboard} />
          <Route path="/help" component={Help} />
          <Route path="/terms" component={TermsAndPrivacy} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <WalletProvider>
            <TooltipProvider>
              <Toaster />
              <AppContent />
            </TooltipProvider>
          </WalletProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
