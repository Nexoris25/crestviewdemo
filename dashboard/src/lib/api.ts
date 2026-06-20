import { getToken, clearSession } from "./auth";
import type { AuthUser, Lead, Stats } from "./types";

/** The API base URL comes only from NEXT_PUBLIC_API_URL (no hard-coded hosts). */
function apiBase(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }
  return url;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

// Statuses where the request did not get processed by the app, so a retry is safe.
const RETRYABLE_STATUSES = new Set([408, 425, 429, 502, 503, 504]);
const MAX_ATTEMPTS = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const fullInit: RequestInit = {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let res: Response;
    try {
      res = await fetch(`${apiBase()}${path}`, fullInit);
    } catch (err) {
      // Network error (e.g. a stale/dropped connection): the request never
      // reached the server, so retry it before giving up.
      lastError = err;
      if (err instanceof TypeError && attempt < MAX_ATTEMPTS) {
        await sleep(attempt * 400);
        continue;
      }
      throw err;
    }

    if (res.status === 401) {
      let message = "Your session has expired. Please sign in again.";
      try {
        const body = await res.json();
        if (body?.message) message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
      } catch {
        /* ignore */
      }
      // A 401 from the login endpoint means bad credentials — just surface the
      // message. From any other (protected) endpoint it means the token is
      // missing/expired, so drop the session and bounce to login.
      if (!path.startsWith("/auth/")) {
        clearSession();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
      throw new ApiError(message, 401);
    }

    if (RETRYABLE_STATUSES.has(res.status) && attempt < MAX_ATTEMPTS) {
      await sleep(attempt * 400);
      continue;
    }

    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const body = await res.json();
        if (body?.message) message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
      } catch {
        /* ignore */
      }
      throw new ApiError(message, res.status);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }
  throw lastError ?? new ApiError("Request failed", 0);
}

export async function login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  return request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function fetchStats(): Promise<Stats> {
  return request("/dashboard/stats");
}

export async function fetchLeads(params: { status?: string; service?: string; search?: string } = {}): Promise<Lead[]> {
  const qs = new URLSearchParams();
  if (params.status && params.status !== "All") qs.set("status", params.status);
  if (params.service) qs.set("service", params.service);
  if (params.search) qs.set("search", params.search);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return request(`/leads${suffix}`);
}

export async function fetchLead(id: string): Promise<Lead> {
  return request(`/leads/${id}`);
}

export async function regenerateEmail(id: string): Promise<{ subject: string; body: string }> {
  return request(`/leads/${id}/regenerate-email`, { method: "POST" });
}

export async function updateLeadStatus(id: string, status: string): Promise<Lead> {
  return request(`/leads/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export async function deleteLead(id: string): Promise<{ id: string; deleted: true }> {
  return request(`/leads/${id}`, { method: "DELETE" });
}

export { ApiError };
