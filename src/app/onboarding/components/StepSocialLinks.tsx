import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { OnboardingFormData } from "../types";

interface StepSocialLinksProps {
  formData: OnboardingFormData;
  onChange: (updates: Partial<OnboardingFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

export function StepSocialLinks({ formData, onChange, errors, onNext, onBack }: StepSocialLinksProps) {
  const isMusician = formData.role === "musician";

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold">Social & Links</h2>
        <p className="mt-1 text-sm text-gray-500">
          Help people find you online (all optional)
        </p>
      </div>

      <div className="space-y-4">
        {isMusician && (
          <Input
            id="instagram"
            label="Instagram"
            placeholder="@yourhandle"
            value={formData.instagram}
            onChange={(e) => onChange({ instagram: e.target.value })}
            error={errors.instagram}
          />
        )}

        <Input
          id="website"
          label="Website"
          type="url"
          placeholder="https://yoursite.com"
          value={formData.website}
          onChange={(e) => onChange({ website: e.target.value })}
          error={errors.website}
        />

        {!isMusician && (
          <Input
            id="phone"
            label="Phone"
            type="tel"
            placeholder="(212) 555-1234"
            value={formData.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            error={errors.phone}
          />
        )}

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
