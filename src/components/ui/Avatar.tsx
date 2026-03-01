import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
  };

  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? "Avatar"}
        width={size === "lg" ? 64 : size === "md" ? 40 : 32}
        height={size === "lg" ? 64 : size === "md" ? 40 : 32}
        className={cn("rounded-full object-cover", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-reunion-100 font-medium text-reunion-700",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name ?? "?")}
    </div>
  );
}
