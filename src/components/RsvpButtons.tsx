"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Check, HelpCircle, X } from "lucide-react";

export function RsvpButtons({
  eventId,
  currentStatus,
}: {
  eventId: string;
  currentStatus: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRsvp(status: string) {
    setLoading(true);
    try {
      await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => handleRsvp("going")}
        variant={currentStatus === "going" ? "primary" : "outline"}
        disabled={loading}
        size="sm"
      >
        <Check className="mr-1 h-4 w-4" />
        Going
      </Button>
      <Button
        onClick={() => handleRsvp("maybe")}
        variant={currentStatus === "maybe" ? "secondary" : "outline"}
        disabled={loading}
        size="sm"
      >
        <HelpCircle className="mr-1 h-4 w-4" />
        Maybe
      </Button>
      <Button
        onClick={() => handleRsvp("not-going")}
        variant={currentStatus === "not-going" ? "danger" : "outline"}
        disabled={loading}
        size="sm"
      >
        <X className="mr-1 h-4 w-4" />
        Can&apos;t Make It
      </Button>
    </div>
  );
}
