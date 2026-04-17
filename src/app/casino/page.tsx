"use client";

import { GameCard } from "./components/GameCard";
import { WalletDisplay } from "./components/WalletDisplay";
import { waifus } from "./data/waifus";
import { useWallet } from "./context/WalletContext";

export default function CasinoLobby() {
  const { balance, resetWallet } = useWallet();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          ✨ WaifuCasino ✨
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Three games. Three waifus. Infinite fun. Pick your table and let the games begin!
        </p>
        <div className="flex justify-center">
          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-2xl px-6 py-4 inline-flex flex-col items-center gap-2">
            <span className="text-sm text-gray-400">Your Balance</span>
            <span className="text-3xl font-bold text-yellow-300 tabular-nums">
              🪙 {balance.toLocaleString()}
            </span>
            {balance === 0 && (
              <button
                onClick={resetWallet}
                className="mt-1 text-sm bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-4 py-2 rounded-full transition-colors"
              >
                Claim 1,000 free coins!
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Game Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <GameCard
          waifu={waifus.runa}
          href="/casino/roulette"
          description="Bet on numbers, colors, or ranges. The wheel decides your fate!"
        />
        <GameCard
          waifu={waifus.sakura}
          href="/casino/slots"
          description="Pull the lever and match symbols for big payouts. Triple 7s for the jackpot!"
        />
        <GameCard
          waifu={waifus.yuki}
          href="/casino/blackjack"
          description="Beat the dealer to 21. Hit, stand, or go for the bold double down."
        />
      </div>

      {/* Waifu Profiles */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white text-center">Meet Your Dealers</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.values(waifus).map((w) => (
            <div
              key={w.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center space-y-3"
            >
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${w.color}, ${w.accentColor})` }}
              >
                {w.emoji}
              </div>
              <div>
                <h3 className="font-bold text-white">{w.name}</h3>
                <p className="text-xs text-white/50">{w.title}</p>
              </div>
              <p className="text-sm text-gray-400">{w.personality}</p>
              <p className="text-xs text-gray-600 italic">&ldquo;{w.greetings[0]}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 text-center">
        <p className="text-yellow-500/80 text-sm">
          ⚠️ This is a play-money casino for entertainment only. No real currency is used.
          All coins are virtual and have no monetary value.
        </p>
      </div>
    </div>
  );
}
