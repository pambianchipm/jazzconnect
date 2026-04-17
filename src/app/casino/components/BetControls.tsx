"use client";

import { useWallet } from "../context/WalletContext";

interface BetControlsProps {
  bet: number;
  onBetChange: (bet: number) => void;
  disabled?: boolean;
}

const CHIP_VALUES = [10, 25, 50, 100, 250];

const CHIP_COLORS: Record<number, string> = {
  10: "from-blue-500 to-blue-700 border-blue-400",
  25: "from-green-500 to-green-700 border-green-400",
  50: "from-red-500 to-red-700 border-red-400",
  100: "from-purple-500 to-purple-700 border-purple-400",
  250: "from-yellow-500 to-yellow-700 border-yellow-400",
};

export function BetControls({ bet, onBetChange, disabled }: BetControlsProps) {
  const { balance } = useWallet();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Your Bet</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-yellow-300 tabular-nums">
            🪙 {bet.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {CHIP_VALUES.map((value) => (
          <button
            key={value}
            onClick={() => onBetChange(Math.min(bet + value, balance))}
            disabled={disabled || balance < value}
            className={`
              relative w-14 h-14 rounded-full bg-gradient-to-b ${CHIP_COLORS[value]}
              border-2 flex items-center justify-center font-bold text-white text-sm
              shadow-lg hover:scale-110 active:scale-95 transition-transform
              disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed
            `}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onBetChange(0)}
          disabled={disabled || bet === 0}
          className="flex-1 text-xs py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 disabled:opacity-30 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={() => onBetChange(Math.floor(balance / 2))}
          disabled={disabled || balance === 0}
          className="flex-1 text-xs py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 disabled:opacity-30 transition-colors"
        >
          Half
        </button>
        <button
          onClick={() => onBetChange(balance)}
          disabled={disabled || balance === 0}
          className="flex-1 text-xs py-1.5 rounded-lg bg-yellow-600/40 hover:bg-yellow-600/60 text-yellow-300 disabled:opacity-30 transition-colors"
        >
          All In
        </button>
      </div>
    </div>
  );
}
