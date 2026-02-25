import { prisma } from "@/lib/prisma";
import { GigCard } from "@/components/GigCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/Button";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Props {
  searchParams: {
    genre?: string;
    instrument?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

async function GigList({ searchParams }: Props) {
  const where: any = { status: "open" };
  if (searchParams.genre) where.genres = { contains: searchParams.genre };
  if (searchParams.instrument) where.instruments = { contains: searchParams.instrument };
  if (searchParams.dateFrom || searchParams.dateTo) {
    where.date = {};
    if (searchParams.dateFrom) where.date.gte = new Date(searchParams.dateFrom);
    if (searchParams.dateTo) where.date.lte = new Date(searchParams.dateTo);
  }

  const gigs = await prisma.gig.findMany({
    where,
    include: {
      venue: { include: { user: true } },
      _count: { select: { interests: true } },
    },
    orderBy: { date: "asc" },
  });

  if (gigs.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No gigs found"
        description="Try adjusting your filters or check back later."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {gigs.map((gig) => (
        <GigCard key={gig.id} gig={gig as any} />
      ))}
    </div>
  );
}

export default async function GigsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const isVenue = session?.user?.role === "venue";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-jazz-600" />
            Browse Gigs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Open jazz gigs across NYC venues
          </p>
        </div>
        {isVenue && (
          <Link href="/gigs/new">
            <Button>Post a Gig</Button>
          </Link>
        )}
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <FilterBar type="gigs" />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        }
      >
        <GigList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
