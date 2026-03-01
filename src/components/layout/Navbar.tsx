"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={session ? "/schedule" : "/"} className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-coral-500" />
          <span className="text-xl font-bold text-gray-900">
            Family<span className="text-reunion-600">Reunion</span>
          </span>
        </Link>

        {session && (
          <>
            {/* Desktop nav */}
            <div className="hidden items-center gap-6 md:flex">
              <Link href="/schedule" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Schedule
              </Link>
              <Link href="/events" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Events
              </Link>
              <Link href="/feed" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Feed
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  <Avatar src={session.user.image} name={session.user.name} size="sm" />
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </>
        )}

        {!session && status !== "loading" && (
          <Link href="/auth/signin">
            <Button size="sm">Sign In</Button>
          </Link>
        )}
      </div>

      {/* Mobile nav */}
      {menuOpen && session && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/schedule" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
              Schedule
            </Link>
            <Link href="/events" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
              Events
            </Link>
            <Link href="/feed" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
              Feed
            </Link>
            <Link href="/profile" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
