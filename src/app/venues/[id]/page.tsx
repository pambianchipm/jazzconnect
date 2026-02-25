import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";
import { MapPin, Users, Globe, Phone } from "lucide-react";
import Link from "next/link";

export default async function VenueProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await prisma.venueProfile.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      gigs: {
        where: { status: "open" },
        orderBy: { date: "asc" },
        take: 5,
      },
    },
  });

  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{profile.name || profile.user.name}</h1>
        {profile.venueType && (
          <Badge variant="gold" className="mt-2">
            {profile.venueType}
          </Badge>
        )}
        <div className="mt-3 space-y-1">
          {profile.address && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{profile.address}</span>
            </div>
          )}
          {profile.capacity > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>Capacity: {profile.capacity}</span>
            </div>
          )}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-jazz-600 hover:underline"
            >
              <Globe className="h-4 w-4" />
              Website
            </a>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="h-4 w-4" />
              <span>{profile.phone}</span>
            </div>
          )}
        </div>
      </div>

      {profile.description && (
        <Card className="mb-6">
          <h2 className="mb-2 font-semibold">About</h2>
          <p className="text-sm text-gray-600">{profile.description}</p>
        </Card>
      )}

      {profile.address && (
        <div className="mb-6">
          <GoogleMapEmbed address={profile.address} />
        </div>
      )}

      {profile.gigs.length > 0 && (
        <Card>
          <h2 className="mb-4 font-semibold">Open Gigs</h2>
          <div className="space-y-3">
            {profile.gigs.map((gig) => (
              <Link
                key={gig.id}
                href={`/gigs/${gig.id}`}
                className="block rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
              >
                <div className="font-medium">{gig.title}</div>
                <div className="text-sm text-gray-500">
                  {new Date(gig.date).toLocaleDateString()} | {gig.startTime}–{gig.endTime}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
