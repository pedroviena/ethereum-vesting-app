import { motion } from "framer-motion";
import { Coins, Lock, AlertCircle, Loader2, Network, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/use-wallet";
import { useVestingContractInfo, useNetworkValidation, useCreateVestingContract, useMultipleVestingContracts } from "@/hooks/use-web3-vesting";
import { Web3VestingCard } from "@/components/web3-vesting-card";
import { FEE_AMOUNT } from "@/lib/web3";
import { formatEther } from "viem";
import { useState, useEffect } from "react";
import { isAddress } from 'viem';
import { useBalance, useReadContract } from 'wagmi';

export default function Web3Dashboard() {
  const { isConnected, walletAddress } = useWallet();
  const { isValidNetwork, currentNetwork } = useNetworkValidation();
  const { data: contractInfo, isLoading, error } = useVestingContractInfo(walletAddress);
  const { createContract, isPending, isSuccess, isConfirming, error: createError } = useCreateVestingContract();
  const { data: allVestings, isLoading: isLoadingVestings, error: errorVestings } = useMultipleVestingContracts(walletAddress || undefined);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    beneficiary: walletAddress || "",
    token: "",
    start: "",
    cliffDuration: "",
    duration: "",
    revocable: false,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Transaction history state
  const [txHistory, setTxHistory] = useState<any[]>([]);
  const [isLoadingTxs, setIsLoadingTxs] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  // ETH balance
  const { data: ethBalance, isLoading: isLoadingEth } = useBalance({
    address: walletAddress || undefined,
    watch: true,
  });

  // Token balance (ERC20)
  let tokenAddress = '';
  if (contractInfo && contractInfo.token) {
    tokenAddress = contractInfo.token;
  } else if (form.token && /^0x[a-fA-F0-9]{40}$/.test(form.token)) {
    tokenAddress = form.token;
  }
  const { data: tokenBalance, isLoading: isLoadingToken } = useReadContract({
    address: tokenAddress || undefined,
    abi: [
      {
        "constant": true,
        "inputs": [{ "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "name": "", "type": "string" }],
        "type": "function"
      }
    ],
    functionName: 'balanceOf',
    args: tokenAddress && walletAddress ? [walletAddress] : undefined,
    query: { enabled: !!tokenAddress && !!walletAddress },
  });
  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress || undefined,
    abi: [{ "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }],
    functionName: 'decimals',
    query: { enabled: !!tokenAddress },
  });
  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress || undefined,
    abi: [{ "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "type": "function" }],
    functionName: 'symbol',
    query: { enabled: !!tokenAddress },
  });

  useEffect(() => {
    async function fetchTxs() {
      if (!walletAddress) return;
      setIsLoadingTxs(true);
      setTxError(null);
      try {
        // Sepolia Etherscan API (public, limited)
        const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
        const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&sort=desc&apikey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status !== "1") throw new Error(data.message || "No transactions found");
        setTxHistory(data.result.slice(0, 5));
      } catch (err: any) {
        setTxError(err.message || "Failed to fetch transactions");
      } finally {
        setIsLoadingTxs(false);
      }
    }
    fetchTxs();
  }, [walletAddress]);

  // Network warning toast
  useEffect(() => {
    if (!isValidNetwork && isConnected) {
      window.setTimeout(() => {
        if (window?.ethereum) {
          window.dispatchEvent(new CustomEvent('show-network-toast'));
        }
      }, 500);
    }
  }, [isValidNetwork, isConnected]);

  // Handler to switch network
  const handleSwitchToSepolia = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia
        });
      } catch (err) {
        alert('Failed to switch network. Please switch manually in MetaMask.');
      }
    }
  };

  // Toast for wrong network
  useEffect(() => {
    const showToast = () => {
      if (!isValidNetwork && isConnected) {
        const toastDiv = document.createElement('div');
        toastDiv.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-destructive text-white px-6 py-3 rounded shadow-lg flex items-center gap-2';
        toastDiv.innerHTML = `<svg class='w-5 h-5 mr-2' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z'/></svg> Wrong network! Please switch to Sepolia.`;
        document.body.appendChild(toastDiv);
        setTimeout(() => toastDiv.remove(), 5000);
      }
    };
    window.addEventListener('show-network-toast', showToast);
    return () => window.removeEventListener('show-network-toast', showToast);
  }, [isValidNetwork, isConnected]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    // Beneficiary address
    if (!form.beneficiary || !/^0x[a-fA-F0-9]{40}$/.test(form.beneficiary)) {
      errors.beneficiary = "Enter a valid Ethereum address (0x...40 hex chars)";
    }
    // Token address
    if (!form.token || !/^0x[a-fA-F0-9]{40}$/.test(form.token)) {
      errors.token = "Enter a valid ERC20 token address (0x...40 hex chars)";
    }
    // Start date
    if (!form.start) {
      errors.start = "Start date is required";
    } else {
      const today = new Date();
      today.setHours(0,0,0,0);
      const startDate = new Date(form.start);
      if (startDate < today) {
        errors.start = "Start date must be today or in the future";
      }
    }
    // Cliff duration
    if (!form.cliffDuration || isNaN(Number(form.cliffDuration)) || Number(form.cliffDuration) < 0) {
      errors.cliffDuration = "Cliff duration must be 0 or greater";
    }
    // Duration
    if (!form.duration || isNaN(Number(form.duration)) || Number(form.duration) < 1) {
      errors.duration = "Duration must be at least 1 day";
    }
    // Cliff <= duration
    if (Number(form.cliffDuration) > Number(form.duration)) {
      errors.cliffDuration = "Cliff duration cannot be greater than total duration";
    }
    return errors;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const errors = validateForm();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFormError("Please fix the errors above.");
      return;
    }
    try {
      await createContract({
        beneficiary: form.beneficiary as `0x${string}`,
        token: form.token as `0x${string}`,
        start: Math.floor(new Date(form.start).getTime() / 1000),
        cliffDuration: Number(form.cliffDuration) * 24 * 60 * 60,
        duration: Number(form.duration) * 24 * 60 * 60,
        revocable: form.revocable,
      });
      setShowForm(false);
      setFieldErrors({});
    } catch (err) {
      setFormError("Failed to create vesting contract.");
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
            <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">Connect Your Wallet</h3>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">
            Connect your Web3 wallet to view your vesting contracts and claim tokens directly from the blockchain.
          </p>
          <Button className="hover-lift text-sm sm:text-base">
            <Coins className="mr-2 h-4 w-4" />
            Learn More About Web3 Vesting
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">Loading Contract Data</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Fetching your vesting information from the blockchain...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-destructive mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">Contract Connection Error</h3>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">
            Unable to connect to the vesting contract. Please check your network connection and try again.
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

  // Renderiza mensagem de nenhum vesting ativo, mas permite criar novo vesting
  const noActiveVesting = !contractInfo || !contractInfo.isActive;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header com botão de criar vesting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Your Web3 Vesting Contract</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Connected to smart contract on {currentNetwork?.name || 'Sepolia Testnet'}
            </p>
          </div>
          {isConnected && (
            <Button 
              onClick={() => setShowForm(f => !f)} 
              className="hover-lift focus-visible:ring-2 focus-visible:ring-primary text-sm sm:text-base mt-4 sm:mt-0"
              aria-label={showForm ? "Cancel" : "Create Vesting"}
              size="lg"
            >
              <Coins className="mr-2 h-4 w-4" />
              {showForm ? "Cancel" : "Create Vesting"}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Network Banner */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between bg-muted/60 border border-primary/20 rounded-lg px-3 sm:px-4 py-2 gap-2">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <span className="font-semibold text-sm sm:text-base">Current Network:</span>
          <Badge variant={isValidNetwork ? 'default' : 'destructive'} className="text-xs">
            {currentNetwork?.name || 'Unknown'}
          </Badge>
        </div>
        {!isValidNetwork && (
          <Button size="sm" variant="destructive" onClick={handleSwitchToSepolia} aria-label="Switch to Sepolia" className="text-xs">
            Switch to Sepolia
          </Button>
        )}
      </div>

      {/* Network Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
        <Card className="hover-lift transition-all duration-300">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Network className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Network</p>
                <div className="flex items-center space-x-2">
                  <Badge variant={isValidNetwork ? "default" : "destructive"} className="text-xs">
                    {currentNetwork?.name || "Unknown"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-all duration-300">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Transaction Fee</p>
                <p className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                  {formatEther(FEE_AMOUNT)} ETH
                </p>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Wallet</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl mx-auto">
        {!noActiveVesting && <Web3VestingCard />}
      </div>

      {/* All Vestings Section */}
      <div className="my-6 sm:my-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          All Your Vesting Contracts
        </h3>
        {isLoadingVestings ? (
          <div className="text-center text-muted-foreground py-6 sm:py-8 text-sm">Loading all vestings...</div>
        ) : errorVestings ? (
          <div className="text-center text-destructive py-6 sm:py-8 text-sm">Failed to load vestings.</div>
        ) : allVestings && allVestings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {allVestings.map((vesting, idx) => (
              <Card key={vesting.address} className="hover-lift border-primary/30 focus-within:ring-2 focus-within:ring-primary">
                <CardContent className="p-3 sm:p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={vesting.isActive ? 'default' : 'secondary'} className="text-xs">
                      {vesting.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="font-mono text-xs break-all">{vesting.address}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Start: {vesting.startTime ? new Date(vesting.startTime * 1000).toLocaleDateString() : '-'}</div>
                  <div className="text-xs text-muted-foreground">Duration: {vesting.duration ? (vesting.duration / 86400) + ' days' : '-'}</div>
                  <div className="text-xs text-muted-foreground">Cliff: {vesting.cliffDuration ? (vesting.cliffDuration / 86400) + ' days' : '-'}</div>
                  <Button size="sm" variant="outline" className="mt-2 w-full focus-visible:ring-2 focus-visible:ring-primary text-xs" aria-label="View Details" disabled>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-6 sm:py-8 text-sm">You have no vesting contracts yet.</div>
        )}
      </div>

      {/* Transaction History Section */}
      <div className="my-6 sm:my-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          Transaction History
        </h3>
        {isLoadingTxs ? (
          <div className="text-center text-muted-foreground py-6 sm:py-8 text-sm">Loading transactions...</div>
        ) : txError ? (
          <div className="text-center text-destructive py-6 sm:py-8 text-sm">{txError}</div>
        ) : txHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="px-1 sm:px-2 py-1 text-left">Hash</th>
                  <th className="px-1 sm:px-2 py-1 text-left">Type</th>
                  <th className="px-1 sm:px-2 py-1 text-left">Status</th>
                  <th className="px-1 sm:px-2 py-1 text-left hidden sm:table-cell">Block</th>
                  <th className="px-1 sm:px-2 py-1 text-left hidden sm:table-cell">Date</th>
                  <th className="px-1 sm:px-2 py-1 text-left">Link</th>
                </tr>
              </thead>
              <tbody>
                {txHistory.map(tx => (
                  <tr key={tx.hash} className="border-b hover:bg-muted/30 focus-within:bg-primary/10">
                    <td className="px-1 sm:px-2 py-1 font-mono">{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}</td>
                    <td className="px-1 sm:px-2 py-1">
                      {tx.input && tx.input !== '0x' ? (tx.input.startsWith('0xa9059cbb') ? 'Claim' : 'Contract Call') : 'Create/ETH Tx'}
                    </td>
                    <td className="px-1 sm:px-2 py-1">
                      {tx.isError === "0" ? <Badge variant="default" className="text-xs">Success</Badge> : <Badge variant="destructive" className="text-xs">Failed</Badge>}
                    </td>
                    <td className="px-1 sm:px-2 py-1 hidden sm:table-cell">{tx.blockNumber}</td>
                    <td className="px-1 sm:px-2 py-1 hidden sm:table-cell">{new Date(Number(tx.timeStamp) * 1000).toLocaleString()}</td>
                    <td className="px-1 sm:px-2 py-1">
                      <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline focus-visible:ring-2 focus-visible:ring-primary text-xs" aria-label="View on Etherscan">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-6 sm:py-8 text-sm">No transactions found.</div>
        )}
      </div>

      {/* Formulário de criação */}
      {showForm && (
        <Card className="mb-6 sm:mb-8 max-w-xl mx-auto shadow-lg border-primary/30">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
              <div className="mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-2">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Create New Vesting Contract
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Fill in the details below to create a new vesting contract on-chain.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block mb-1 font-medium text-sm" htmlFor="beneficiary">Beneficiary Address</label>
                  <input
                    type="text"
                    name="beneficiary"
                    id="beneficiary"
                    value={form.beneficiary}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
                    placeholder="0x..."
                    required
                    aria-label="Beneficiary Address"
                  />
                  <span className="text-xs text-muted-foreground">Wallet that will receive the tokens</span>
                  {fieldErrors.beneficiary && <span className="text-xs text-destructive block mt-1">{fieldErrors.beneficiary}</span>}
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm" htmlFor="token">Token Address</label>
                  <input
                    type="text"
                    name="token"
                    id="token"
                    value={form.token}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
                    placeholder="0x..."
                    required
                    aria-label="Token Address"
                  />
                  <span className="text-xs text-muted-foreground">ERC20 token contract address</span>
                  {fieldErrors.token && <span className="text-xs text-destructive block mt-1">{fieldErrors.token}</span>}
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm" htmlFor="start">Start Date</label>
                  <input
                    type="date"
                    name="start"
                    id="start"
                    value={form.start}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
                    required
                    aria-label="Start Date"
                  />
                  <span className="text-xs text-muted-foreground">When vesting begins</span>
                  {fieldErrors.start && <span className="text-xs text-destructive block mt-1">{fieldErrors.start}</span>}
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm" htmlFor="cliffDuration">Cliff Duration (days)</label>
                  <input
                    type="number"
                    name="cliffDuration"
                    id="cliffDuration"
                    value={form.cliffDuration}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
                    min="0"
                    placeholder="e.g. 30"
                    required
                    aria-label="Cliff Duration (days)"
                  />
                  <span className="text-xs text-muted-foreground">No tokens released before this period</span>
                  {fieldErrors.cliffDuration && <span className="text-xs text-destructive block mt-1">{fieldErrors.cliffDuration}</span>}
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm" htmlFor="duration">Total Duration (days)</label>
                  <input
                    type="number"
                    name="duration"
                    id="duration"
                    value={form.duration}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
                    min="1"
                    placeholder="e.g. 180"
                    required
                    aria-label="Total Duration (days)"
                  />
                  <span className="text-xs text-muted-foreground">Total vesting period</span>
                  {fieldErrors.duration && <span className="text-xs text-destructive block mt-1">{fieldErrors.duration}</span>}
                </div>
                <div className="flex items-center mt-4 sm:mt-6 sm:col-span-2">
                  <input
                    type="checkbox"
                    name="revocable"
                    id="revocable"
                    checked={form.revocable}
                    onChange={handleFormChange}
                    className="mr-2 focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Revocable"
                  />
                  <label htmlFor="revocable" className="font-medium text-sm">Revocable</label>
                  <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                </div>
              </div>
              {(formError || createError) && (
                <div className="rounded bg-destructive/10 border border-destructive text-destructive px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {formError || String(createError)}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} aria-label="Cancel" className="text-sm">
                  Cancel
                </Button>
                <Button type="submit" className="hover-lift focus-visible:ring-2 focus-visible:ring-primary text-sm" disabled={isPending || isConfirming} aria-label="Create Vesting">
                  {isPending || isConfirming ? (
                    <span className="flex items-center gap-2"><Loader2 className="animate-spin w-3 h-3 sm:w-4 sm:h-4" /> Creating...</span>
                  ) : (
                    "Create Vesting"
                  )}
                </Button>
              </div>
              {isSuccess && <div className="text-green-600 mt-2 text-sm">Vesting contract created successfully!</div>}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Informações sobre taxas */}
      {showForm && (
        <Card className="mb-6 sm:mb-8 max-w-xl mx-auto shadow-lg border-blue-500/30 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Transaction Fees</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• <strong>0.001 ETH</strong> fee per vesting contract creation</li>
                  <li>• <strong>0.001 ETH</strong> fee per token claim transaction</li>
                  <li>• Fees are automatically sent to: <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded text-xs">{FEE_RECIPIENT?.slice(0, 6)}...{FEE_RECIPIENT?.slice(-4)}</code></li>
                  <li>• Gas fees are additional and paid separately</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensagem de nenhum vesting ativo */}
      {noActiveVesting && (
        <div className="min-h-[40vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
              <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">No Active Vesting Contract</h3>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              This wallet address doesn't have any active vesting contracts on the connected network.
            </p>
            <div className="text-xs sm:text-sm text-muted-foreground bg-muted p-3 sm:p-4 rounded-lg">
              <p>Connected to: <strong>{walletAddress}</strong></p>
              <p>Make sure you're on the correct network (Sepolia Testnet)</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Wallet Balances Section */}
      <div className="my-6 sm:my-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          Wallet Balances
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
          <Card className="border-primary/30">
            <CardContent className="p-3 sm:p-4 flex flex-col gap-2">
              <span className="font-medium flex items-center gap-2 text-sm"><Network className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />ETH Balance</span>
              <span className="text-sm sm:text-lg font-mono">
                {isLoadingEth ? 'Loading...' : ethBalance ? `${ethBalance.formatted} ETH` : '0.00 ETH'}
              </span>
            </CardContent>
          </Card>
          <Card className="border-primary/30">
            <CardContent className="p-3 sm:p-4 flex flex-col gap-2">
              <span className="font-medium flex items-center gap-2 text-sm"><Coins className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />Token Balance</span>
              <span className="text-sm sm:text-lg font-mono">
                {tokenAddress ? (
                  isLoadingToken ? 'Loading...' : tokenBalance && tokenDecimals && tokenSymbol ? `${(Number(tokenBalance) / 10 ** Number(tokenDecimals)).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${tokenSymbol}` : '0.00'
                ) : 'No token selected'}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-muted/30 p-6 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-4">Contract Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Contract Address:</span>
            <p className="font-mono text-xs break-all">{import.meta.env.VITE_VESTING_CONTRACT_ADDRESS}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Network:</span>
            <p>Sepolia Testnet</p>
          </div>
          <div>
            <span className="text-muted-foreground">Your Address:</span>
            <p className="font-mono text-xs break-all">{walletAddress}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total Allocation:</span>
            <p>{contractInfo?.totalAllocation || 0} tokens</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}