"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletDisplay } from "./WalletDisplay";

const NAV_ITEMS = [
  { href: "/casino", label: "🏠 Lobby" },
  { href: "/casino/roulette", label: "🎰 Roulette" },
  { href: "/casino/slots", label: "🌸 Slots" },
  { href: "/casino/blackjack", label: "❄️ Blackjack" },
];

export function CasinoNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link href="/casino" className="font-bold text-lg text-yellow-400 mr-4">
            ✨ WaifuCasino
          </Link>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-1.5 rounded-lg text-sm transition-colors
                  ${isActive
                    ? "bg-white/10 text-white font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <WalletDisplay />
      </div>
    </nav>
  );
}
