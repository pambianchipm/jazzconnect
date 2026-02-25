"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

interface Props {
  musicianId: string;
  musicianName: string;
  gigs: { id: string; title: string }[];
}

export function InviteModal({ musicianId, musicianName, gigs }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [gigId, setGigId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!gigId) {
      setError("Please select a gig");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gigId, musicianId, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send invitation");
      }

      setOpen(false);
      setGigId("");
      setMessage("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (gigs.length === 0) return null;

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Send className="mr-1 h-3.5 w-3.5" />
        Invite
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Invite ${musicianName}`}
      >
        <div className="space-y-4">
          <Select
            id="gigSelect"
            label="Select a Gig"
            placeholder="Choose gig..."
            options={gigs.map((g) => ({ value: g.id, label: g.title }))}
            value={gigId}
            onChange={(e) => setGigId(e.target.value)}
          />
          <Textarea
            id="inviteMessage"
            label="Message (optional)"
            placeholder="Add a note to your invitation..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
