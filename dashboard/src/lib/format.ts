import type { LeadStatus } from "./types";

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export const STATUS_META: Record<LeadStatus, { dot: string; text: string; chip: string }> = {
  Hot: { dot: "bg-hot", text: "text-hot", chip: "bg-hot/10 text-hot" },
  Warm: { dot: "bg-warm", text: "text-warm", chip: "bg-warm/10 text-warm" },
  Cold: { dot: "bg-cold", text: "text-cold", chip: "bg-cold/10 text-cold" },
  New: { dot: "bg-muted", text: "text-muted", chip: "bg-muted/10 text-muted" },
};

/** Donut/legend colours for the four services (Figma palette). */
export const SERVICE_COLORS: Record<string, string> = {
  "Operations & Process Improvement": "#2f6df0",
  "Market Entry & Growth": "#e0a417",
  "Business Strategy & Advisory": "#2f9e6f",
  "Financial Advisory & Planning": "#7b61ff",
};

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
