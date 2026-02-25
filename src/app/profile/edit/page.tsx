"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { GENRES, INSTRUMENTS, VENUE_TYPES } from "@/lib/constants";
import { parseCommaSeparated } from "@/lib/utils";

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Musician fields
  const [bio, setBio] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [sampleTrackUrls, setSampleTrackUrls] = useState("");
  const [yearsExperience, setYearsExperience] = useState("0");
  const [available, setAvailable] = useState(true);

  // Venue fields
  const [venueName, setVenueName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [venueType, setVenueType] = useState("");
  const [capacity, setCapacity] = useState("0");
  const [phone, setPhone] = useState("");
  const [photoUrls, setPhotoUrls] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.musicianProfile) {
          const p = data.user.musicianProfile;
          setBio(p.bio);
          setSelectedInstruments(parseCommaSeparated(p.instruments));
          setSelectedGenres(parseCommaSeparated(p.genres));
          setInstagram(p.instagram);
          setWebsite(p.website);
          setPhotoUrl(p.photoUrl);
          setSampleTrackUrls(p.sampleTrackUrls);
          setYearsExperience(String(p.yearsExperience));
          setAvailable(p.available);
        } else if (data.user?.venueProfile) {
          const p = data.user.venueProfile;
          setVenueName(p.name);
          setDescription(p.description);
          setAddress(p.address);
          setVenueType(p.venueType);
          setCapacity(String(p.capacity));
          setWebsite(p.website);
          setPhone(p.phone);
          setPhotoUrls(p.photoUrls);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    const body =
      session?.user?.role === "musician"
        ? {
            bio,
            instruments: selectedInstruments.join(", "),
            genres: selectedGenres.join(", "),
            instagram,
            website,
            photoUrl,
            sampleTrackUrls,
            yearsExperience: parseInt(yearsExperience) || 0,
            available,
          }
        : {
            name: venueName,
            description,
            address,
            venueType,
            capacity: parseInt(capacity) || 0,
            website,
            phone,
            photoUrls,
          };

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-32 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Edit Profile</h1>

      {session?.user?.role === "musician" ? (
        <div className="space-y-4">
          <Textarea
            id="bio"
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <MultiSelect
            label="Instruments"
            options={[...INSTRUMENTS]}
            selected={selectedInstruments}
            onChange={setSelectedInstruments}
          />
          <MultiSelect
            label="Genres"
            options={[...GENRES]}
            selected={selectedGenres}
            onChange={setSelectedGenres}
          />
          <Input
            id="instagram"
            label="Instagram Handle"
            placeholder="@username"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
          <Input
            id="website"
            label="Website"
            placeholder="https://..."
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <Input
            id="photoUrl"
            label="Profile Photo URL"
            placeholder="https://..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <Input
            id="sampleTracks"
            label="Sample Track URLs (comma-separated)"
            placeholder="https://soundcloud.com/..., https://..."
            value={sampleTrackUrls}
            onChange={(e) => setSampleTrackUrls(e.target.value)}
          />
          <Input
            id="yearsExperience"
            label="Years of Experience"
            type="number"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="rounded border-gray-300"
            />
            Available for gigs
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            id="venueName"
            label="Venue Name"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />
          <Textarea
            id="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            id="address"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Select
            id="venueType"
            label="Venue Type"
            options={VENUE_TYPES.map((t) => ({ value: t, label: t }))}
            value={venueType}
            onChange={(e) => setVenueType(e.target.value)}
          />
          <Input
            id="capacity"
            label="Capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <Input
            id="website"
            label="Website"
            placeholder="https://..."
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <Input
            id="phone"
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            id="photoUrls"
            label="Photo URLs (comma-separated)"
            value={photoUrls}
            onChange={(e) => setPhotoUrls(e.target.value)}
          />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-4 text-sm text-green-600">Profile saved!</p>}

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
