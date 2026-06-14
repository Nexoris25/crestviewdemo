export type LeadStatus = "Hot" | "Warm" | "Cold" | "New";

export interface EmailDraft {
  subject: string;
  body: string;
}

export interface Lead {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string | null;
  location: string | null;
  service: string | null;
  message: string;
  source: string;
  status: LeadStatus;
  score: number;
  summary: string | null;
  reasons: string[];
  toneSignals: string[];
  nextStep: string | null;
  email_draft: EmailDraft | null;
  aiPowered: boolean;
  createdAt: string;
}

export interface RecentLead {
  id: string;
  fullName: string;
  company: string;
  service: string | null;
  score: number;
  status: LeadStatus;
  createdAt: string;
}

export interface Kpi {
  value: number | string;
  changePct: number | null;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

export interface Distribution {
  label: string;
  count: number;
  pct: number;
}

export interface Stats {
  kpis: {
    totalLeads: Kpi;
    hotLeads: Kpi;
    avgResponse: Kpi;
    conversionRate: Kpi;
  };
  totalLeads: number;
  byStatus: Distribution[];
  byService: Distribution[];
  recentLeads: RecentLead[];
  recentActivities: Activity[];
}

export interface AuthUser {
  name: string;
  email: string;
  role: string;
}
