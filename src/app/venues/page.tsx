import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { Building2, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  searchParams: { venueType?: string };
}

async function VenueList({ searchParams }: Props) {
  const where: any = {};
  if (searchParams.venueType) where.venueType = searchParams.venueType;

  const venues = await prisma.venueProfile.findMany({
    where,
    include: {
      user: true,
      _count: { select: { gigs: { where: { status: "open" } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (venues.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No venues found"
        description="Try adjusting your filters or check back later."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {venues.map((v) => (
        <Link key={v.id} href={`/venues/${v.id}`}>
          <Card hover>
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{v.name || v.user.name}</h3>
              {v.venueType && <Badge variant="gold">{v.venueType}</Badge>}
            </div>
            {v.address && (
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{v.address}</span>
              </div>
            )}
            {v.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{v.description}</p>
            )}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
              {v.capacity > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {v.capacity} capacity
                </span>
              )}
              <span>{v._count.gigs} open gigs</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function VenuesPage({ searchParams }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-gold-600" />
          Browse Venues
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover NYC restaurants, bars, and lounges that host live jazz
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <FilterBar type="venues" />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        }
      >
        <VenueList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
