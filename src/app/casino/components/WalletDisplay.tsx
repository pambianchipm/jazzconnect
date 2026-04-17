"use client";

import { useWallet } from "../context/WalletContext";

export function WalletDisplay() {
  const { balance, resetWallet } = useWallet();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2">
        <span className="text-yellow-400 text-lg">🪙</span>
        <span className="font-bold text-yellow-300 tabular-nums">
          {balance.toLocaleString()}
        </span>
        <span className="text-yellow-500/60 text-xs">coins</span>
      </div>
      {balance === 0 && (
        <button
          onClick={resetWallet}
          className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1.5 rounded-full transition-colors"
        >
          Get 1,000 free coins
        </button>
      )}
    </div>
  );
}
