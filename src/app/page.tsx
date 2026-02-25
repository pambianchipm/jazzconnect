"use client";

import { Button } from "@/components/ui/Button";
import { Music, MapPin, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-jazz-900 via-jazz-800 to-jazz-950 px-4 py-24 text-white sm:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Music className="h-4 w-4 text-gold-400" />
            <span>NYC&apos;s Jazz Gig Marketplace</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Where Jazz Musicians{" "}
            <span className="text-gold-400">Meet the Stage</span>
          </h1>
          <p className="mb-10 text-lg text-jazz-200 sm:text-xl">
            Connect with the best jazz venues in New York City. Whether you&apos;re a
            musician looking for gigs or a venue seeking talent — JazzConnect
            brings the scene together.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button size="lg" variant="secondary" onClick={() => signIn("google")}>
                Get Started
              </Button>
            )}
            <Link href="/gigs">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Browse Gigs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-jazz-100">
              <Users className="h-7 w-7 text-jazz-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Create Your Profile</h3>
            <p className="text-sm text-gray-600">
              Musicians showcase their instruments, genres, and experience.
              Venues highlight their space and vibe.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold-100">
              <Calendar className="h-7 w-7 text-gold-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Post & Browse Gigs</h3>
            <p className="text-sm text-gray-600">
              Venues post open gigs with dates, pay, and requirements.
              Musicians browse and express interest.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
              <MapPin className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Match & Play</h3>
            <p className="text-sm text-gray-600">
              Accept interest or send invitations. Confirm bookings and hit the
              stage at NYC&apos;s finest spots.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-jazz-50 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to Join the Scene?</h2>
          <p className="mb-6 text-gray-600">
            Whether you&apos;re a seasoned saxophonist or a cozy wine bar in the
            Village, JazzConnect has a spot for you.
          </p>
          {session ? (
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <Button size="lg" onClick={() => signIn("google")}>
              Sign Up with Google
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
