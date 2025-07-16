import { createContext, useContext } from "react";
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";

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

  const connectWallet = async () => {
    try {
      // Prioriza o connector metaMask, depois injected, depois o primeiro disponível
      const connector = connectors.find(c => c.id === 'metaMask') 
        || connectors.find(c => c.id === 'injected') 
        || connectors[0];
      if (connector) {
        await connect({ connector }); // Aguarda a Promise
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
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
