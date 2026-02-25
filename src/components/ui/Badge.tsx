import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "jazz" | "gold" | "green" | "red";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gray-100 text-gray-700": variant === "default",
          "bg-jazz-100 text-jazz-700": variant === "jazz",
          "bg-gold-100 text-gold-700": variant === "gold",
          "bg-green-100 text-green-700": variant === "green",
          "bg-red-100 text-red-700": variant === "red",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
