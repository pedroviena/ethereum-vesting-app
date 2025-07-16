import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface WalletContextValue {
  isConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Mock wallet address for demonstration
  const mockWalletAddress = "0x742d35Cc6634C0532925a3b8D000000000000000";

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setWalletAddress(mockWalletAddress);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${mockWalletAddress.slice(0, 6)}...${mockWalletAddress.slice(-4)}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      walletAddress,
      isConnecting,
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
