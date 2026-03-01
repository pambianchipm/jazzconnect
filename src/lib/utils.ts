import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    meal: "bg-warmth-100 text-warmth-800",
    game: "bg-coral-100 text-coral-800",
    outing: "bg-blue-100 text-blue-800",
    ceremony: "bg-purple-100 text-purple-800",
    "free-time": "bg-gray-100 text-gray-800",
    general: "bg-reunion-100 text-reunion-800",
  };
  return colors[category] || colors.general;
}

export function getPlaceLabel(place: number): string {
  if (place === 1) return "1st Place";
  if (place === 2) return "2nd Place";
  if (place === 3) return "3rd Place";
  return `${place}th Place`;
}
