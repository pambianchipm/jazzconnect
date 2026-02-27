"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Slot {
  id: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  notes: string;
}

interface Props {
  bandId: string;
  existingSlots: Slot[];
}

export function BandAvailabilityManager({ bandId, existingSlots }: Props) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("22:00");
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!date) { setError("Date is required"); return; }
    setAdding(true);
    setError("");
    try {
      const res = await fetch(`/api/bands/${bandId}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, startTime, endTime, notes }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to add slot");
      }
      setDate(""); setNotes("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (slotId: string) => {
    await fetch(`/api/bands/${bandId}/availability`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId }),
    });
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Add Availability</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Input
          id="availDate"
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          id="availStart"
          type="time"
          label="Start"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          id="availEnd"
          type="time"
          label="End"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <Input
          id="availNotes"
          label="Notes"
          placeholder="Optional"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button size="sm" onClick={handleAdd} disabled={adding}>
        <PlusCircle className="mr-1.5 h-4 w-4" />
        {adding ? "Adding..." : "Add Slot"}
      </Button>

      {existingSlots.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-gray-700">All Slots</p>
          {existingSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded border border-gray-100 px-3 py-2"
            >
              <span className="text-sm">
                {format(new Date(slot.date), "MMM d, yyyy")} · {slot.startTime}–{slot.endTime}
                {slot.notes && ` · ${slot.notes}`}
              </span>
              <button
                onClick={() => handleDelete(slot.id)}
                className="ml-3 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
