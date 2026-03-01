"use client";

import { Button } from "@/components/ui/Button";
import { Heart, Calendar, Trophy, Newspaper } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/schedule");
    }
  }, [session, router]);

  if (status === "loading" || session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-reunion-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-reunion-900 via-reunion-800 to-reunion-950 px-4 py-24 text-white sm:py-32">
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Heart className="h-4 w-4 text-coral-400" />
            <span>Welcome to the Family</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Our Family Reunion{" "}
            <span className="text-warmth-400">Starts Here</span>
          </h1>
          <p className="mb-10 text-lg text-reunion-200 sm:text-xl">
            Everything you need in one place — the schedule, events, games,
            winners, and family updates. Sign in to join the fun.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" variant="secondary">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Everything in One App
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-reunion-100">
              <Calendar className="h-7 w-7 text-reunion-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Full Schedule</h3>
            <p className="text-sm text-gray-600">
              See what&apos;s happening today and what&apos;s coming up.
              Meals, games, outings — all in one timeline.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-warmth-100">
              <Trophy className="h-7 w-7 text-warmth-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Winners &amp; Events</h3>
            <p className="text-sm text-gray-600">
              Track who won the sack race, the cook-off, and every
              competition. Bragging rights included.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-coral-100">
              <Newspaper className="h-7 w-7 text-coral-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Live Feed</h3>
            <p className="text-sm text-gray-600">
              Announcements, updates, photos, and winner
              declarations — all in a centralized feed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-reunion-50 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to Join?</h2>
          <p className="mb-6 text-gray-600">
            Sign in with your Google or Facebook account to access
            the full reunion experience.
          </p>
          <Link href="/auth/signin">
            <Button size="lg">Sign In Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
