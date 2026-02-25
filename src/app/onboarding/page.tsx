"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Card } from "@/components/ui/Card";
import { Music, Building2 } from "lucide-react";
import { GENRES, INSTRUMENTS, VENUE_TYPES } from "@/lib/constants";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [step, setStep] = useState<"role" | "profile">("role");
  const [role, setRole] = useState<"musician" | "venue" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Musician fields
  const [bio, setBio] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Venue fields
  const [venueName, setVenueName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [venueType, setVenueType] = useState("");
  const [capacity, setCapacity] = useState("");

  if (session?.user?.onboarded) {
    router.replace("/dashboard");
    return null;
  }

  const handleSubmit = async () => {
    if (!role) return;
    setLoading(true);
    setError("");

    try {
      const body: Record<string, any> = { role };

      if (role === "musician") {
        body.bio = bio;
        body.instruments = selectedInstruments.join(", ");
        body.genres = selectedGenres.join(", ");
      } else {
        body.venueName = venueName;
        body.description = description;
        body.address = address;
        body.venueType = venueType;
        body.capacity = parseInt(capacity) || 0;
      }

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to complete onboarding");
      }

      await update();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Welcome to JazzConnect!</h1>
        <p className="mt-2 text-gray-600">
          {step === "role"
            ? "First, tell us who you are"
            : `Set up your ${role} profile`}
        </p>
      </div>

      {step === "role" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            hover
            className={`cursor-pointer text-center ${role === "musician" ? "ring-2 ring-jazz-500" : ""}`}
            onClick={() => setRole("musician")}
          >
            <Music className="mx-auto mb-3 h-10 w-10 text-jazz-600" />
            <h3 className="font-semibold">I&apos;m a Musician</h3>
            <p className="mt-1 text-sm text-gray-500">
              Find gigs at NYC venues
            </p>
          </Card>
          <Card
            hover
            className={`cursor-pointer text-center ${role === "venue" ? "ring-2 ring-jazz-500" : ""}`}
            onClick={() => setRole("venue")}
          >
            <Building2 className="mx-auto mb-3 h-10 w-10 text-gold-600" />
            <h3 className="font-semibold">I&apos;m a Venue</h3>
            <p className="mt-1 text-sm text-gray-500">
              Find musicians for your stage
            </p>
          </Card>
          <div className="sm:col-span-2">
            <Button
              className="w-full"
              disabled={!role}
              onClick={() => setStep("profile")}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : role === "musician" ? (
        <div className="space-y-4">
          <Textarea
            id="bio"
            label="Bio"
            placeholder="Tell venues about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <MultiSelect
            label="Instruments"
            options={[...INSTRUMENTS]}
            selected={selectedInstruments}
            onChange={setSelectedInstruments}
            placeholder="Select instruments..."
          />
          <MultiSelect
            label="Genres"
            options={[...GENRES]}
            selected={selectedGenres}
            onChange={setSelectedGenres}
            placeholder="Select genres..."
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("role")}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Complete Setup"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            id="venueName"
            label="Venue Name"
            placeholder="e.g. Blue Note"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />
          <Textarea
            id="description"
            label="Description"
            placeholder="Describe your venue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            id="address"
            label="Address"
            placeholder="131 W 3rd St, New York, NY"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Select
            id="venueType"
            label="Venue Type"
            placeholder="Select type..."
            options={VENUE_TYPES.map((t) => ({ value: t, label: t }))}
            value={venueType}
            onChange={(e) => setVenueType(e.target.value)}
          />
          <Input
            id="capacity"
            label="Capacity"
            type="number"
            placeholder="100"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("role")}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Complete Setup"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
