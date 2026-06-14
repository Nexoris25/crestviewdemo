"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui";
import {
  GridIcon,
  UsersIcon,
  ChatIcon,
  BriefcaseIcon,
  ReportIcon,
  TemplateIcon,
  SettingsIcon,
  CloseIcon,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  enabled: boolean;
}

const NAV: NavItem[] = [
  { label: "Overview", href: "/", icon: GridIcon, enabled: true },
  { label: "Leads", href: "/leads", icon: UsersIcon, enabled: true },
  { label: "Conversation", href: "#", icon: ChatIcon, enabled: false },
  { label: "Services", href: "#", icon: BriefcaseIcon, enabled: false },
  { label: "Report", href: "#", icon: ReportIcon, enabled: false },
  { label: "Templates", href: "#", icon: TemplateIcon, enabled: false },
  { label: "Settings", href: "#", icon: SettingsIcon, enabled: false },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-navy-deep text-white">
      <div className="flex items-center justify-between px-5 py-5">
        <BrandLogo tone="light" />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 lg:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Dashboard">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href) && item.href !== "#";
          const Icon = item.icon;
          const base =
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";

          if (!item.enabled) {
            return (
              <span
                key={item.label}
                className={`${base} cursor-not-allowed text-white/35`}
                title="Coming soon"
              >
                <Icon className="h-5 w-5" />
                {item.label}
                <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-white/50">
                  Soon
                </span>
              </span>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={`${base} ${
                active
                  ? "bg-white/10 text-orange ring-1 ring-orange/40"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-5 text-xs text-white/40">CrestView Admin · v1.0</div>
    </div>
  );
}
