"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

interface Props {
  bookingId: string;
  type: "interest" | "invitation";
}

export function BookingActions({ bookingId, type }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (status: "accepted" | "declined") => {
    setLoading(status);
    try {
      await fetch(`/api/booking/${bookingId}?type=${type}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handleAction("accepted")}
        disabled={loading !== null}
      >
        <Check className="mr-1 h-3.5 w-3.5" />
        {loading === "accepted" ? "..." : "Accept"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleAction("declined")}
        disabled={loading !== null}
      >
        <X className="mr-1 h-3.5 w-3.5" />
        {loading === "declined" ? "..." : "Decline"}
      </Button>
    </div>
  );
}
