import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OnboardingFormData } from "../types";

interface StepReviewProps {
  formData: OnboardingFormData;
  goToStep: (step: number) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string;
}

function SectionHeader({ title, onEdit }: { title: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        className="text-xs font-medium text-jazz-600 hover:text-jazz-700"
      >
        Edit
      </button>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  );
}

export function StepReview({ formData, goToStep, onSubmit, loading, error }: StepReviewProps) {
  const isMusician = formData.role === "musician";

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold">Review Your Profile</h2>
        <p className="mt-1 text-sm text-gray-500">
          Make sure everything looks good before submitting
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <SectionHeader title="Role" onEdit={() => goToStep(1)} />
          <p className="mt-2 text-sm capitalize text-gray-900">{formData.role}</p>
        </Card>

        <Card className="p-4">
          <SectionHeader title="Profile Details" onEdit={() => goToStep(2)} />
          <dl className="mt-2 space-y-2">
            {isMusician ? (
              <>
                <Field label="Bio" value={formData.bio} />
                <Field label="Instruments" value={formData.instruments.join(", ")} />
                <Field label="Genres" value={formData.genres.join(", ")} />
              </>
            ) : (
              <>
                <Field label="Venue Name" value={formData.venueName} />
                <Field label="Description" value={formData.description} />
                <Field label="Address" value={formData.address} />
                <Field label="Type" value={formData.venueType} />
                {formData.capacity && <Field label="Capacity" value={formData.capacity} />}
              </>
            )}
          </dl>
        </Card>

        <Card className="p-4">
          <SectionHeader title="Social & Links" onEdit={() => goToStep(3)} />
          <dl className="mt-2 space-y-2">
            {isMusician ? (
              <>
                <Field label="Instagram" value={formData.instagram} />
                <Field label="Website" value={formData.website} />
              </>
            ) : (
              <>
                <Field label="Website" value={formData.website} />
                <Field label="Phone" value={formData.phone} />
              </>
            )}
            {!formData.instagram && !formData.website && !formData.phone && (
              <p className="text-sm italic text-gray-400">No social links added</p>
            )}
          </dl>
        </Card>

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => goToStep(3)}>
            Back
          </Button>
          <Button className="flex-1" onClick={onSubmit} disabled={loading}>
            {loading ? "Creating Profile..." : "Complete Setup"}
          </Button>
        </div>
      </div>
    </div>
  );
}
