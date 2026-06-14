"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { KpiCard, ServiceDonut, ScoreDistribution, ActivityFeed } from "@/components/overview-widgets";
import { LeadsTable } from "@/components/leads-table";
import { LeadDrawer } from "@/components/lead-drawer";
import { fetchStats } from "@/lib/api";
import type { Stats } from "@/lib/types";
import { UsersIcon, FlameIcon, ClockIcon, TargetIcon, DownloadIcon, PlusIcon } from "@/components/icons";

export default function OverviewPage() {
  return (
    <DashboardShell>
      <Overview />
    </DashboardShell>
  );
}

function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const load = useCallback(() => {
    fetchStats()
      .then((s) => {
        setStats(s);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const exportCsv = () => {
    if (!stats) return;
    const header = "Name,Company,Service,Score,Status,Date";
    const lines = stats.recentLeads.map((l) =>
      [l.fullName, l.company, l.service ?? "", l.score, l.status, new Date(l.createdAt).toISOString()]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crestview-recent-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Dashboard</h1>
          <p className="text-sm text-muted">Welcome back, Admin!</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-canvas"
          >
            <DownloadIcon className="h-4 w-4" />
            Export
          </button>
          <span
            title="Manual lead entry — coming soon"
            className="inline-flex cursor-default items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white"
          >
            <PlusIcon className="h-4 w-4" />
            New Lead
          </span>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-hot/10 px-4 py-3 text-sm text-hot">
          {error}. Is the backend running on port 3001?
        </p>
      )}

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total leads this month" kpi={stats?.kpis.totalLeads ?? empty} icon={UsersIcon} tint="#2f6df0" />
        <KpiCard label="Hot leads" kpi={stats?.kpis.hotLeads ?? empty} icon={FlameIcon} tint="#e0820c" />
        <KpiCard label="Average response time" kpi={stats?.kpis.avgResponse ?? empty} icon={ClockIcon} tint="#7b61ff" />
        <KpiCard label="Conversion rate" kpi={stats?.kpis.conversionRate ?? empty} icon={TargetIcon} tint="#2f9e6f" />
      </div>

      {/* Main grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0 rounded-xl border border-line bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-base font-semibold text-ink">Recent Leads</h2>
          </div>
          <LeadsTable rows={stats?.recentLeads ?? []} onView={setSelected} />
        </div>

        <div className="space-y-6">
          <ServiceDonut data={stats?.byService ?? []} total={stats?.totalLeads ?? 0} />
          <ScoreDistribution data={stats?.byStatus ?? []} />
          <ActivityFeed items={stats?.recentActivities ?? []} />
        </div>
      </div>

      <LeadDrawer
        leadId={selected}
        onClose={() => {
          setSelected(null);
          load(); // refresh in case status/email changed
        }}
      />
    </>
  );
}

const empty = { value: "—", changePct: null };
