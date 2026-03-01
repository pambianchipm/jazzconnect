import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "reunion" | "warmth" | "coral" | "green";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gray-100 text-gray-700": variant === "default",
          "bg-reunion-100 text-reunion-700": variant === "reunion",
          "bg-warmth-100 text-warmth-700": variant === "warmth",
          "bg-coral-100 text-coral-700": variant === "coral",
          "bg-green-100 text-green-700": variant === "green",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
