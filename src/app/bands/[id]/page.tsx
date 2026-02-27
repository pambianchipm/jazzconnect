import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardTitle } from "@/components/ui/Card";
import { parseCommaSeparated } from "@/lib/utils";
import { Users, Music, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { BandAvailabilityManager } from "./BandAvailabilityManager";
import { BandMemberManager } from "./BandMemberManager";

export default async function BandProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const band = await prisma.band.findUnique({
    where: { id: params.id },
    include: {
      members: {
        include: { musician: { include: { user: true } } },
        orderBy: { joinedAt: "asc" },
      },
      availability: { orderBy: { date: "asc" } },
    },
  });

  if (!band) notFound();

  const genres = parseCommaSeparated(band.genres);

  // Determine if the current user is an admin of this band
  let viewerMusicianId: string | null = null;
  let isAdmin = false;

  if (session?.user?.id) {
    const profile = await prisma.musicianProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (profile) {
      viewerMusicianId = profile.id;
      const membership = band.members.find((m) => m.musicianId === profile.id);
      isAdmin = membership?.isAdmin ?? false;
    }
  }

  const upcomingAvailability = band.availability.filter(
    (a) => new Date(a.date) >= new Date()
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-start gap-6">
        {band.photoUrl ? (
          <img
            src={band.photoUrl}
            alt={band.name}
            className="h-20 w-20 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-jazz-100">
            <Users className="h-10 w-10 text-jazz-600" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{band.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {band.members.length} member{band.members.length !== 1 ? "s" : ""}
          </p>
          {genres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {genres.map((g) => (
                <Badge key={g} variant="gold">{g}</Badge>
              ))}
            </div>
          )}
          {isAdmin && (
            <Link
              href={`/bands/${band.id}/edit`}
              className="mt-3 inline-block text-sm text-jazz-600 hover:underline"
            >
              Edit band
            </Link>
          )}
        </div>
      </div>

      {/* Description */}
      {band.description && (
        <Card className="mb-6">
          <h2 className="mb-2 font-semibold">About</h2>
          <p className="text-sm text-gray-600">{band.description}</p>
        </Card>
      )}

      {/* Members */}
      <Card className="mb-6">
        <CardTitle className="mb-4 flex items-center gap-2">
          <Music className="h-4 w-4" /> Members
        </CardTitle>
        <div className="space-y-3">
          {band.members.map((m) => (
            <Link
              key={m.id}
              href={`/musicians/${m.musicianId}`}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
            >
              <Avatar
                src={m.musician.photoUrl || m.musician.user.image}
                name={m.musician.user.name}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{m.musician.user.name}</p>
                <p className="text-sm text-gray-500">
                  {parseCommaSeparated(m.musician.instruments).slice(0, 2).join(", ")}
                </p>
              </div>
              {m.isAdmin && (
                <Badge variant="jazz">Leader</Badge>
              )}
            </Link>
          ))}
        </div>

        {isAdmin && (
          <div className="mt-4 border-t pt-4">
            <BandMemberManager bandId={band.id} />
          </div>
        )}
      </Card>

      {/* Availability */}
      <Card>
        <CardTitle className="mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Availability
        </CardTitle>
        {upcomingAvailability.length === 0 ? (
          <p className="text-sm text-gray-400">No upcoming availability listed.</p>
        ) : (
          <div className="space-y-2">
            {upcomingAvailability.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-sm">
                    {format(new Date(slot.date), "EEEE, MMM d, yyyy")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {slot.startTime}–{slot.endTime}
                    {slot.notes && ` · ${slot.notes}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="mt-4 border-t pt-4">
            <BandAvailabilityManager bandId={band.id} existingSlots={band.availability} />
          </div>
        )}
      </Card>
    </div>
  );
}
