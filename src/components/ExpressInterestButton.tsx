"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

interface Props {
  gigId: string;
  existingStatus: string | null;
}

export function ExpressInterestButton({ gigId, existingStatus }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (existingStatus) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <Heart className="h-4 w-4 text-jazz-500" />
        <span className="text-sm">You expressed interest</span>
        <StatusBadge status={existingStatus} />
      </div>
    );
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gigId, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to express interest");
      }

      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Heart className="mr-2 h-4 w-4" />
        Express Interest
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Express Interest">
        <div className="space-y-4">
          <Textarea
            id="message"
            label="Message (optional)"
            placeholder="Tell the venue why you'd be a great fit..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Sending..." : "Send Interest"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
