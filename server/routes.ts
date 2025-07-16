import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const ClaimTokensSchema = z.object({
  contractId: z.number(),
  amount: z.string(),
  walletAddress: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get vesting contracts for a wallet
  app.get("/api/vesting/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const contracts = await storage.getVestingContractsByWallet(walletAddress);
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vesting contracts" });
    }
  });

  // Get specific vesting contract
  app.get("/api/vesting/contract/:id", async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await storage.getVestingContract(contractId);
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contract" });
    }
  });

  // Claim tokens from a vesting contract
  app.post("/api/claim", async (req, res) => {
    try {
      const { contractId, amount, walletAddress } = ClaimTokensSchema.parse(req.body);
      
      const contract = await storage.getVestingContract(contractId);
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }

      // Simulate blockchain transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Create transaction record
      const transaction = await storage.createTransaction({
        contractId,
        walletAddress,
        amount,
        transactionHash,
        status: "pending",
        timestamp: new Date(),
      });

      // Simulate transaction processing delay
      setTimeout(async () => {
        // Update transaction status to success
        await storage.createTransaction({
          contractId,
          walletAddress,
          amount,
          transactionHash,
          status: "success",
          timestamp: new Date(),
        });

        // Update contract claimed tokens
        const currentClaimed = parseFloat(contract.claimedTokens);
        const claimAmount = parseFloat(amount);
        const newClaimed = (currentClaimed + claimAmount).toString();
        
        await storage.updateVestingContract(contractId, {
          claimedTokens: newClaimed,
        });
      }, 2000);

      res.json({ 
        success: true, 
        transactionHash,
        message: "Claim transaction submitted successfully" 
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  // Get transactions for a contract
  app.get("/api/transactions/:contractId", async (req, res) => {
    try {
      const contractId = parseInt(req.params.contractId);
      const transactions = await storage.getTransactionsByContract(contractId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
