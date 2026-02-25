import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookingActions } from "@/components/BookingActions";
import { Button } from "@/components/ui/Button";
import { Calendar, Heart, Mail, Music, TrendingUp } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function MusicianDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "musician") redirect("/dashboard");

  const profile = await prisma.musicianProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      gigInterests: {
        include: {
          gig: { include: { venue: { include: { user: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
      invitations: {
        include: {
          gig: { include: { venue: { include: { user: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) redirect("/onboarding");

  const pendingInterests = profile.gigInterests.filter((i) => i.status === "pending");
  const acceptedInterests = profile.gigInterests.filter((i) => i.status === "accepted");
  const pendingInvitations = profile.invitations.filter((i) => i.status === "pending");
  const acceptedInvitations = profile.invitations.filter((i) => i.status === "accepted");

  const upcomingGigs = [
    ...acceptedInterests.map((i) => i.gig),
    ...acceptedInvitations.map((i) => i.gig),
  ]
    .filter((g) => new Date(g.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Musician Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {session.user.name}</p>
        </div>
        <Link href="/gigs">
          <Button>Browse Gigs</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-jazz-100">
              <Calendar className="h-5 w-5 text-jazz-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingGigs.length}</p>
              <p className="text-xs text-gray-500">Upcoming Gigs</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-100">
              <Heart className="h-5 w-5 text-gold-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingInterests.length}</p>
              <p className="text-xs text-gray-500">Pending Interests</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingInvitations.length}</p>
              <p className="text-xs text-gray-500">New Invitations</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.gigInterests.length}</p>
              <p className="text-xs text-gray-500">Total Applications</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Gigs */}
        <Card>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-jazz-600" />
            Upcoming Gigs
          </CardTitle>
          {upcomingGigs.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              No upcoming gigs yet. Browse available gigs!
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {upcomingGigs.slice(0, 5).map((gig) => (
                <Link
                  key={gig.id}
                  href={`/gigs/${gig.id}`}
                  className="block rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
                >
                  <div className="font-medium">{gig.title}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(gig.date), "MMM d, yyyy")} | {gig.startTime}–{gig.endTime}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Pending Invitations */}
        <Card>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-600" />
            Invitations
          </CardTitle>
          {profile.invitations.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              No invitations yet. Keep your profile updated!
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {profile.invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="rounded-lg border border-gray-100 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/gigs/${inv.gig.id}`}
                        className="font-medium text-jazz-600 hover:underline"
                      >
                        {inv.gig.title}
                      </Link>
                      <p className="text-sm text-gray-500">
                        from {inv.gig.venue.name || inv.gig.venue.user.name}
                      </p>
                      {inv.message && (
                        <p className="mt-1 text-sm text-gray-400 italic">
                          &ldquo;{inv.message}&rdquo;
                        </p>
                      )}
                    </div>
                    {inv.status === "pending" ? (
                      <BookingActions bookingId={inv.id} type="invitation" />
                    ) : (
                      <StatusBadge status={inv.status} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Sent Interests */}
        <Card className="lg:col-span-2">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-gold-600" />
            My Interests
          </CardTitle>
          {profile.gigInterests.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              You haven&apos;t expressed interest in any gigs yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {profile.gigInterests.map((interest) => (
                <div
                  key={interest.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                >
                  <div>
                    <Link
                      href={`/gigs/${interest.gig.id}`}
                      className="font-medium text-jazz-600 hover:underline"
                    >
                      {interest.gig.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {interest.gig.venue.name || interest.gig.venue.user.name} |{" "}
                      {format(new Date(interest.gig.date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <StatusBadge status={interest.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
