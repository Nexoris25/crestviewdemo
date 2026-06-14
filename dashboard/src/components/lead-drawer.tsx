"use client";

import { useEffect, useState } from "react";
import { fetchLead, regenerateEmail, deleteLead } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { Lead } from "@/lib/types";
import {
  CloseIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  MessageIcon,
  SparkleIcon,
  FlameIcon,
  CheckCircleIcon,
  RefreshIcon,
  CopyIcon,
  TrashIcon,
} from "@/components/icons";

const TONE_COLOR: Record<string, string> = {
  Urgent: "bg-hot/10 text-hot",
  "Growth Focused": "bg-cold/10 text-cold",
  "Goal Oriented": "bg-[#2f6df0]/10 text-[#2f6df0]",
  "Cost Conscious": "bg-warm/10 text-warm",
  Exploratory: "bg-muted/10 text-muted",
};

export function LeadDrawer({ leadId, onClose }: { leadId: string | null; onClose: () => void }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!leadId) return;
    // Reset to the loading state for the newly-selected lead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLead(null);
    setLoading(true);
    fetchLead(leadId)
      .then(setLead)
      .catch(() => setLead(null))
      .finally(() => setLoading(false));
  }, [leadId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (leadId) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leadId, onClose]);

  const onRegenerate = async () => {
    if (!lead) return;
    setRegenerating(true);
    try {
      const email = await regenerateEmail(lead.id);
      setLead({ ...lead, email_draft: email });
    } catch {
      /* keep existing */
    } finally {
      setRegenerating(false);
    }
  };

  const confirmDelete = async () => {
    if (!lead) return;
    setDeleting(true);
    try {
      await deleteLead(lead.id);
      setConfirmOpen(false);
      onClose(); // parent closes the drawer and refreshes the list
    } catch {
      setDeleting(false);
    }
  };

  const onCopy = async () => {
    if (!lead?.email_draft) return;
    await navigator.clipboard.writeText(
      `Subject: ${lead.email_draft.subject}\n\n${lead.email_draft.body}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!leadId) return null;
  const submitted = lead ? formatDateTime(lead.createdAt) : null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-navy-deep/40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-label="Lead details"
        aria-modal="true"
        className="absolute inset-y-0 right-0 flex w-full max-w-[640px] flex-col bg-white shadow-2xl"
      >
        {loading || !lead ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted">
            {loading ? "Loading lead…" : "Lead not found"}
            <button onClick={onClose} className="absolute right-4 top-4 text-muted hover:text-ink">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-line px-6 py-5">
              <div>
                <h2 className="font-serif text-xl text-ink">{lead.fullName}</h2>
                <p className="text-sm text-muted">{lead.company}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-hot/10 px-2.5 py-1 text-xs font-semibold text-hot">
                  <FlameIcon className="h-3.5 w-3.5" />
                  {lead.status} Deal
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-hot text-white hover:bg-hot/90"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {/* Contact + submission */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card title="Contact Details">
                  <Detail icon={<MailIcon className="h-4 w-4" />}>{lead.email}</Detail>
                  {lead.phone && <Detail icon={<PhoneIcon className="h-4 w-4" />}>{lead.phone}</Detail>}
                  <Detail icon={<BuildingIcon className="h-4 w-4" />}>{lead.company}</Detail>
                  {lead.location && <Detail icon={<MapPinIcon className="h-4 w-4" />}>{lead.location}</Detail>}
                </Card>
                <Card title="Submission Date">
                  <Detail icon={<CalendarIcon className="h-4 w-4" />}>
                    {submitted?.date}
                    <span className="block text-xs text-muted">{submitted?.time}</span>
                  </Detail>
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-ink">
                    <BriefcaseIcon className="h-4 w-4 text-muted" />
                    Service Interest
                  </p>
                  <p className="pl-6 text-sm text-body">{lead.service ?? "Not specified"}</p>
                </Card>
              </div>

              {/* Original challenge */}
              <Card title="Original Challenges" icon={<MessageIcon className="h-4 w-4 text-muted" />}>
                <p className="text-sm leading-relaxed text-body">{lead.message}</p>
              </Card>

              {/* AI insights */}
              <div className="rounded-xl bg-navy-deep p-5 text-white">
                <p className="flex items-center gap-2 text-sm font-semibold text-orange">
                  <SparkleIcon className="h-4 w-4" />
                  AI Insights
                  {!lead.aiPowered && (
                    <span className="ml-auto rounded bg-white/10 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-white/50">
                      Heuristic
                    </span>
                  )}
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1.5fr_1fr]">
                  <div className="rounded-lg bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/60">AI Summary</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">{lead.summary}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Lead score</p>
                    <p className="mt-2 flex items-center gap-1.5 font-serif text-lg text-hot">
                      <FlameIcon className="h-5 w-5" />
                      {lead.status} Deal
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {lead.score}
                      <span className="text-base text-white/50"> / 100</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Why this score</p>
                    <ul className="mt-2 space-y-2">
                      {lead.reasons.map((r) => (
                        <li key={r} className="flex items-center gap-2 text-sm text-white/85">
                          <CheckCircleIcon className="h-4 w-4 shrink-0 text-cold" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Tone signals</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lead.toneSignals.map((t) => (
                        <span
                          key={t}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${TONE_COLOR[t] ?? "bg-white/10 text-white/80"}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Next step */}
              <Card title="Recommended Next Step" icon={<MessageIcon className="h-4 w-4 text-muted" />}>
                <p className="text-sm leading-relaxed text-body">{lead.nextStep}</p>
              </Card>

              {/* Email draft */}
              {lead.email_draft && (
                <Card title="AI Follow-up Email (Draft)" icon={<MailIcon className="h-4 w-4 text-muted" />}>
                  <p className="text-sm font-medium text-ink">Subject: {lead.email_draft.subject}</p>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-body">
                    {lead.email_draft.body}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={onRegenerate}
                      disabled={regenerating}
                      className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-soft disabled:opacity-60"
                    >
                      <RefreshIcon className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
                      {regenerating ? "Regenerating…" : "Regenerate Email"}
                    </button>
                    <button
                      onClick={onCopy}
                      className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-canvas"
                    >
                      <CopyIcon className="h-4 w-4" />
                      {copied ? "Copied!" : "Copy Email"}
                    </button>
                  </div>
                </Card>
              )}

              {/* Danger zone — remove test data for a clean demo session */}
              <div className="flex flex-col gap-3 rounded-xl border border-hot/30 bg-hot/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Delete this lead</p>
                  <p className="text-xs text-muted">Permanently removes the lead and its activity. Cannot be undone.</p>
                </div>
                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={deleting}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-hot px-4 py-2.5 text-sm font-semibold text-white hover:bg-hot/90 disabled:opacity-60"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete lead
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        busy={deleting}
        title="Delete this lead?"
        message={
          lead
            ? `"${lead.fullName}" from ${lead.company} will be permanently removed, along with its activity. This cannot be undone.`
            : "This lead will be permanently removed. This cannot be undone."
        }
        confirmLabel="Delete lead"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        {icon}
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Detail({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="mt-2 flex items-start gap-2 text-sm text-body first:mt-0">
      <span className="mt-0.5 text-muted">{icon}</span>
      <span className="min-w-0 break-words">{children}</span>
    </p>
  );
}
