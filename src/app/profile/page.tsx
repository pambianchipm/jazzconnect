import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Calendar, Check } from "lucide-react";
import { getPlaceLabel } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      rsvps: {
        where: { status: "going" },
        include: {
          event: { select: { id: true, title: true, date: true, category: true } },
        },
        orderBy: { event: { date: "asc" } },
      },
      winners: {
        include: {
          event: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/auth/signin");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Profile header */}
      <Card className="mb-6 p-6">
        <div className="flex items-center gap-4">
          <Avatar src={user.image} name={user.name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            {session.user.isAdmin && (
              <Badge variant="reunion" className="mt-1">Admin</Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <Calendar className="mx-auto mb-2 h-6 w-6 text-reunion-500" />
          <p className="text-2xl font-bold text-gray-900">{user.rsvps.length}</p>
          <p className="text-xs text-gray-500">Events Attending</p>
        </Card>
        <Card className="p-4 text-center">
          <Trophy className="mx-auto mb-2 h-6 w-6 text-warmth-500" />
          <p className="text-2xl font-bold text-gray-900">{user.winners.length}</p>
          <p className="text-xs text-gray-500">Wins</p>
        </Card>
      </div>

      {/* Wins */}
      {user.winners.length > 0 && (
        <Card className="mb-6 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Trophy className="h-5 w-5 text-warmth-500" />
            Your Wins
          </h2>
          <div className="space-y-2">
            {user.winners.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-lg bg-warmth-50 p-3">
                <span className="font-medium text-gray-900">{w.event.title}</span>
                <Badge variant="warmth">{getPlaceLabel(w.place)}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Upcoming events */}
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Check className="h-5 w-5 text-reunion-500" />
          Events You&apos;re Attending
        </h2>
        {user.rsvps.length === 0 ? (
          <p className="text-sm text-gray-500">
            You haven&apos;t RSVP&apos;d to any events yet.
          </p>
        ) : (
          <div className="space-y-2">
            {user.rsvps.map((rsvp) => (
              <div key={rsvp.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-medium text-gray-900">
                  {rsvp.event.title}
                </span>
                <Badge variant="green">Going</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
