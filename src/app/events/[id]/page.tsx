import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatTime, getCategoryColor, getPlaceLabel } from "@/lib/utils";
import { MapPin, Clock, Users, Trophy, Medal } from "lucide-react";
import { RsvpButtons } from "@/components/RsvpButtons";
import { Avatar } from "@/components/ui/Avatar";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      rsvps: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      winners: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { place: "asc" },
      },
    },
  });

  if (!event) notFound();

  const goingUsers = event.rsvps.filter((r) => r.status === "going");
  const maybeUsers = event.rsvps.filter((r) => r.status === "maybe");
  const userRsvp = event.rsvps.find((r) => r.user.id === session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Badge className={getCategoryColor(event.category)}>
            {event.category}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
      </div>

      {/* Details card */}
      <Card className="mb-6 p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock className="h-5 w-5 text-reunion-600" />
            <span>
              {format(event.date, "EEEE, MMMM d, yyyy")}
              {!event.isAllDay && (
                <>
                  {" "}
                  &middot; {formatTime(event.startTime)} –{" "}
                  {formatTime(event.endTime)}
                </>
              )}
              {event.isAllDay && " · All Day"}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="h-5 w-5 text-reunion-600" />
              <span>{event.location}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Users className="h-5 w-5 text-reunion-600" />
            <span>
              {goingUsers.length} going
              {maybeUsers.length > 0 && `, ${maybeUsers.length} maybe`}
            </span>
          </div>
        </div>

        {event.description && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}
      </Card>

      {/* RSVP */}
      <Card className="mb-6 p-6">
        <h2 className="mb-4 text-lg font-semibold">Your RSVP</h2>
        <RsvpButtons
          eventId={event.id}
          currentStatus={userRsvp?.status ?? null}
        />
      </Card>

      {/* Winners */}
      {event.winners.length > 0 && (
        <Card className="mb-6 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Trophy className="h-5 w-5 text-warmth-500" />
            Winners
          </h2>
          <div className="space-y-3">
            {event.winners.map((winner) => (
              <div
                key={winner.id}
                className="flex items-center gap-3 rounded-lg bg-warmth-50 p-3"
              >
                <Medal
                  className={`h-6 w-6 ${
                    winner.place === 1
                      ? "text-warmth-500"
                      : winner.place === 2
                      ? "text-gray-400"
                      : "text-amber-700"
                  }`}
                />
                <Avatar
                  src={winner.user.image}
                  name={winner.user.name}
                  size="sm"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {winner.user.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getPlaceLabel(winner.place)}
                    {winner.note && ` — ${winner.note}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Attendees */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Who&apos;s Going ({goingUsers.length})
        </h2>
        {goingUsers.length === 0 ? (
          <p className="text-sm text-gray-500">
            No one has RSVP&apos;d yet. Be the first!
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {goingUsers.map((rsvp) => (
              <div
                key={rsvp.user.id}
                className="flex items-center gap-2 rounded-full bg-gray-50 py-1 pl-1 pr-3"
              >
                <Avatar
                  src={rsvp.user.image}
                  name={rsvp.user.name}
                  size="sm"
                />
                <span className="text-sm text-gray-700">
                  {rsvp.user.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
