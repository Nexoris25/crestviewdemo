import { getToken, clearSession } from "./auth";
import type { AuthUser, Lead, Stats } from "./types";

/**
 * Resolves the API base at runtime so one build/.env works everywhere:
 *   1. NEXT_PUBLIC_API_URL override, if set;
 *   2. localhost when running on localhost (local dev);
 *   3. the deployed production API otherwise.
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

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 401) {
    // Token missing/expired — drop the session and bounce to login.
    clearSession();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new ApiError("Unauthorized", 401);
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
