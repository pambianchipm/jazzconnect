"use client";

import { useState, useCallback } from "react";
import { WaifuDealer } from "../components/WaifuDealer";
import { BetControls } from "../components/BetControls";
import { waifus, getRandomLine } from "../data/waifus";
import { useWallet } from "../context/WalletContext";

type BetType = "number" | "red" | "black" | "odd" | "even" | "low" | "high";

interface RouletteBet {
  type: BetType;
  value?: number;
  amount: number;
}

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

function getNumberColor(n: number): "red" | "black" | "green" {
  if (n === 0) return "green";
  return RED_NUMBERS.includes(n) ? "red" : "black";
}

const NUMBER_COLORS: Record<string, string> = {
  red: "bg-red-600",
  black: "bg-gray-800",
  green: "bg-green-600",
};

const runa = waifus.runa;

export default function RoulettePage() {
  const { balance, addFunds, deductFunds } = useWallet();
  const [betAmount, setBetAmount] = useState(0);
  const [selectedBet, setSelectedBet] = useState<{ type: BetType; value?: number } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [dialogue, setDialogue] = useState(() => getRandomLine(runa.greetings));
  const [mood, setMood] = useState<"neutral" | "happy" | "sad">("neutral");
  const [history, setHistory] = useState<number[]>([]);

  const calculatePayout = useCallback((bet: RouletteBet, winningNumber: number): number => {
    const color = getNumberColor(winningNumber);
    switch (bet.type) {
      case "number":
        return bet.value === winningNumber ? bet.amount * 36 : 0;
      case "red":
        return color === "red" ? bet.amount * 2 : 0;
      case "black":
        return color === "black" ? bet.amount * 2 : 0;
      case "odd":
        return winningNumber > 0 && winningNumber % 2 !== 0 ? bet.amount * 2 : 0;
      case "even":
        return winningNumber > 0 && winningNumber % 2 === 0 ? bet.amount * 2 : 0;
      case "low":
        return winningNumber >= 1 && winningNumber <= 18 ? bet.amount * 2 : 0;
      case "high":
        return winningNumber >= 19 && winningNumber <= 36 ? bet.amount * 2 : 0;
      default:
        return 0;
    }
  }, []);

  const spin = useCallback(() => {
    if (!selectedBet || betAmount <= 0 || spinning) return;
    if (!deductFunds(betAmount)) return;

    setSpinning(true);
    setResult(null);
    setLastWin(null);
    setDialogue("The wheel spins... Round and round it goes~! 🎡");
    setMood("neutral");

    const winningNumber = Math.floor(Math.random() * 37);

    setTimeout(() => {
      setResult(winningNumber);
      setHistory((prev) => [winningNumber, ...prev].slice(0, 20));

      const bet: RouletteBet = { type: selectedBet.type, value: selectedBet.value, amount: betAmount };
      const payout = calculatePayout(bet, winningNumber);

      if (payout > 0) {
        addFunds(payout);
        setLastWin(payout);
        setDialogue(getRandomLine(runa.winLines) + ` You won ${payout.toLocaleString()} coins!`);
        setMood("happy");
      } else {
        setLastWin(0);
        setDialogue(getRandomLine(runa.loseLines) + ` The ball landed on ${winningNumber}.`);
        setMood("sad");
      }

      setSpinning(false);
    }, 2000);
  }, [selectedBet, betAmount, spinning, deductFunds, addFunds, calculatePayout]);

  const outsideBets: { type: BetType; label: string; color: string }[] = [
    { type: "red", label: "Red", color: "bg-red-600 hover:bg-red-500" },
    { type: "black", label: "Black", color: "bg-gray-700 hover:bg-gray-600" },
    { type: "odd", label: "Odd", color: "bg-indigo-600 hover:bg-indigo-500" },
    { type: "even", label: "Even", color: "bg-indigo-600 hover:bg-indigo-500" },
    { type: "low", label: "1-18", color: "bg-amber-700 hover:bg-amber-600" },
    { type: "high", label: "19-36", color: "bg-amber-700 hover:bg-amber-600" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <WaifuDealer waifu={runa} dialogue={dialogue} mood={mood} />

      {/* Result Display */}
      {spinning && (
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-red-500 border-t-yellow-400 animate-spin" />
        </div>
      )}

      {result !== null && !spinning && (
        <div className="text-center space-y-2">
          <div
            className={`
              inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold text-white
              ${NUMBER_COLORS[getNumberColor(result)]} shadow-lg
              animate-bounce
            `}
          >
            {result}
          </div>
          {lastWin !== null && lastWin > 0 && (
            <p className="text-yellow-400 font-bold text-xl">+{lastWin.toLocaleString()} coins! 🎉</p>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs text-gray-500 flex-shrink-0">History:</span>
          {history.map((n, i) => (
            <span
              key={i}
              className={`
                flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                text-xs font-bold text-white ${NUMBER_COLORS[getNumberColor(n)]}
                ${i === 0 ? "ring-2 ring-yellow-400" : "opacity-70"}
              `}
            >
              {n}
            </span>
          ))}
        </div>
      )}

      {/* Betting Area */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Number Board</h3>
          <div className="grid grid-cols-6 gap-1">
            {/* Zero */}
            <button
              onClick={() => setSelectedBet({ type: "number", value: 0 })}
              disabled={spinning}
              className={`
                col-span-6 py-2 rounded-lg text-sm font-bold text-white bg-green-700 hover:bg-green-600
                transition-all disabled:opacity-50
                ${selectedBet?.type === "number" && selectedBet.value === 0 ? "ring-2 ring-yellow-400 scale-105" : ""}
              `}
            >
              0
            </button>
            {/* Numbers 1-36 */}
            {Array.from({ length: 36 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setSelectedBet({ type: "number", value: n })}
                disabled={spinning}
                className={`
                  py-2 rounded text-xs font-bold text-white
                  ${NUMBER_COLORS[getNumberColor(n)]} hover:opacity-80
                  transition-all disabled:opacity-50
                  ${selectedBet?.type === "number" && selectedBet.value === n ? "ring-2 ring-yellow-400 scale-110" : ""}
                `}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Outside Bets */}
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Outside Bets (2x)</h3>
          <div className="grid grid-cols-3 gap-2">
            {outsideBets.map((bet) => (
              <button
                key={bet.type}
                onClick={() => setSelectedBet({ type: bet.type })}
                disabled={spinning}
                className={`
                  py-2.5 rounded-lg text-sm font-bold text-white ${bet.color}
                  transition-all disabled:opacity-50
                  ${selectedBet?.type === bet.type ? "ring-2 ring-yellow-400 scale-105" : ""}
                `}
              >
                {bet.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Place Your Bet</h3>
          {selectedBet && (
            <div className="bg-white/5 rounded-lg px-3 py-2 text-sm">
              <span className="text-gray-400">Betting on: </span>
              <span className="text-white font-medium">
                {selectedBet.type === "number" ? `Number ${selectedBet.value}` : selectedBet.type.charAt(0).toUpperCase() + selectedBet.type.slice(1)}
              </span>
              <span className="text-gray-500 ml-2">
                ({selectedBet.type === "number" ? "36x" : "2x"} payout)
              </span>
            </div>
          )}
          <BetControls bet={betAmount} onBetChange={setBetAmount} disabled={spinning} />
          <button
            onClick={spin}
            disabled={spinning || betAmount <= 0 || !selectedBet || balance < betAmount}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-lg shadow-lg shadow-red-900/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {spinning ? "Spinning..." : "🎡 Spin the Wheel!"}
          </button>
        </div>
      </div>
    </div>
  );
}
