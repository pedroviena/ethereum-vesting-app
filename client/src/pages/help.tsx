import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Coins, HelpCircle, Network, DollarSign, Lock, CheckCircle, AlertCircle } from "lucide-react";

export default function Help() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <HelpCircle className="w-12 h-12 mx-auto text-primary mb-2" />
        <h1 className="text-4xl font-bold mb-2">Help & FAQ</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Everything you need to know about using the Token Vesting Dashboard.
        </p>
      </motion.div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><Coins className="w-5 h-5 text-primary" /> What is Token Vesting Dashboard?</h2>
            <p>
              The Token Vesting Dashboard is a decentralized application (dApp) that allows you to manage, create, and claim tokens from vesting contracts directly on the Ethereum blockchain. It is designed for teams, investors, and projects that need to distribute tokens over time in a secure and transparent way.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><Network className="w-5 h-5 text-primary" /> How do I connect my wallet?</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click the <b>Connect Wallet</b> button in the top right corner.</li>
              <li>Approve the connection in your MetaMask (or compatible) wallet extension.</li>
              <li>Make sure you are on the <b>Sepolia</b> network. If not, use the <b>Switch to Sepolia</b> button or change it manually in MetaMask.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> How do I create a vesting contract?</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>Connect your wallet.</li>
              <li>Click <b>Create Vesting</b>.</li>
              <li>Fill in the beneficiary address, token address, start date, cliff duration, total duration, and whether the vesting is revocable.</li>
              <li>Submit the form and confirm the transaction in your wallet. A small fee in ETH will be required.</li>
              <li>Wait for the transaction to be confirmed. You will see your new vesting contract in the list.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> How do I claim my tokens?</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>Connect your wallet and make sure you are on the correct network.</li>
              <li>Find your active vesting contract in the dashboard.</li>
              <li>If tokens are available to claim, click <b>Claim Available Tokens</b> and confirm the transaction in your wallet.</li>
              <li>After confirmation, your tokens will be transferred to your wallet.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary" /> How does the transaction history work?</h2>
            <p>
              The dashboard displays your last 5 transactions (including vesting creation and claims) with links to Etherscan for full details. This helps you track all your on-chain activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><Coins className="w-5 h-5 text-primary" /> How do I check my token and ETH balance?</h2>
            <p>
              Your ETH and token balances are shown in the <b>Wallet Balances</b> section. The token balance updates automatically based on the selected or active vesting contract.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><Network className="w-5 h-5 text-primary" /> How do I switch networks?</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>If you are on the wrong network, a warning and a <b>Switch to Sepolia</b> button will appear.</li>
              <li>Click the button to switch automatically, or change manually in your wallet.</li>
              <li>Only Sepolia and Ethereum Mainnet are supported.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-primary" /> Security & Tips</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Always double-check addresses before creating a vesting contract.</li>
              <li>Never share your private key or seed phrase with anyone.</li>
              <li>Only interact with the official dApp URL.</li>
              <li>Transactions require ETH for gas fees.</li>
              <li>If you have issues, try refreshing the page or reconnecting your wallet.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary" /> Need more help?</h2>
            <p>
              For support, contact our team at <a href="mailto:support@vestflow.app" className="text-blue-600 underline">support@vestflow.app</a> or check our documentation.
            </p>
          </section>
        </CardContent>
      </Card>
      <div className="mt-12 text-center text-xs text-muted-foreground">
        This app was made entirely by <b>pedroviena</b>.
      </div>
    </div>
  );
} 