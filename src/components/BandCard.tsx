import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { parseCommaSeparated } from "@/lib/utils";
import { Users } from "lucide-react";

interface Member {
  musician: {
    photoUrl: string;
    user: { name: string | null; image: string | null };
  };
}

interface BandCardProps {
  band: {
    id: string;
    name: string;
    description: string;
    genres: string;
    photoUrl: string;
    members: Member[];
  };
}

export function BandCard({ band }: BandCardProps) {
  const genres = parseCommaSeparated(band.genres);

  return (
    <Card hover>
      <div className="flex items-start gap-3">
        {band.photoUrl ? (
          <img
            src={band.photoUrl}
            alt={band.name}
            className="h-12 w-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-jazz-100">
            <Users className="h-6 w-6 text-jazz-600" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{band.name}</h3>
          <p className="text-sm text-gray-500">
            {band.members.length} member{band.members.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {band.description && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{band.description}</p>
      )}

      <div className="mt-3 flex -space-x-2">
        {band.members.slice(0, 5).map((m, i) => (
          <Avatar
            key={i}
            src={m.musician.photoUrl || m.musician.user.image}
            name={m.musician.user.name}
            size="sm"
            className="ring-2 ring-white"
          />
        ))}
        {band.members.length > 5 && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 ring-2 ring-white">
            +{band.members.length - 5}
          </div>
        )}
      </div>

      {genres.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {genres.slice(0, 3).map((g) => (
            <Badge key={g} variant="gold">{g}</Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
