import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format, isToday, isTomorrow, startOfDay, addDays } from "date-fns";
import { ScheduleView } from "@/components/ScheduleView";

export default async function SchedulePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const now = new Date();
  const today = startOfDay(now);
  const weekEnd = addDays(today, 7);

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: today,
        lte: weekEnd,
      },
    },
    include: {
      rsvps: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      winners: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const grouped = events.reduce<
    Record<string, typeof events>
  >((acc, event) => {
    const key = format(event.date, "yyyy-MM-dd");
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  const days = Object.entries(grouped).map(([dateKey, dayEvents]) => {
    const date = new Date(dateKey);
    let label = format(date, "EEEE, MMMM d");
    if (isToday(date)) label = "Today — " + label;
    else if (isTomorrow(date)) label = "Tomorrow — " + label;
    return { label, dateKey, events: dayEvents };
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        <p className="mt-1 text-sm text-gray-500">
          What&apos;s happening this week
        </p>
      </div>

      {days.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No events scheduled yet. Check back soon!</p>
        </div>
      ) : (
        <ScheduleView days={days} userId={session.user.id} />
      )}
    </div>
  );
}
