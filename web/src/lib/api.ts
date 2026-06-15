/**
 * Thin client for the CrestView NestJS backend.
 *
 * The API base resolves at runtime so a single build/.env works both locally
 * and in production:
 *   1. NEXT_PUBLIC_API_URL, if set (build-time override);
 *   2. otherwise localhost when running on localhost (local dev);
 *   3. otherwise the deployed production API.
 */
const PROD_API_URL = "https://cv-api.nexoristech.com/api";

function apiBase(): string {
  const override = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (override) return override;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") {
      return "http://localhost:3001/api";
    }
  }
  return PROD_API_URL;
}

export const API_BASE = apiBase();

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantReply {
  reply: string;
  suggestedService?: string;
  reason?: string;
}

export interface LeadInput {
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  consent: boolean;
}

async function postJson<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

/**
 * Submits the contact form. Throws on failure so the caller can show a real
 * error instead of a false "sent" — otherwise leads silently never arrive.
 */
export async function submitLead(input: LeadInput): Promise<{ id: string }> {
  return postJson<{ id: string }>("/leads", input);
}

export async function askAssistant(messages: ChatTurn[]): Promise<AssistantReply> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    return await postJson<AssistantReply>("/assistant/chat", { messages }, controller.signal);
  } catch {
    return localAssistantReply(messages.at(-1)?.content ?? "");
  } finally {
    clearTimeout(timeout);
  }
}

/* Offline fallback: keyword → service mapping (mirrors the backend heuristic). */
const KEYWORDS: { match: RegExp; service: string; reason: string }[] = [
  {
    match: /market|expand|new region|country|scale|grow customer|customers/i,
    service: "Market Entry & Growth",
    reason: "We help you enter new markets with local intelligence and a clear growth plan.",
  },
  {
    match: /process|operation|efficien|workflow|deadline|productiv|cost|approval/i,
    service: "Operations & Process Improvement",
    reason: "We identify bottlenecks and build efficient, scalable processes.",
  },
  {
    match: /financ|cash|budget|forecast|invest|profit|revenue/i,
    service: "Financial Advisory & Planning",
    reason: "We strengthen your financial foundation and plan for long-term value.",
  },
];

export function localAssistantReply(text: string): AssistantReply {
  const hit = KEYWORDS.find((k) => k.match.test(text));
  const { service, reason } = hit ?? {
    service: "Business Strategy & Advisory",
    reason: "We help you develop a confident strategy that drives sustainable growth.",
  };
  return {
    reply: "Thanks for sharing — based on what you described, here's where we can help most:",
    suggestedService: service,
    reason,
  };
}
