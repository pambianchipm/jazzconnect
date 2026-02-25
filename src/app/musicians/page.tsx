import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { parseCommaSeparated } from "@/lib/utils";
import { Music, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  searchParams: { genre?: string; instrument?: string };
}

async function MusicianList({ searchParams }: Props) {
  const where: any = {};
  if (searchParams.genre) where.genres = { contains: searchParams.genre };
  if (searchParams.instrument) where.instruments = { contains: searchParams.instrument };

  const musicians = await prisma.musicianProfile.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  if (musicians.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No musicians found"
        description="Try adjusting your filters or check back later."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {musicians.map((m) => {
        const instruments = parseCommaSeparated(m.instruments);
        const genres = parseCommaSeparated(m.genres);

        return (
          <Link key={m.id} href={`/musicians/${m.id}`}>
            <Card hover>
              <div className="flex items-start gap-3">
                <Avatar src={m.photoUrl || m.user.image} name={m.user.name} />
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{m.user.name}</h3>
                  <p className="text-sm text-gray-500">
                    {m.yearsExperience}y exp
                  </p>
                </div>
                <Badge
                  variant={m.available ? "green" : "default"}
                  className="ml-auto shrink-0"
                >
                  {m.available ? "Available" : "Busy"}
                </Badge>
              </div>
              {m.bio && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{m.bio}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1">
                {instruments.slice(0, 3).map((i) => (
                  <Badge key={i} variant="jazz">{i}</Badge>
                ))}
                {genres.slice(0, 2).map((g) => (
                  <Badge key={g} variant="gold">{g}</Badge>
                ))}
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default function MusiciansPage({ searchParams }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Music className="h-6 w-6 text-jazz-600" />
            Browse Musicians
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover talented jazz musicians in NYC
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <FilterBar type="musicians" />
        </Suspense>
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
        <MusicianList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
