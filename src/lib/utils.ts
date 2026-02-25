import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function parseCommaSeparated(value: string): string[] {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export function toCommaSeparated(values: string[]): string {
  return values.filter(Boolean).join(", ");
}

export function formatPay(min: number, max: number): string {
  if (min === 0 && max === 0) return "TBD";
  if (min === max) return `$${min}`;
  return `$${min}–$${max}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
