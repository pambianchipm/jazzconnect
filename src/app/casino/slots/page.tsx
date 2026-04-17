"use client";

import { useState, useCallback } from "react";
import { WaifuDealer } from "../components/WaifuDealer";
import { BetControls } from "../components/BetControls";
import { waifus, getRandomLine } from "../data/waifus";
import { useWallet } from "../context/WalletContext";

const SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣"];
const SYMBOL_NAMES: Record<string, string> = {
  "🍒": "Cherry",
  "🍋": "Lemon",
  "🔔": "Bell",
  "⭐": "Star",
  "💎": "Diamond",
  "7️⃣": "Seven",
};

const PAYOUTS: Record<string, number> = {
  "🍒": 3,
  "🍋": 5,
  "🔔": 8,
  "⭐": 12,
  "💎": 20,
  "7️⃣": 50,
};

const sakura = waifus.sakura;

function getRandomSymbol(): string {
  const weights = [30, 25, 20, 15, 7, 3];
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < SYMBOLS.length; i++) {
    random -= weights[i];
    if (random <= 0) return SYMBOLS[i];
  }
  return SYMBOLS[0];
}

export default function SlotsPage() {
  const { balance, addFunds, deductFunds } = useWallet();
  const [betAmount, setBetAmount] = useState(0);
  const [reels, setReels] = useState<string[]>(["⭐", "💎", "7️⃣"]);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [dialogue, setDialogue] = useState(() => getRandomLine(sakura.greetings));
  const [mood, setMood] = useState<"neutral" | "happy" | "sad">("neutral");
  const [autoSpin, setAutoSpin] = useState(false);
  const [spinAnimation, setSpinAnimation] = useState([false, false, false]);

  const evaluateWin = useCallback((finalReels: string[], bet: number): number => {
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      return bet * PAYOUTS[finalReels[0]];
    }
    if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
      return Math.floor(bet * 1.5);
    }
    return 0;
  }, []);

  const spin = useCallback(() => {
    if (spinning || betAmount <= 0) return;
    if (!deductFunds(betAmount)) return;

    setSpinning(true);
    setLastWin(null);
    setDialogue("Go go go~!! Spin spin spin~!! 🌸🎰");
    setMood("neutral");
    setSpinAnimation([true, true, true]);

    const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stagger reel stops
    setTimeout(() => {
      setReels((prev) => [finalReels[0], prev[1], prev[2]]);
      setSpinAnimation((prev) => [false, prev[1], prev[2]]);
    }, 800);

    setTimeout(() => {
      setReels((prev) => [prev[0], finalReels[1], prev[2]]);
      setSpinAnimation((prev) => [prev[0], false, prev[2]]);
    }, 1200);

    setTimeout(() => {
      setReels(finalReels);
      setSpinAnimation([false, false, false]);

      const payout = evaluateWin(finalReels, betAmount);

      if (payout > 0) {
        addFunds(payout);
        setLastWin(payout);

        if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
          setDialogue(
            getRandomLine(sakura.winLines) +
              ` TRIPLE ${SYMBOL_NAMES[finalReels[0]]}!! ${payout.toLocaleString()} coins!! 🎉🎉🎉`
          );
        } else {
          setDialogue(
            getRandomLine(sakura.winLines) + ` You got a pair! +${payout.toLocaleString()} coins! ✨`
          );
        }
        setMood("happy");
      } else {
        setLastWin(0);
        setDialogue(getRandomLine(sakura.loseLines));
        setMood("sad");
      }

      setSpinning(false);
    }, 1600);
  }, [spinning, betAmount, deductFunds, addFunds, evaluateWin]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <WaifuDealer waifu={sakura} dialogue={dialogue} mood={mood} />

      {/* Slot Machine */}
      <div className="relative bg-gradient-to-b from-purple-900/50 to-fuchsia-900/50 border border-pink-500/30 rounded-3xl p-8 shadow-2xl">
        {/* Top decoration */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-1 rounded-full text-white font-bold text-sm shadow-lg">
          🌸 Lucky Blossom Slots 🌸
        </div>

        {/* Reels */}
        <div className="flex justify-center gap-4 my-8">
          {reels.map((symbol, i) => (
            <div
              key={i}
              className={`
                w-28 h-28 rounded-2xl bg-gray-900 border-2 border-pink-500/40
                flex items-center justify-center text-6xl
                shadow-inner
                ${spinAnimation[i] ? "animate-pulse" : ""}
                ${lastWin && lastWin > 0 ? "border-yellow-400 shadow-yellow-400/20" : ""}
              `}
            >
              <span className={spinAnimation[i] ? "blur-sm animate-bounce" : "transition-all duration-300"}>
                {spinAnimation[i] ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : symbol}
              </span>
            </div>
          ))}
        </div>

        {/* Win Display */}
        {lastWin !== null && !spinning && (
          <div className="text-center mb-4">
            {lastWin > 0 ? (
              <p className="text-yellow-400 font-bold text-2xl animate-bounce">
                🎉 +{lastWin.toLocaleString()} coins! 🎉
              </p>
            ) : (
              <p className="text-gray-500 text-sm">No match this time...</p>
            )}
          </div>
        )}

        {/* Spin Button */}
        <button
          onClick={spin}
          disabled={spinning || betAmount <= 0 || balance < betAmount}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xl shadow-lg shadow-pink-900/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {spinning ? "🌀 Spinning~!" : "🌸 PULL!"}
        </button>
      </div>

      {/* Payout Table */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Payouts</h3>
        <div className="grid grid-cols-2 gap-2">
          {SYMBOLS.map((sym) => (
            <div key={sym} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
              <span className="text-lg">
                {sym}{sym}{sym}
              </span>
              <span className="text-yellow-400 font-bold text-sm">{PAYOUTS[sym]}x</span>
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
            <span className="text-sm text-gray-400">Any pair</span>
            <span className="text-yellow-400 font-bold text-sm">1.5x</span>
          </div>
        </div>
      </div>

      {/* Bet Controls */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Your Bet</h3>
        <BetControls bet={betAmount} onBetChange={setBetAmount} disabled={spinning} />
      </div>
    </div>
  );
}
