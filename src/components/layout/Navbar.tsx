"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Menu, X, Music } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Music className="h-6 w-6 text-jazz-600" />
          <span className="text-xl font-bold text-gray-900">
            Jazz<span className="text-jazz-600">Connect</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/musicians" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Musicians
          </Link>
          <Link href="/venues" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Venues
          </Link>
          <Link href="/gigs" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Gigs
          </Link>

          {status === "loading" ? (
            <div className="h-10 w-20 animate-pulse rounded-lg bg-gray-200" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile/edit">
                <Avatar src={session.user.image} name={session.user.name} size="sm" />
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={() => signIn("google")} size="sm">
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/musicians" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
              Musicians
            </Link>
            <Link href="/venues" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
              Venues
            </Link>
            <Link href="/gigs" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
              Gigs
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/profile/edit" className="text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
                  Edit Profile
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => signIn("google")} size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
