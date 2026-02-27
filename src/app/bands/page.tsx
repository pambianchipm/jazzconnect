import { prisma } from "@/lib/prisma";
import { BandCard } from "@/components/BandCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  searchParams: { genre?: string };
}

async function BandList({ searchParams }: Props) {
  const where: any = {};
  if (searchParams.genre) where.genres = { contains: searchParams.genre };

  const bands = await prisma.band.findMany({
    where,
    include: {
      members: {
        include: { musician: { include: { user: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (bands.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No bands found"
        description="No bands have been formed yet. Musicians can create bands from their dashboard."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bands.map((band) => (
        <Link key={band.id} href={`/bands/${band.id}`}>
          <BandCard band={band} />
        </Link>
      ))}
    </div>
  );
}

export default function BandsPage({ searchParams }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-jazz-600" />
          Browse Bands
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover jazz bands available for gigs in NYC
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        }
      >
        <BandList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
