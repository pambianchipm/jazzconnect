"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { StepRoleSelection } from "./components/StepRoleSelection";
import { StepBasicInfo } from "./components/StepBasicInfo";
import { StepSocialLinks } from "./components/StepSocialLinks";
import { StepReview } from "./components/StepReview";
import { OnboardingFormData, initialFormData } from "./types";
import {
  step1Schema,
  step2MusicianSchema,
  step2VenueSchema,
  step3MusicianSchema,
  step3VenueSchema,
} from "./schemas";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.onboarded) {
      router.replace("/dashboard");
    }
  }, [session?.user?.onboarded, router]);

  if (status === "loading" || session?.user?.onboarded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-jazz-600" />
      </div>
    );
  }

  const onChange = (updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    let result;

    switch (step) {
      case 1:
        result = step1Schema.safeParse({ role: formData.role });
        break;
      case 2:
        result =
          formData.role === "musician"
            ? step2MusicianSchema.safeParse(formData)
            : step2VenueSchema.safeParse(formData);
        break;
      case 3:
        result =
          formData.role === "musician"
            ? step3MusicianSchema.safeParse(formData)
            : step3VenueSchema.safeParse(formData);
        break;
      default:
        return true;
    }

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const goToStep = (step: number) => {
    setErrors({});
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");

    try {
      const body: Record<string, unknown> = { role: formData.role };

      if (formData.role === "musician") {
        body.bio = formData.bio;
        body.instruments = formData.instruments.join(", ");
        body.genres = formData.genres.join(", ");
        body.instagram = formData.instagram.replace(/^@/, "");
        body.website = formData.website;
      } else {
        body.venueName = formData.venueName;
        body.description = formData.description;
        body.address = formData.address;
        body.venueType = formData.venueType;
        body.capacity = parseInt(formData.capacity) || 0;
        body.website = formData.website;
        body.phone = formData.phone;
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
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Welcome to JazzConnect!</h1>
      </div>

      <ProgressIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <StepRoleSelection
          formData={formData}
          onChange={onChange}
          onNext={handleNext}
          error={errors.role}
        />
      )}

      {currentStep === 2 && (
        <StepBasicInfo
          formData={formData}
          onChange={onChange}
          errors={errors}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 3 && (
        <StepSocialLinks
          formData={formData}
          onChange={onChange}
          errors={errors}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 4 && (
        <StepReview
          formData={formData}
          goToStep={goToStep}
          onSubmit={handleSubmit}
          loading={loading}
          error={submitError}
        />
      )}
    </div>
  );
}
