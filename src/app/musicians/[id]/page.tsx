import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { parseCommaSeparated } from "@/lib/utils";
import { Music, Globe, Instagram, Clock } from "lucide-react";

export default async function MusicianProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await prisma.musicianProfile.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!profile) notFound();

  const instruments = parseCommaSeparated(profile.instruments);
  const genres = parseCommaSeparated(profile.genres);
  const tracks = parseCommaSeparated(profile.sampleTrackUrls);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-start gap-6">
        <Avatar
          src={profile.photoUrl || profile.user.image}
          name={profile.user.name}
          size="lg"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.user.name}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{profile.yearsExperience} years experience</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            {profile.instagram && (
              <a
                href={
                  profile.instagram.startsWith("http")
                    ? profile.instagram
                    : `https://instagram.com/${profile.instagram.replace(/^@/, "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-pink-500 hover:underline"
              >
                <Instagram className="h-4 w-4" />
                {profile.instagram.startsWith("http")
                  ? profile.instagram
                  : `@${profile.instagram.replace(/^@/, "")}`}
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-jazz-600 hover:underline"
              >
                <Globe className="h-4 w-4" />
                Website
              </a>
            )}
          </div>
          <Badge variant={profile.available ? "green" : "red"} className="mt-2">
            {profile.available ? "Available" : "Not Available"}
          </Badge>
        </div>
      </div>

      {profile.bio && (
        <Card className="mb-6">
          <h2 className="mb-2 font-semibold">About</h2>
          <p className="text-sm text-gray-600">{profile.bio}</p>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold flex items-center gap-2">
            <Music className="h-4 w-4" /> Instruments
          </h2>
          <div className="flex flex-wrap gap-2">
            {instruments.map((i) => (
              <Badge key={i} variant="jazz">{i}</Badge>
            ))}
            {instruments.length === 0 && (
              <span className="text-sm text-gray-400">None listed</span>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <Badge key={g} variant="gold">{g}</Badge>
            ))}
            {genres.length === 0 && (
              <span className="text-sm text-gray-400">None listed</span>
            )}
          </div>
        </Card>
      </div>

      {tracks.length > 0 && (
        <Card className="mt-6">
          <h2 className="mb-3 font-semibold">Sample Tracks</h2>
          <ul className="space-y-1">
            {tracks.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-jazz-600 hover:underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
