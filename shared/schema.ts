import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vestingContracts = pgTable("vesting_contracts", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  tokenName: text("token_name").notNull(),
  contractType: text("contract_type").notNull(), // e.g., "Employee Grant", "Advisor Grant"
  totalTokens: decimal("total_tokens", { precision: 18, scale: 6 }).notNull(),
  vestedTokens: decimal("vested_tokens", { precision: 18, scale: 6 }).notNull(),
  claimedTokens: decimal("claimed_tokens", { precision: 18, scale: 6 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  cliffDate: timestamp("cliff_date"),
  isActive: boolean("is_active").notNull().default(true),
  contractAddress: text("contract_address").notNull(),
  gradientColors: text("gradient_colors").notNull(), // JSON string for UI colors
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  amount: decimal("amount", { precision: 18, scale: 6 }).notNull(),
  transactionHash: text("transaction_hash").notNull(),
  status: text("status").notNull(), // "pending", "success", "failed"
  timestamp: timestamp("timestamp").notNull(),
});

export const insertVestingContractSchema = createInsertSchema(vestingContracts).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export type VestingContract = typeof vestingContracts.$inferSelect;
export type InsertVestingContract = z.infer<typeof insertVestingContractSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
