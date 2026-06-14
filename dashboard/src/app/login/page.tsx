"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui";
import { login } from "@/lib/api";
import { setSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@crestviewgroup.com");
  const [password, setPassword] = useState("crestview123");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { token, user } = await login(email, password);
      setSession(token, user);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-deep p-12 text-white lg:flex">
        <BrandLogo tone="light" />
        <div>
          <h1 className="font-serif text-4xl leading-tight text-white">
            Turn every enquiry into an opportunity.
          </h1>
          <p className="mt-4 max-w-md text-white/70">
            CrestView Admin gives your team AI-scored leads, instant summaries and ready-to-send
            follow-ups — all in one place.
          </p>
        </div>
        <p className="text-sm text-white/40">© 2026 Crestview Group</p>
        <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <BrandLogo tone="dark" />
          </div>
          <h2 className="mt-8 font-serif text-2xl text-ink lg:mt-0">Sign in to your dashboard</h2>
          <p className="mt-1 text-sm text-body">Welcome back. Please enter your details.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-hot/10 px-3 py-2 text-sm text-hot" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-orange px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-dark disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 rounded-lg bg-canvas px-3 py-2.5 text-xs text-muted">
            Demo credentials are pre-filled. Configure real ones via <code>ADMIN_EMAIL</code> /{" "}
            <code>ADMIN_PASSWORD</code> in the backend.
          </p>
        </div>
      </div>
    </div>
  );
}
