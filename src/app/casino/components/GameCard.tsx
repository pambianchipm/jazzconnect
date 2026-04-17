"use client";

import Link from "next/link";
import type { WaifuCharacter } from "../data/waifus";

interface GameCardProps {
  waifu: WaifuCharacter;
  href: string;
  description: string;
}

export function GameCard({ waifu, href, description }: GameCardProps) {
  return (
    <Link href={href} className="group block">
      <div
        className={`
          relative overflow-hidden rounded-2xl bg-gradient-to-br ${waifu.bgGradient}
          border border-white/10 p-6 h-full
          transition-all duration-300
          group-hover:scale-[1.02] group-hover:border-white/25 group-hover:shadow-2xl
        `}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 text-8xl flex items-center justify-center">
          {waifu.emoji}
        </div>

        <div className="relative z-10">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${waifu.color}, ${waifu.accentColor})` }}
          >
            {waifu.emoji}
          </div>

          <h3 className="text-xl font-bold text-white mb-1">{waifu.game}</h3>
          <p className="text-sm text-white/50 mb-3">with {waifu.name} — {waifu.title}</p>
          <p className="text-sm text-white/70 mb-4">{description}</p>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all group-hover:gap-3"
            style={{ backgroundColor: `${waifu.color}40` }}
          >
            Play Now
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
