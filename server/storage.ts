import { vestingContracts, transactions, type VestingContract, type InsertVestingContract, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  getVestingContractsByWallet(walletAddress: string): Promise<VestingContract[]>;
  getVestingContract(id: number): Promise<VestingContract | undefined>;
  createVestingContract(contract: InsertVestingContract): Promise<VestingContract>;
  updateVestingContract(id: number, updates: Partial<VestingContract>): Promise<VestingContract | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByContract(contractId: number): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private vestingContracts: Map<number, VestingContract>;
  private transactions: Map<number, Transaction>;
  private currentContractId: number;
  private currentTransactionId: number;

  constructor() {
    this.vestingContracts = new Map();
    this.transactions = new Map();
    this.currentContractId = 1;
    this.currentTransactionId = 1;
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockWalletAddress = "0x742d35Cc6634C0532925a3b8D000000000000000";
    const now = new Date();
    
    const mockContracts: InsertVestingContract[] = [
      {
        walletAddress: mockWalletAddress,
        tokenSymbol: "USDC",
        tokenName: "USD Coin",
        contractType: "Employee Grant",
        totalTokens: "10000.000000",
        vestedTokens: "6500.000000",
        claimedTokens: "5250.000000",
        startDate: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        endDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        cliffDate: new Date(now.getTime() - 335 * 24 * 60 * 60 * 1000), // 11 months ago
        contractAddress: "0x1234567890123456789012345678901234567890",
        gradientColors: '["from-blue-500", "to-blue-600"]',
        isActive: true
      },
      {
        walletAddress: mockWalletAddress,
        tokenSymbol: "COMP",
        tokenName: "Compound",
        contractType: "Advisor Grant",
        totalTokens: "5000.000000",
        vestedTokens: "2250.000000",
        claimedTokens: "1500.000000",
        startDate: new Date(now.getTime() - 300 * 24 * 60 * 60 * 1000), // 10 months ago
        endDate: new Date(now.getTime() + 400 * 24 * 60 * 60 * 1000), // 13+ months from now
        cliffDate: new Date(now.getTime() - 270 * 24 * 60 * 60 * 1000), // 9 months ago
        contractAddress: "0x2345678901234567890123456789012345678901",
        gradientColors: '["from-purple-500", "to-purple-600"]',
        isActive: true
      },
      {
        walletAddress: mockWalletAddress,
        tokenSymbol: "DAI",
        tokenName: "Dai Stablecoin",
        contractType: "Founder Grant",
        totalTokens: "25000.000000",
        vestedTokens: "5000.000000",
        claimedTokens: "5000.000000",
        startDate: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
        endDate: new Date(now.getTime() + 1095 * 24 * 60 * 60 * 1000), // 3 years from now
        cliffDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
        contractAddress: "0x3456789012345678901234567890123456789012",
        gradientColors: '["from-emerald-500", "to-emerald-600"]',
        isActive: true
      }
    ];

    mockContracts.forEach(contract => {
      this.createVestingContract(contract);
    });
  }

  async getVestingContractsByWallet(walletAddress: string): Promise<VestingContract[]> {
    return Array.from(this.vestingContracts.values()).filter(
      contract => contract.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  async getVestingContract(id: number): Promise<VestingContract | undefined> {
    return this.vestingContracts.get(id);
  }

  async createVestingContract(insertContract: InsertVestingContract): Promise<VestingContract> {
    const id = this.currentContractId++;
    const contract: VestingContract = {
      ...insertContract,
      id
    };
    this.vestingContracts.set(id, contract);
    return contract;
  }

  async updateVestingContract(id: number, updates: Partial<VestingContract>): Promise<VestingContract | undefined> {
    const contract = this.vestingContracts.get(id);
    if (!contract) return undefined;
    
    const updatedContract = { ...contract, ...updates };
    this.vestingContracts.set(id, updatedContract);
    return updatedContract;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByContract(contractId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.contractId === contractId
    );
  }
}

export const storage = new MemStorage();
