"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { LeadsTable } from "@/components/leads-table";
import { LeadDrawer } from "@/components/lead-drawer";
import { fetchLeads } from "@/lib/api";
import type { Lead } from "@/lib/types";
import { SearchIcon } from "@/components/icons";

const FILTERS = ["All", "Hot", "Warm", "Cold"] as const;

export default function LeadsPage() {
  return (
    <DashboardShell>
      <Leads />
    </DashboardShell>
  );
}

function Leads() {
  const [status, setStatus] = useState<(typeof FILTERS)[number]>("All");
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const load = useCallback(() => {
    fetchLeads({ status, search })
      .then((l) => {
        setLeads(l);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [status, search]);

  useEffect(() => {
    const t = setTimeout(load, 250); // light debounce for search
    return () => clearTimeout(t);
  }, [load]);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl text-ink">Leads</h1>
        <p className="text-sm text-muted">All inbound enquiries, scored and qualified by AI.</p>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatus(f)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  status === f ? "bg-navy text-white" : "text-body hover:bg-canvas"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <label className="relative flex items-center">
            <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
            <span className="sr-only">Search leads</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company, email"
              className="w-full rounded-lg border border-line bg-canvas py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange/20 sm:w-72"
            />
          </label>
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center text-sm text-hot">
            <span>We couldn&apos;t load your leads. Please confirm the backend service is up and running.</span>
            <button
              type="button"
              onClick={() => {
                setError(null);
                load();
              }}
              className="inline-flex items-center gap-2 rounded-md bg-hot px-3 py-1.5 text-xs font-semibold text-white hover:bg-hot/90"
            >
              Retry
            </button>
          </div>
        ) : (
          <LeadsTable rows={leads} onView={setSelected} />
        )}
      </div>

      <LeadDrawer
        leadId={selected}
        onClose={() => {
          setSelected(null);
          load();
        }}
      />
    </>
  );
}
