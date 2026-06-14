"use client";

import { StatusBadge, ScoreText } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { EyeIcon } from "@/components/icons";
import type { LeadStatus } from "@/lib/types";

export interface LeadRow {
  id: string;
  fullName: string;
  company: string;
  service: string | null;
  score: number;
  status: LeadStatus;
  createdAt: string;
}

export function LeadsTable({ rows, onView }: { rows: LeadRow[]; onView: (id: string) => void }) {
  if (rows.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-muted">No leads yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Company</th>
            <th className="px-5 py-3 font-medium">Service Interest</th>
            <th className="px-5 py-3 font-medium">Submission Date</th>
            <th className="px-5 py-3 font-medium">Lead Score</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const d = formatDateTime(r.createdAt);
            return (
              <tr key={r.id} className="border-b border-line/70 last:border-0 hover:bg-canvas/60">
                <td className="px-5 py-3.5 font-medium text-ink">{r.fullName}</td>
                <td className="px-5 py-3.5 text-body">{r.company}</td>
                <td className="px-5 py-3.5 text-body">{r.service ?? "—"}</td>
                <td className="px-5 py-3.5 text-body">
                  {d.date}
                  <span className="block text-xs text-muted">{d.time}</span>
                </td>
                <td className="px-5 py-3.5">
                  <ScoreText score={r.score} />
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => onView(r.id)}
                    aria-label={`View ${r.fullName}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-orange"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
