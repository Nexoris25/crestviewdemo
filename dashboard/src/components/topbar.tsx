"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui";
import { SearchIcon, BellIcon, MenuIcon, LogoutIcon, ChevronDownIcon } from "@/components/icons";
import { clearSession, getUser } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reads the signed-in user from localStorage (a client-only external store)
    // once after mount; intentionally a one-time sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getUser());
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const logout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-body hover:bg-canvas lg:hidden"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <label className="relative hidden max-w-md flex-1 items-center sm:flex">
        <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
        <span className="sr-only">Search</span>
        <input
          type="search"
          placeholder="Search for anything..."
          className="w-full rounded-lg border border-line bg-canvas py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange/20"
        />
      </label>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-body hover:bg-canvas"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-hot ring-2 ring-white" />
        </button>

        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-canvas"
          >
            <Avatar name={user?.name ?? "Admin"} size={36} />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold text-ink">{user?.name ?? "Admin"}</span>
              <span className="block text-xs text-muted">{user?.role ?? "Administrator"}</span>
            </span>
            <ChevronDownIcon className="hidden h-4 w-4 text-muted sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-lg">
              <div className="border-b border-line px-3 py-2">
                <p className="truncate text-sm font-medium text-ink">{user?.name ?? "Admin"}</p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-body hover:bg-canvas"
              >
                <LogoutIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
