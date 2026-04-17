"use client";

import type { ReactNode } from "react";
import { WalletProvider } from "./context/WalletContext";
import { CasinoNav } from "./components/CasinoNav";

export default function CasinoLayout({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        <CasinoNav />
        <main className="pb-12">{children}</main>
        <footer className="text-center py-6 text-gray-600 text-xs border-t border-white/5">
          <p>✨ WaifuCasino — For entertainment purposes only. No real money involved.</p>
          <p className="mt-1">Play responsibly. All currency is virtual.</p>
        </footer>
      </div>
    </WalletProvider>
  );
}
