import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { parseCommaSeparated, formatPay } from "@/lib/utils";
import { Calendar, Clock, MapPin, DollarSign, Music } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { ExpressInterestButton } from "@/components/ExpressInterestButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function GigDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const gig = await prisma.gig.findUnique({
    where: { id: params.id },
    include: {
      venue: { include: { user: true } },
      interests: {
        include: { musician: { include: { user: true } } },
      },
    },
  });

  if (!gig) notFound();

  const genres = parseCommaSeparated(gig.genres);
  const instruments = parseCommaSeparated(gig.instruments);
  const venueName = gig.venue.name || gig.venue.user.name || "Venue";

  // Check if current musician already expressed interest
  let existingInterest = null;
  if (session?.user?.role === "musician") {
    const musicianProfile = await prisma.musicianProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (musicianProfile) {
      existingInterest = await prisma.gigInterest.findUnique({
        where: {
          gigId_musicianId: {
            gigId: gig.id,
            musicianId: musicianProfile.id,
          },
        },
      });
    }
  }

  const isVenueOwner = session?.user?.id === gig.venue.userId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{gig.title}</h1>
          <Link
            href={`/venues/${gig.venue.id}`}
            className="mt-1 text-sm text-jazz-600 hover:underline"
          >
            {venueName}
          </Link>
        </div>
        <StatusBadge status={gig.status} />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{format(new Date(gig.date), "EEEE, MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{gig.startTime}–{gig.endTime}</span>
        </div>
        {gig.venue.address && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{gig.venue.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span>{formatPay(gig.payMin, gig.payMax)}</span>
        </div>
      </div>

      {gig.description && (
        <Card className="mb-6">
          <h2 className="mb-2 font-semibold">Description</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{gig.description}</p>
        </Card>
      )}

      {(genres.length > 0 || instruments.length > 0) && (
        <Card className="mb-6">
          {genres.length > 0 && (
            <div className="mb-3">
              <h2 className="mb-2 text-sm font-semibold text-gray-500">Genres</h2>
              <div className="flex flex-wrap gap-1.5">
                {genres.map((g) => (
                  <Badge key={g} variant="gold">{g}</Badge>
                ))}
              </div>
            </div>
          )}
          {instruments.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-500">
                <Music className="mr-1 inline h-4 w-4" />
                Looking For
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {instruments.map((i) => (
                  <Badge key={i} variant="jazz">{i}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Express interest (musician only) */}
      {session?.user?.role === "musician" && gig.status === "open" && (
        <div className="mb-6">
          <ExpressInterestButton
            gigId={gig.id}
            existingStatus={existingInterest?.status ?? null}
          />
        </div>
      )}

      {/* Interests list (venue owner only) */}
      {isVenueOwner && gig.interests.length > 0 && (
        <Card className="mb-6">
          <h2 className="mb-4 font-semibold">
            Interested Musicians ({gig.interests.length})
          </h2>
          <div className="space-y-3">
            {gig.interests.map((interest) => (
              <div
                key={interest.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <div>
                  <Link
                    href={`/musicians/${interest.musician.id}`}
                    className="font-medium text-jazz-600 hover:underline"
                  >
                    {interest.musician.user.name}
                  </Link>
                  {interest.message && (
                    <p className="mt-1 text-sm text-gray-500">{interest.message}</p>
                  )}
                </div>
                <StatusBadge status={interest.status} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
