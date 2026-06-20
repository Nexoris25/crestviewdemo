/**
 * Client for the CrestView NestJS backend.
 *
 * - The API base URL comes only from NEXT_PUBLIC_API_URL (no hard-coded hosts).
 * - Requests are retried on transient network / gateway failures, so a brief
 *   backend hiccup or a dropped idle keep-alive connection recovers
 *   automatically instead of failing silently.
 */

function apiBase(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }
  return url;
}

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

// Statuses where the request did not get processed by the app, so a retry is safe.
const RETRYABLE_STATUSES = new Set([408, 425, 429, 502, 503, 504]);
const MAX_ATTEMPTS = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function postJson<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${apiBase()}${path}`, init);
      if (res.ok) return (await res.json()) as T;
      if (RETRYABLE_STATUSES.has(res.status) && attempt < MAX_ATTEMPTS) {
        await sleep(attempt * 400);
        continue;
      }
      throw new Error(`Request failed: ${res.status}`);
    } catch (err) {
      lastError = err;
      // A network error (e.g. a stale/dropped connection) means the request
      // never reached the server, so retrying it is safe.
      if (err instanceof TypeError && attempt < MAX_ATTEMPTS) {
        await sleep(attempt * 400);
        continue;
      }
      throw err;
    }
  }
  throw lastError ?? new Error("Request failed");
}

/**
 * Submits the contact form. Throws on failure (after retries) so the caller can
 * show a real error instead of a false "sent".
 */
export async function submitLead(input: LeadInput): Promise<{ id: string }> {
  return postJson<{ id: string }>("/leads", input);
}

export async function askAssistant(messages: ChatTurn[]): Promise<AssistantReply> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    return await postJson<AssistantReply>("/assistant/chat", { messages }, controller.signal);
  } catch {
    // After retries the assistant is genuinely unreachable. Be honest rather
    // than guessing a (possibly wrong) service recommendation.
    return {
      reply:
        "I'm having trouble connecting right now. Please try again in a moment, or reach our team directly at info@crestviewgroup.com or +123 - 777 - 222 - 7272.",
    };
  } finally {
    clearTimeout(timeout);
  }
}
