import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatTime, getCategoryColor } from "@/lib/utils";
import { MapPin, Clock, Users, Trophy } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const events = await prisma.event.findMany({
    include: {
      rsvps: true,
      winners: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Events</h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse everything on the reunion agenda
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No events yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const goingCount = event.rsvps.filter(
              (r) => r.status === "going"
            ).length;

            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card hover className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {event.title}
                        </h3>
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                      </div>

                      {event.description && (
                        <p className="mb-2 text-sm text-gray-500 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(event.date, "MMM d")} &middot;{" "}
                          {event.isAllDay
                            ? "All Day"
                            : `${formatTime(event.startTime)} – ${formatTime(event.endTime)}`}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {goingCount} going
                        </span>
                        {event.winners.length > 0 && (
                          <span className="flex items-center gap-1 text-warmth-600">
                            <Trophy className="h-3 w-3" />
                            {event.winners[0].user.name} won!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
