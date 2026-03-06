import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Role" },
  { label: "Profile" },
  { label: "Links" },
  { label: "Review" },
];

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-8 flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isCompleted && "bg-jazz-600 text-white",
                  isActive && "bg-jazz-600 text-white ring-2 ring-jazz-300 ring-offset-2",
                  !isActive && !isCompleted && "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={cn(
                  "mt-1 text-xs",
                  isActive || isCompleted ? "font-medium text-jazz-700" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 mb-5 h-0.5 w-10 sm:w-16",
                  stepNum < currentStep ? "bg-jazz-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
