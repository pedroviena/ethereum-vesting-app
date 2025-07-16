import React from "react";

export default function TermsAndPrivacy() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Use & Privacy Policy</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground mb-2">
          By accessing and using the Token Vesting Dashboard (the "App"), you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, please do not use the App.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Web3 Disclaimer</h2>
        <p className="text-muted-foreground mb-2">
          The App is a decentralized application (dApp) that interacts directly with the Ethereum blockchain. You are solely responsible for your wallet, private keys, and transactions. We do not have access to your funds or private information.
        </p>
        <p className="text-muted-foreground mb-2">
          Blockchain transactions are irreversible. Always double-check addresses and amounts before confirming any transaction.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. No Financial Advice</h2>
        <p className="text-muted-foreground mb-2">
          The App does not provide investment, financial, or legal advice. All information is for informational purposes only. Consult a qualified professional before making any financial decisions.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Privacy Policy</h2>
        <p className="text-muted-foreground mb-2">
          We do not collect, store, or share your personal data. All interactions occur directly between your wallet and the blockchain. However, third-party services (such as Etherscan) may collect data according to their own policies.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
        <p className="text-muted-foreground mb-2">
          The App is provided "as is" without warranties of any kind. We are not liable for any losses, damages, or claims arising from your use of the App, including but not limited to lost funds, failed transactions, or smart contract bugs.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Changes to Terms</h2>
        <p className="text-muted-foreground mb-2">
          We may update these Terms and the Privacy Policy at any time. Continued use of the App constitutes acceptance of the revised terms.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
        <p className="text-muted-foreground mb-2">
          For questions or support, contact us at <a href="mailto:support@tokenvest.app" className="underline text-primary">support@tokenvest.app</a>.
        </p>
      </section>
    </div>
  );
} 