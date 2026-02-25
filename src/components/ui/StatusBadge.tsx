import { Badge } from "./Badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant =
    status === "accepted"
      ? "green"
      : status === "declined"
        ? "red"
        : status === "open"
          ? "jazz"
          : status === "filled"
            ? "gold"
            : status === "cancelled"
              ? "red"
              : "default";

  return <Badge variant={variant}>{status}</Badge>;
}
