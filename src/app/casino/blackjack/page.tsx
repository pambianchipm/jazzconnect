"use client";

import { useState, useCallback } from "react";
import { WaifuDealer } from "../components/WaifuDealer";
import { BetControls } from "../components/BetControls";
import { waifus, getRandomLine } from "../data/waifus";
import { useWallet } from "../context/WalletContext";

interface Card {
  suit: string;
  rank: string;
  value: number;
  hidden: boolean;
}

const SUITS = ["♠", "♥", "♦", "♣"];
const SUIT_COLORS: Record<string, string> = {
  "♠": "text-white",
  "♥": "text-red-500",
  "♦": "text-red-500",
  "♣": "text-white",
};
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let i = 0; i < RANKS.length; i++) {
      const rank = RANKS[i];
      let value = i + 1;
      if (i >= 10) value = 10;
      if (i === 0) value = 11;
      deck.push({ suit, rank, value, hidden: false });
    }
  }
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function handValue(cards: Card[]): number {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    if (card.hidden) continue;
    total += card.value;
    if (card.rank === "A") aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function CardDisplay({ card }: { card: Card }) {
  if (card.hidden) {
    return (
      <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 border border-blue-500/50 flex items-center justify-center shadow-lg">
        <span className="text-2xl">❄️</span>
      </div>
    );
  }
  return (
    <div className="w-16 h-24 rounded-lg bg-white border border-gray-300 flex flex-col items-center justify-center shadow-lg relative">
      <span className={`text-lg font-bold ${SUIT_COLORS[card.suit]}`}>{card.rank}</span>
      <span className={`text-xl ${SUIT_COLORS[card.suit]}`}>{card.suit}</span>
    </div>
  );
}

type GameState = "betting" | "playing" | "dealer_turn" | "done";

const yuki = waifus.yuki;

export default function BlackjackPage() {
  const { balance, addFunds, deductFunds } = useWallet();
  const [betAmount, setBetAmount] = useState(0);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>("betting");
  const [resultMessage, setResultMessage] = useState("");
  const [dialogue, setDialogue] = useState(() => getRandomLine(yuki.greetings));
  const [mood, setMood] = useState<"neutral" | "happy" | "sad">("neutral");

  const deal = useCallback(() => {
    if (betAmount <= 0) return;
    if (!deductFunds(betAmount)) return;

    const newDeck = createDeck();
    const pCards = [newDeck.pop()!, newDeck.pop()!];
    const dCards = [newDeck.pop()!, { ...newDeck.pop()!, hidden: true }];

    setDeck(newDeck);
    setPlayerHand(pCards);
    setDealerHand(dCards);
    setGameState("playing");
    setResultMessage("");
    setMood("neutral");

    const pVal = handValue(pCards);
    if (pVal === 21) {
      // Reveal dealer card
      dCards[1].hidden = false;
      const dVal = handValue(dCards);
      setDealerHand([...dCards]);
      if (dVal === 21) {
        setGameState("done");
        setResultMessage("Push! Both have Blackjack.");
        addFunds(betAmount);
        setDialogue("...A push. We're evenly matched. Interesting.");
      } else {
        setGameState("done");
        setResultMessage("Blackjack! You win!");
        addFunds(Math.floor(betAmount * 2.5));
        setDialogue("Tch. Blackjack on the deal. ...Well played.");
        setMood("happy");
      }
    } else {
      setDialogue(getRandomLine(yuki.idleLines));
    }
  }, [betAmount, deductFunds, addFunds]);

  const hit = useCallback(() => {
    if (gameState !== "playing") return;
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newHand = [...playerHand, card];
    setDeck(newDeck);
    setPlayerHand(newHand);

    const val = handValue(newHand);
    if (val > 21) {
      // Bust - reveal dealer card
      const revealedDealer = dealerHand.map((c) => ({ ...c, hidden: false }));
      setDealerHand(revealedDealer);
      setGameState("done");
      setResultMessage(`Bust! You went over with ${val}.`);
      setDialogue(getRandomLine(yuki.winLines));
      setMood("sad");
    } else if (val === 21) {
      stand(newHand, newDeck);
    }
  }, [gameState, deck, playerHand, dealerHand]);

  const stand = useCallback(
    (currentPlayerHand?: Card[], currentDeck?: Card[]) => {
      const pHand = currentPlayerHand || playerHand;
      let dHand = dealerHand.map((c) => ({ ...c, hidden: false }));
      let d = currentDeck ? [...currentDeck] : [...deck];

      setGameState("dealer_turn");
      setDialogue("My turn. Let's see what the cards have in store...");

      // Dealer draws to 17
      while (handValue(dHand) < 17) {
        dHand = [...dHand, d.pop()!];
      }

      setDealerHand(dHand);
      setDeck(d);

      const pVal = handValue(pHand);
      const dVal = handValue(dHand);

      setTimeout(() => {
        if (dVal > 21) {
          setResultMessage(`Dealer busts with ${dVal}! You win!`);
          addFunds(betAmount * 2);
          setDialogue(getRandomLine(yuki.loseLines) + ` ...I busted at ${dVal}.`);
          setMood("happy");
        } else if (pVal > dVal) {
          setResultMessage(`You win! ${pVal} beats ${dVal}.`);
          addFunds(betAmount * 2);
          setDialogue(getRandomLine(yuki.loseLines));
          setMood("happy");
        } else if (dVal > pVal) {
          setResultMessage(`Dealer wins. ${dVal} beats ${pVal}.`);
          setDialogue(getRandomLine(yuki.winLines));
          setMood("sad");
        } else {
          setResultMessage(`Push! Both have ${pVal}.`);
          addFunds(betAmount);
          setDialogue("...A tie. Neither of us wins. How boring.");
        }
        setGameState("done");
      }, 1000);
    },
    [playerHand, dealerHand, deck, betAmount, addFunds]
  );

  const doubleDown = useCallback(() => {
    if (gameState !== "playing" || playerHand.length !== 2) return;
    if (!deductFunds(betAmount)) return;

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newHand = [...playerHand, card];
    setDeck(newDeck);
    setPlayerHand(newHand);

    const val = handValue(newHand);
    if (val > 21) {
      const revealedDealer = dealerHand.map((c) => ({ ...c, hidden: false }));
      setDealerHand(revealedDealer);
      setGameState("done");
      setResultMessage(`Bust! You went over with ${val}.`);
      setDialogue("A bold move... but a foolish one. Bust.");
      setMood("sad");
    } else {
      // Double the bet reference for payout calc, then stand
      setBetAmount((prev) => prev * 2);
      stand(newHand, newDeck);
    }
  }, [gameState, playerHand, deck, betAmount, deductFunds, dealerHand, stand]);

  const newGame = useCallback(() => {
    setPlayerHand([]);
    setDealerHand([]);
    setDeck([]);
    setGameState("betting");
    setResultMessage("");
    setBetAmount(0);
    setMood("neutral");
    setDialogue(getRandomLine(yuki.greetings));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <WaifuDealer waifu={yuki} dialogue={dialogue} mood={mood} />

      {/* Table */}
      <div className="bg-gradient-to-b from-slate-900/50 to-indigo-900/30 border border-blue-500/20 rounded-2xl p-6 space-y-6">
        {/* Dealer Hand */}
        {dealerHand.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Yuki&apos;s Hand</span>
              <span className="text-sm font-mono text-blue-400">
                {dealerHand.some((c) => c.hidden) ? "?" : handValue(dealerHand)}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {dealerHand.map((card, i) => (
                <CardDisplay key={i} card={card} />
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {playerHand.length > 0 && (
          <div className="border-t border-white/10" />
        )}

        {/* Player Hand */}
        {playerHand.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Your Hand</span>
              <span className={`text-sm font-mono ${handValue(playerHand) > 21 ? "text-red-400" : "text-green-400"}`}>
                {handValue(playerHand)}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {playerHand.map((card, i) => (
                <CardDisplay key={i} card={card} />
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {resultMessage && (
          <div
            className={`
              text-center py-3 rounded-xl font-bold text-lg
              ${resultMessage.includes("win") || resultMessage.includes("Blackjack")
                ? "bg-green-500/20 text-green-400"
                : resultMessage.includes("Bust") || resultMessage.includes("Dealer wins")
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-500/20 text-gray-400"
              }
            `}
          >
            {resultMessage}
          </div>
        )}

        {/* Action Buttons */}
        {gameState === "playing" && (
          <div className="flex gap-3">
            <button
              onClick={hit}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all active:scale-95"
            >
              Hit
            </button>
            <button
              onClick={() => stand()}
              className="flex-1 py-3 rounded-xl bg-gray-600 hover:bg-gray-500 text-white font-bold transition-all active:scale-95"
            >
              Stand
            </button>
            {playerHand.length === 2 && balance >= betAmount && (
              <button
                onClick={doubleDown}
                className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all active:scale-95"
              >
                Double
              </button>
            )}
          </div>
        )}

        {gameState === "dealer_turn" && (
          <div className="text-center text-gray-400 animate-pulse">Yuki is drawing...</div>
        )}

        {gameState === "done" && (
          <button
            onClick={newGame}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all active:scale-95"
          >
            New Hand
          </button>
        )}
      </div>

      {/* Betting (only during betting phase) */}
      {gameState === "betting" && (
        <div className="space-y-4">
          <BetControls bet={betAmount} onBetChange={setBetAmount} />
          <button
            onClick={deal}
            disabled={betAmount <= 0}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-lg shadow-lg shadow-blue-900/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            ❄️ Deal
          </button>
        </div>
      )}

      {/* Rules */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Rules</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Blackjack pays 2.5x your bet</li>
          <li>• Regular win pays 2x your bet</li>
          <li>• Dealer stands on 17</li>
          <li>• Double Down: double your bet, get exactly one more card</li>
          <li>• Push returns your bet</li>
        </ul>
      </div>
    </div>
  );
}
