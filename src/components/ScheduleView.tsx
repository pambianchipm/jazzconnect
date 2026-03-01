"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatTime, getCategoryColor } from "@/lib/utils";
import { MapPin, Clock, Users, Trophy } from "lucide-react";
import Link from "next/link";

interface EventData {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  rsvps: {
    user: { id: string; name: string | null; image: string | null };
    status: string;
  }[];
  winners: {
    place: number;
    user: { id: string; name: string | null; image: string | null };
  }[];
}

interface DayGroup {
  label: string;
  dateKey: string;
  events: EventData[];
}

export function ScheduleView({
  days,
  userId,
}: {
  days: DayGroup[];
  userId: string;
}) {
  return (
    <div className="space-y-8">
      {days.map((day) => (
        <div key={day.dateKey}>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {day.label}
          </h2>
          <div className="space-y-3">
            {day.events.map((event) => {
              const goingCount = event.rsvps.filter(
                (r) => r.status === "going"
              ).length;
              const userRsvp = event.rsvps.find(
                (r) => r.user.id === userId
              );

              return (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card hover className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Time column */}
                      <div className="flex w-20 shrink-0 flex-col items-center rounded-lg bg-gray-50 py-2 text-center">
                        {event.isAllDay ? (
                          <span className="text-sm font-medium text-gray-600">
                            All Day
                          </span>
                        ) : (
                          <>
                            <span className="text-sm font-bold text-gray-900">
                              {formatTime(event.startTime)}
                            </span>
                            <span className="text-xs text-gray-400">to</span>
                            <span className="text-xs text-gray-500">
                              {formatTime(event.endTime)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Content */}
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
                          <p className="mb-2 text-sm text-gray-500 line-clamp-1">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
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
                              Winners announced
                            </span>
                          )}
                          {userRsvp && (
                            <Badge
                              variant={
                                userRsvp.status === "going"
                                  ? "green"
                                  : "default"
                              }
                            >
                              {userRsvp.status === "going"
                                ? "You're going"
                                : userRsvp.status === "maybe"
                                ? "Maybe"
                                : "Not going"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
