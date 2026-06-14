"use client";

import type { ComponentType, SVGProps } from "react";
import { relativeTime, SERVICE_COLORS } from "@/lib/format";
import type { Activity, Distribution, Kpi } from "@/lib/types";
import { ArrowUpIcon, SparkleIcon, UsersIcon, RefreshIcon, FlameIcon } from "@/components/icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export function KpiCard({
  label,
  kpi,
  icon: Icon,
  tint,
}: {
  label: string;
  kpi: Kpi;
  icon: Icon;
  tint: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-ink">{kpi.value}</p>
        </div>
        <span
          className="inline-flex h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: `${tint}1a`, color: tint }}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {kpi.changePct !== null ? (
        <p className="mt-3 flex items-center gap-1 text-xs">
          <span className={`inline-flex items-center gap-0.5 font-medium ${kpi.changePct >= 0 ? "text-cold" : "text-hot"}`}>
            <ArrowUpIcon className={`h-3 w-3 ${kpi.changePct < 0 ? "rotate-180" : ""}`} />
            {Math.abs(kpi.changePct)}%
          </span>
          <span className="text-muted">vs last month</span>
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted">Updated live</p>
      )}
    </div>
  );
}

export function ServiceDonut({ data, total }: { data: Distribution[]; total: number }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const visible = data.filter((d) => d.count > 0);
  const segments = visible.map((d, i) => {
    const frac = d.count / (total || 1);
    // Offset = sum of all preceding segment lengths (no render-scope mutation).
    const offset = visible
      .slice(0, i)
      .reduce((sum, p) => sum + (p.count / (total || 1)) * circ, 0);
    return {
      color: SERVICE_COLORS[d.label] ?? "#94a3b8",
      dash: frac * circ,
      offset,
      label: d.label,
    };
  });

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h3 className="text-base font-semibold text-ink">Leads by Service Interest</h3>
      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 140 140" className="-rotate-90">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#eef0f4" strokeWidth="16" />
            {segments.map((s) => (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth="16"
                strokeDasharray={`${s.dash} ${circ - s.dash}`}
                strokeDashoffset={-s.offset}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-2xl font-semibold text-ink">{total}</span>
            <span className="text-xs text-muted">Leads</span>
          </div>
        </div>

        <ul className="w-full space-y-2.5">
          {data.map((d) => (
            <li key={d.label} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: SERVICE_COLORS[d.label] ?? "#94a3b8" }}
              />
              <span className="min-w-0 flex-1 truncate text-body">{d.label}</span>
              <span className="font-medium text-ink">{d.pct}%</span>
              <span className="w-8 text-right text-muted">({d.count})</span>
            </li>
          ))}
          <li className="flex items-center gap-2 border-t border-line pt-2.5 text-sm font-semibold text-ink">
            <span className="flex-1">Total</span>
            <span>{total}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function ScoreDistribution({ data }: { data: Distribution[] }) {
  const by = (label: string) => data.find((d) => d.label === label) ?? { count: 0, pct: 0, label };
  const hot = by("Hot");
  const warm = by("Warm");
  const cold = by("Cold");

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h3 className="text-base font-semibold text-ink">Lead Score Distribution</h3>
      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-canvas">
        <span className="bg-hot" style={{ width: `${hot.pct}%` }} />
        <span className="bg-warm" style={{ width: `${warm.pct}%` }} />
        <span className="bg-cold" style={{ width: `${cold.pct}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-3 text-center">
        <Bucket label="Hot" count={hot.count} pct={hot.pct} tone="text-hot" />
        <Bucket label="Warm" count={warm.count} pct={warm.pct} tone="text-warm" />
        <Bucket label="Cold" count={cold.count} pct={cold.pct} tone="text-cold" />
      </div>
    </div>
  );
}

function Bucket({ label, count, pct, tone }: { label: string; count: number; pct: number; tone: string }) {
  return (
    <div>
      <p className={`text-xs font-medium ${tone}`}>{label}</p>
      <p className="mt-1 font-serif text-xl font-semibold text-ink">{count}</p>
      <p className="text-xs text-muted">{pct}%</p>
    </div>
  );
}

const ACTIVITY_ICON: Record<string, Icon> = {
  lead_submitted: UsersIcon,
  email_generated: SparkleIcon,
  status_updated: FlameIcon,
  ai_analysis: SparkleIcon,
};

export function ActivityFeed({ items }: { items: Activity[] }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h3 className="text-base font-semibold text-ink">Recent activities</h3>
      <ul className="mt-4 space-y-4">
        {items.map((a) => {
          const Icon = ACTIVITY_ICON[a.type] ?? RefreshIcon;
          return (
            <li key={a.id} className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-ink">{a.message}</p>
                <p className="text-xs text-muted">{relativeTime(a.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
