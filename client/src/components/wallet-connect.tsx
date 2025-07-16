import { Button } from "@/components/ui/button";
import { Wallet, Loader2, ExternalLink } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export function WalletConnect() {
  const { isConnected, walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const isMobile = useIsMobile();

  if (isConnected && walletAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 sm:space-x-3"
      >
        <div className="hidden sm:flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-muted-foreground">Connected</span>
        </div>
        <div className="text-xs sm:text-sm font-mono text-muted-foreground">
          {isMobile ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`https://sepolia.etherscan.io/address/${walletAddress}`, '_blank')}
          className="hover-lift hidden sm:flex"
        >
          <ExternalLink className="mr-1 h-3 w-3" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="hover-lift text-xs sm:text-sm px-2 sm:px-3"
        >
          {isMobile ? "Disconnect" : "Disconnect"}
        </Button>
      </motion.div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="hover-lift bg-primary hover:bg-primary/90 text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
          {isMobile ? "Connecting..." : "Connecting..."}
        </>
      ) : (
        <>
          <Wallet className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          {isMobile ? "Connect" : "Connect Wallet"}
        </>
      )}
    </Button>
  );
}
