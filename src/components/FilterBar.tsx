"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GENRES, INSTRUMENTS, VENUE_TYPES } from "@/lib/constants";

interface FilterBarProps {
  type: "musicians" | "venues" | "gigs";
}

export function FilterBar({ type }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/${type}`);
  };

  if (type === "musicians") {
    return (
      <div className="flex flex-wrap items-end gap-3">
        <Select
          options={GENRES.map((g) => ({ value: g, label: g }))}
          placeholder="All Genres"
          value={searchParams.get("genre") || ""}
          onChange={(e) => updateParam("genre", e.target.value)}
        />
        <Select
          options={INSTRUMENTS.map((i) => ({ value: i, label: i }))}
          placeholder="All Instruments"
          value={searchParams.get("instrument") || ""}
          onChange={(e) => updateParam("instrument", e.target.value)}
        />
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    );
  }

  if (type === "venues") {
    return (
      <div className="flex flex-wrap items-end gap-3">
        <Select
          options={VENUE_TYPES.map((v) => ({ value: v, label: v }))}
          placeholder="All Types"
          value={searchParams.get("venueType") || ""}
          onChange={(e) => updateParam("venueType", e.target.value)}
        />
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    );
  }

  // gigs
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Select
        options={GENRES.map((g) => ({ value: g, label: g }))}
        placeholder="All Genres"
        value={searchParams.get("genre") || ""}
        onChange={(e) => updateParam("genre", e.target.value)}
      />
      <Select
        options={INSTRUMENTS.map((i) => ({ value: i, label: i }))}
        placeholder="All Instruments"
        value={searchParams.get("instrument") || ""}
        onChange={(e) => updateParam("instrument", e.target.value)}
      />
      <Input
        type="date"
        value={searchParams.get("dateFrom") || ""}
        onChange={(e) => updateParam("dateFrom", e.target.value)}
        placeholder="From"
      />
      <Input
        type="date"
        value={searchParams.get("dateTo") || ""}
        onChange={(e) => updateParam("dateTo", e.target.value)}
        placeholder="To"
      />
      <Button variant="ghost" size="sm" onClick={clearFilters}>
        Clear
      </Button>
    </div>
  );
}
