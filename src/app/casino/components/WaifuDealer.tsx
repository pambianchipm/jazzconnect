"use client";

import { useState, useEffect } from "react";
import type { WaifuCharacter } from "../data/waifus";

interface WaifuDealerProps {
  waifu: WaifuCharacter;
  dialogue: string;
  mood?: "neutral" | "happy" | "sad";
}

export function WaifuDealer({ waifu, dialogue, mood = "neutral" }: WaifuDealerProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < dialogue.length) {
        setDisplayedText(dialogue.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [dialogue]);

  const moodExpression = mood === "happy" ? "😄" : mood === "sad" ? "😢" : "😊";

  return (
    <div className="flex items-start gap-4">
      <div
        className="relative flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg ring-2 ring-opacity-50"
        style={{
          background: `linear-gradient(135deg, ${waifu.color}, ${waifu.accentColor})`,
          boxShadow: `0 0 0 2px ${waifu.color}80`,
        }}
      >
        <span className="drop-shadow-lg">{waifu.emoji}</span>
        <span className="absolute -bottom-1 -right-1 text-lg bg-gray-900 rounded-full w-7 h-7 flex items-center justify-center border-2 border-gray-800">
          {moodExpression}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-bold text-white">{waifu.name}</span>
          <span className="text-xs opacity-50">{waifu.title}</span>
        </div>
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
          style={{ backgroundColor: `${waifu.color}20`, borderColor: `${waifu.color}40`, borderWidth: 1 }}
        >
          <span>{displayedText}</span>
          {isTyping && <span className="animate-pulse ml-0.5">▊</span>}
        </div>
      </div>
    </div>
  );
}
