"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { useEffect } from "react";

interface Musician {
  id: string;
  user: { name: string | null };
}

interface Props {
  bandId: string;
}

export function BandMemberManager({ bandId }: Props) {
  const router = useRouter();
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/musicians")
      .then((r) => r.json())
      .then((data) => setMusicians(data.musicians ?? []));
  }, []);

  const handleAdd = async () => {
    if (!selectedId) { setError("Please select a musician"); return; }
    setAdding(true);
    setError("");
    try {
      const res = await fetch(`/api/bands/${bandId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ musicianId: selectedId }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to add member");
      }
      setSelectedId("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Add Member</p>
      <div className="flex gap-2">
        <Select
          id="memberSelect"
          label=""
          placeholder="Select musician..."
          options={musicians.map((m) => ({
            value: m.id,
            label: m.user.name ?? "Unknown",
          }))}
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex-1"
        />
        <Button size="sm" onClick={handleAdd} disabled={adding}>
          <UserPlus className="mr-1.5 h-4 w-4" />
          {adding ? "Adding..." : "Add"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
