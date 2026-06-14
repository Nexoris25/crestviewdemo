export interface LeadAnalysisInput {
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export type LeadStatus = 'Hot' | 'Warm' | 'Cold';

export interface LeadEmail {
  subject: string;
  body: string;
}

export interface LeadAnalysis {
  summary: string;
  score: number; // 0 - 100
  status: LeadStatus;
  reasons: string[];
  toneSignals: string[];
  nextStep: string;
  email: LeadEmail;
  aiPowered: boolean;
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResult {
  reply: string;
  suggestedService?: string;
  reason?: string;
}

export const SERVICES = [
  'Business Strategy & Advisory',
  'Operations & Process Improvement',
  'Market Entry & Growth',
  'Financial Advisory & Planning',
] as const;

export function statusFromScore(score: number): LeadStatus {
  if (score >= 75) return 'Hot';
  if (score >= 45) return 'Warm';
  return 'Cold';
}
