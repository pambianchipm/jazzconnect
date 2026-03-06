import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Button } from "@/components/ui/Button";
import { GENRES, INSTRUMENTS, VENUE_TYPES } from "@/lib/constants";
import { OnboardingFormData } from "../types";

interface StepBasicInfoProps {
  formData: OnboardingFormData;
  onChange: (updates: Partial<OnboardingFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

export function StepBasicInfo({ formData, onChange, errors, onNext, onBack }: StepBasicInfoProps) {
  if (formData.role === "musician") {
    return (
      <div>
        <div className="mb-6 text-center">
          <h2 className="text-lg font-semibold">Your Musician Profile</h2>
          <p className="mt-1 text-sm text-gray-500">Tell venues about yourself</p>
        </div>

        <div className="space-y-4">
          <div>
            <Textarea
              id="bio"
              label="Bio"
              required
              placeholder="Tell venues about yourself, your style, and experience..."
              value={formData.bio}
              onChange={(e) => onChange({ bio: e.target.value })}
              error={errors.bio}
              maxLength={500}
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {formData.bio.length}/500
            </p>
          </div>
          <MultiSelect
            label="Instruments"
            required
            options={[...INSTRUMENTS]}
            selected={formData.instruments}
            onChange={(instruments) => onChange({ instruments })}
            placeholder="Select instruments..."
            error={errors.instruments}
          />
          <MultiSelect
            label="Genres"
            required
            options={[...GENRES]}
            selected={formData.genres}
            onChange={(genres) => onChange({ genres })}
            placeholder="Select genres..."
            error={errors.genres}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button className="flex-1" onClick={onNext}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold">Your Venue Profile</h2>
        <p className="mt-1 text-sm text-gray-500">Tell musicians about your space</p>
      </div>

      <div className="space-y-4">
        <Input
          id="venueName"
          label="Venue Name"
          required
          placeholder="e.g. Blue Note"
          value={formData.venueName}
          onChange={(e) => onChange({ venueName: e.target.value })}
          error={errors.venueName}
        />
        <div>
          <Textarea
            id="description"
            label="Description"
            required
            placeholder="Describe your venue, atmosphere, and what makes it special..."
            value={formData.description}
            onChange={(e) => onChange({ description: e.target.value })}
            error={errors.description}
            maxLength={500}
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {formData.description.length}/500
          </p>
        </div>
        <Input
          id="address"
          label="Address"
          required
          placeholder="131 W 3rd St, New York, NY"
          value={formData.address}
          onChange={(e) => onChange({ address: e.target.value })}
          error={errors.address}
        />
        <Select
          id="venueType"
          label="Venue Type"
          required
          placeholder="Select type..."
          options={VENUE_TYPES.map((t) => ({ value: t, label: t }))}
          value={formData.venueType}
          onChange={(e) => onChange({ venueType: e.target.value })}
          error={errors.venueType}
        />
        <Input
          id="capacity"
          label="Capacity"
          type="number"
          placeholder="100"
          value={formData.capacity}
          onChange={(e) => onChange({ capacity: e.target.value })}
          error={errors.capacity}
        />

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button className="flex-1" onClick={onNext}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
