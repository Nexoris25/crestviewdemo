import type { LeadStatus } from "@/lib/types";
import { STATUS_META, initials } from "@/lib/format";

export function BrandLogo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const text = tone === "light" ? "text-white" : "text-ink";
  const sub = "text-orange";
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
        <path d="M16 3 5 27h22L16 3Z" fill="none" stroke="var(--color-orange)" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M16 12 11 23h10L16 12Z" fill="var(--color-orange)" />
      </svg>
      <span className={`flex flex-col leading-none ${text}`}>
        <span className="font-serif text-base font-semibold tracking-wide">CRESTVIEW</span>
        <span className={`text-[0.5rem] font-semibold uppercase tracking-[0.35em] ${sub}`}>Group</span>
      </span>
    </span>
  );
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {status}
    </span>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-navy text-xs font-semibold text-white"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

export function ScoreText({ score }: { score: number }) {
  const color = score >= 75 ? "text-hot" : score >= 45 ? "text-warm" : "text-cold";
  return <span className={`font-semibold ${color}`}>{score}%</span>;
}
