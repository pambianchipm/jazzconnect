import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Music, Building2 } from "lucide-react";
import { OnboardingFormData } from "../types";

interface StepRoleSelectionProps {
  formData: OnboardingFormData;
  onChange: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  error?: string;
}

export function StepRoleSelection({ formData, onChange, onNext, error }: StepRoleSelectionProps) {
  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold">Tell us who you are</h2>
        <p className="mt-1 text-sm text-gray-500">Choose the role that best describes you</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          hover
          className={`cursor-pointer p-6 text-center transition-all ${
            formData.role === "musician"
              ? "ring-2 ring-jazz-500 bg-jazz-50/50"
              : "hover:border-jazz-200"
          }`}
          onClick={() => onChange({ role: "musician" })}
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-jazz-100">
            <Music className="h-7 w-7 text-jazz-600" />
          </div>
          <h3 className="font-semibold">I&apos;m a Musician</h3>
          <p className="mt-1 text-sm text-gray-500">
            Find gigs at NYC venues
          </p>
        </Card>
        <Card
          hover
          className={`cursor-pointer p-6 text-center transition-all ${
            formData.role === "venue"
              ? "ring-2 ring-jazz-500 bg-jazz-50/50"
              : "hover:border-gold-200"
          }`}
          onClick={() => onChange({ role: "venue" })}
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
            <Building2 className="h-7 w-7 text-gold-600" />
          </div>
          <h3 className="font-semibold">I&apos;m a Venue</h3>
          <p className="mt-1 text-sm text-gray-500">
            Find musicians for your stage
          </p>
        </Card>
      </div>

      {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}

      <Button className="mt-6 w-full" disabled={!formData.role} onClick={onNext}>
        Continue
      </Button>
    </div>
  );
}
