import { createContext, useContext } from "react";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface WalletContextValue {
  isConnected: boolean;
  walletAddress: `0x${string}` | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const connectWallet = async () => {
    try {
      let connector;
      
      if (isMobile) {
        // No mobile, prioriza WalletConnect, depois MetaMask, depois injected
        connector = connectors.find(c => c.id === 'walletConnect') 
          || connectors.find(c => c.id === 'metaMask') 
          || connectors.find(c => c.id === 'injected') 
          || connectors[0];
      } else {
        // No desktop, prioriza MetaMask, depois injected, depois WalletConnect
        connector = connectors.find(c => c.id === 'metaMask') 
          || connectors.find(c => c.id === 'injected') 
          || connectors.find(c => c.id === 'walletConnect') 
          || connectors[0];
      }

      if (connector) {
        await connect({ connector });
      } else {
        throw new Error('No wallet connector available');
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      
      let errorMessage = "Failed to connect wallet. Please try again.";
      
      if (error.message?.includes('User rejected')) {
        errorMessage = "Connection was cancelled by user.";
      } else if (error.message?.includes('No wallet connector available')) {
        errorMessage = "No wallet found. Please install MetaMask or another Web3 wallet.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Please switch to Sepolia testnet in your wallet.";
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      walletAddress: address || null,
      isConnecting: isPending,
      connectWallet,
      disconnectWallet,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
