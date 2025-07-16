import { Button } from "@/components/ui/button";
import { Wallet, Loader2, ExternalLink } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { motion } from "framer-motion";

export function WalletConnect() {
  const { isConnected, walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();

  if (isConnected && walletAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-muted-foreground">Connected</span>
        </div>
        <div className="text-sm font-mono text-muted-foreground">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`https://sepolia.etherscan.io/address/${walletAddress}`, '_blank')}
          className="hover-lift"
        >
          <ExternalLink className="mr-1 h-3 w-3" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="hover-lift"
        >
          Disconnect
        </Button>
      </motion.div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="hover-lift bg-primary hover:bg-primary/90"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
