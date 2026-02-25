import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { parseCommaSeparated, formatPay } from "@/lib/utils";
import { Calendar, Clock, MapPin, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface GigCardProps {
  gig: {
    id: string;
    title: string;
    date: string | Date;
    startTime: string;
    endTime: string;
    genres: string;
    instruments: string;
    payMin: number;
    payMax: number;
    status: string;
    venue: {
      name: string;
      address: string;
      user: { name: string | null };
    };
    _count?: { interests: number };
  };
}

export function GigCard({ gig }: GigCardProps) {
  const genres = parseCommaSeparated(gig.genres);
  const instruments = parseCommaSeparated(gig.instruments);
  const venueName = gig.venue.name || gig.venue.user.name || "Venue";

  return (
    <Link href={`/gigs/${gig.id}`}>
      <Card hover className="transition-all">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{gig.title}</h3>
            <p className="mt-0.5 text-sm text-gray-500">{venueName}</p>
          </div>
          <StatusBadge status={gig.status} />
        </div>

        <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{format(new Date(gig.date), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{gig.startTime}–{gig.endTime}</span>
          </div>
          {gig.venue.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate">{gig.venue.address}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>{formatPay(gig.payMin, gig.payMax)}</span>
          </div>
        </div>

        {(genres.length > 0 || instruments.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <Badge key={g} variant="gold">{g}</Badge>
            ))}
            {instruments.map((i) => (
              <Badge key={i} variant="jazz">{i}</Badge>
            ))}
          </div>
        )}

        {gig._count && (
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
            <Users className="h-3 w-3" />
            {gig._count.interests} interested
          </div>
        )}
      </Card>
    </Link>
  );
}
