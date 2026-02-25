"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { GENRES, INSTRUMENTS } from "@/lib/constants";

export default function NewGigPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("22:00");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [payMin, setPayMin] = useState("0");
  const [payMax, setPayMax] = useState("0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date,
          startTime,
          endTime,
          genres: selectedGenres.join(", "),
          instruments: selectedInstruments.join(", "),
          payMin: parseInt(payMin) || 0,
          payMax: parseInt(payMax) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create gig");
      }

      const { gig } = await res.json();
      router.push(`/gigs/${gig.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Post a New Gig</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          label="Gig Title"
          placeholder="e.g. Friday Night Jazz Trio"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          id="description"
          label="Description"
          placeholder="Describe the gig, what you're looking for..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          id="date"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="startTime"
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <Input
            id="endTime"
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <MultiSelect
          label="Genres"
          options={[...GENRES]}
          selected={selectedGenres}
          onChange={setSelectedGenres}
          placeholder="Select genres..."
        />
        <MultiSelect
          label="Desired Instruments"
          options={[...INSTRUMENTS]}
          selected={selectedInstruments}
          onChange={setSelectedInstruments}
          placeholder="Select instruments needed..."
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="payMin"
            label="Pay Min ($)"
            type="number"
            value={payMin}
            onChange={(e) => setPayMin(e.target.value)}
          />
          <Input
            id="payMax"
            label="Pay Max ($)"
            type="number"
            value={payMax}
            onChange={(e) => setPayMax(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Gig"}
          </Button>
        </div>
      </form>
    </div>
  );
}
