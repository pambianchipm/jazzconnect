import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookingActions } from "@/components/BookingActions";
import { Button } from "@/components/ui/Button";
import { Calendar, Users, Send, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function VenueDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "venue") redirect("/dashboard");

  const profile = await prisma.venueProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      gigs: {
        include: {
          interests: {
            include: { musician: { include: { user: true } } },
          },
          invitations: {
            include: { musician: { include: { user: true } } },
          },
          _count: { select: { interests: true } },
        },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!profile) redirect("/onboarding");

  const openGigs = profile.gigs.filter((g) => g.status === "open");
  const allInterests = profile.gigs.flatMap((g) =>
    g.interests.map((i) => ({ ...i, gig: g }))
  );
  const pendingInterests = allInterests.filter((i) => i.status === "pending");
  const allInvitations = profile.gigs.flatMap((g) =>
    g.invitations.map((i) => ({ ...i, gig: g }))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Venue Dashboard</h1>
          <p className="text-sm text-gray-500">
            {profile.name || session.user.name}
          </p>
        </div>
        <Link href="/gigs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post a Gig
          </Button>
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
              <p className="text-2xl font-bold">{openGigs.length}</p>
              <p className="text-xs text-gray-500">Open Gigs</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-100">
              <Users className="h-5 w-5 text-gold-600" />
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
              <Send className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allInvitations.length}</p>
              <p className="text-xs text-gray-500">Invitations Sent</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.gigs.length}</p>
              <p className="text-xs text-gray-500">Total Gigs Posted</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Open Gigs */}
        <Card>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-jazz-600" />
            Your Gigs
          </CardTitle>
          {profile.gigs.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-sm text-gray-400 mb-3">No gigs posted yet.</p>
              <Link href="/gigs/new">
                <Button size="sm">Post Your First Gig</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {profile.gigs.slice(0, 8).map((gig) => (
                <Link
                  key={gig.id}
                  href={`/gigs/${gig.id}`}
                  className="block rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{gig.title}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(gig.date), "MMM d, yyyy")} |{" "}
                        {gig._count.interests} interested
                      </div>
                    </div>
                    <StatusBadge status={gig.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Pending Interests */}
        <Card>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gold-600" />
            Pending Interests
          </CardTitle>
          {pendingInterests.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              No pending interests to review.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {pendingInterests.map((interest) => (
                <div
                  key={interest.id}
                  className="rounded-lg border border-gray-100 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/musicians/${interest.musician.id}`}
                        className="font-medium text-jazz-600 hover:underline"
                      >
                        {interest.musician.user.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        for{" "}
                        <Link
                          href={`/gigs/${interest.gig.id}`}
                          className="text-jazz-600 hover:underline"
                        >
                          {interest.gig.title}
                        </Link>
                      </p>
                      {interest.message && (
                        <p className="mt-1 text-sm text-gray-400 italic">
                          &ldquo;{interest.message}&rdquo;
                        </p>
                      )}
                    </div>
                    <BookingActions bookingId={interest.id} type="interest" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Sent Invitations */}
        <Card className="lg:col-span-2">
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-green-600" />
            Sent Invitations
          </CardTitle>
          {allInvitations.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              You haven&apos;t sent any invitations yet. Browse musicians to find talent!
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {allInvitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                >
                  <div>
                    <Link
                      href={`/musicians/${inv.musician.id}`}
                      className="font-medium text-jazz-600 hover:underline"
                    >
                      {inv.musician.user.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      for {inv.gig.title} |{" "}
                      {format(new Date(inv.gig.date), "MMM d")}
                    </p>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
