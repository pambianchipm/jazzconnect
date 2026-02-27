"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Card } from "@/components/ui/Card";
import { GENRES } from "@/lib/constants";
import { parseCommaSeparated } from "@/lib/utils";

export default function EditBandPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/bands/${id}`)
      .then((r) => r.json())
      .then(({ band }) => {
        if (!band) { router.push("/bands"); return; }
        setName(band.name);
        setDescription(band.description);
        setSelectedGenres(parseCommaSeparated(band.genres));
        setPhotoUrl(band.photoUrl);
        setLoading(false);
      });
  }, [id, router]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/bands/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          genres: selectedGenres.join(", "),
          photoUrl,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to save");
      }
      router.push(`/bands/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this band? This cannot be undone.")) return;
    await fetch(`/api/bands/${id}`, { method: "DELETE" });
    router.push("/bands");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Edit Band</h1>
      <Card>
        <div className="space-y-4">
          <Input
            id="bandName"
            label="Band Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            id="bandDescription"
            label="Description"
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
            label="Photo URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-between pt-2">
            <Button variant="danger" onClick={handleDelete}>
              Delete Band
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/bands/${id}`)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
