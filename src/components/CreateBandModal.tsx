"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { useRouter } from "next/navigation";
import { GENRES } from "@/lib/constants";
import { PlusCircle } from "lucide-react";

export function CreateBandModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Band name is required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description,
          genres: selectedGenres.join(", "),
          photoUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create band");
      }

      const { band } = await res.json();
      setOpen(false);
      setName("");
      setDescription("");
      setSelectedGenres([]);
      setPhotoUrl("");
      router.push(`/bands/${band.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <PlusCircle className="mr-1.5 h-4 w-4" />
        Create Band
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Create a Band">
        <div className="space-y-4">
          <Input
            id="bandName"
            label="Band Name"
            placeholder='e.g. The Avery Pambianchi Trio'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            id="bandDescription"
            label="Description (optional)"
            placeholder="Tell venues about your band's sound and vibe..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <MultiSelect
            id="bandGenres"
            label="Genres"
            options={GENRES.map((g) => ({ value: g, label: g }))}
            value={selectedGenres}
            onChange={setSelectedGenres}
          />
          <Input
            id="bandPhotoUrl"
            label="Photo URL (optional)"
            placeholder="https://..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create Band"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
