import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const s = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const GridIcon = (p: P) => (
  <svg {...s(p)}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
export const UsersIcon = (p: P) => (
  <svg {...s(p)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8M21 20a6 6 0 0 0-4-5.6" />
  </svg>
);
export const ChatIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M21 12a8 8 0 0 1-8 8H6l-3 2 .9-3.6A8 8 0 1 1 21 12Z" />
    <path d="M8.5 11h7M8.5 14h4" />
  </svg>
);
export const BriefcaseIcon = (p: P) => (
  <svg {...s(p)}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
  </svg>
);
export const ReportIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M4 20V5a2 2 0 0 1 2-2h9l5 5v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <path d="M14 3v5h5M8 13v4M12 11v6M16 14v3" />
  </svg>
);
export const TemplateIcon = (p: P) => (
  <svg {...s(p)}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 7h8M8 11h8M8 15h5" />
  </svg>
);
export const SettingsIcon = (p: P) => (
  <svg {...s(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13a1.7 1.7 0 0 0 .34 1.88l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05a1.7 1.7 0 0 0-2.88 1.2V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.88.34l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 2.6 14a1.7 1.7 0 0 0-1.6-1.1H1a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 2.6 7a1.7 1.7 0 0 0-.34-1.88l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 7 2.6h.08A1.7 1.7 0 0 0 8 1V1a2 2 0 0 1 4 0v.1A1.7 1.7 0 0 0 14 2.6a1.7 1.7 0 0 0 1.88-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 21.4 9H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </svg>
);
export const SearchIcon = (p: P) => (
  <svg {...s(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const BellIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8Z" />
    <path d="M10.5 21a2 2 0 0 0 3 0" />
  </svg>
);
export const DownloadIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);
export const PlusIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const EyeIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const FlameIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M12 3c1 3-2 4-2 7a2 2 0 1 0 4 0c0-.5-.1-1-.3-1.4C15.5 10 17 12 17 14.5A5 5 0 0 1 7 14.5C7 10 11 8 12 3Z" />
  </svg>
);
export const ClockIcon = (p: P) => (
  <svg {...s(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const TargetIcon = (p: P) => (
  <svg {...s(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);
export const MailIcon = (p: P) => (
  <svg {...s(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const PhoneIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L19 13l2 5v3a1 1 0 0 1-1 1A16 16 0 0 1 4 6a1 1 0 0 1 1-2Z" />
  </svg>
);
export const MapPinIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
export const BuildingIcon = (p: P) => (
  <svg {...s(p)}>
    <rect x="4" y="3" width="16" height="18" rx="1.5" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
  </svg>
);
export const CalendarIcon = (p: P) => (
  <svg {...s(p)}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18M8 2v4M16 2v4" />
  </svg>
);
export const MessageIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M21 11.5a8 8 0 0 1-8 8 9 9 0 0 1-3.4-.7L3 21l1.3-4.2A8 8 0 1 1 21 11.5Z" />
  </svg>
);
export const SparkleIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" />
    <path d="M19 14l.6 1.6 1.6.6-1.6.6L19 19l-.6-1.6-1.6-.6 1.6-.6L19 14Z" />
  </svg>
);
export const CheckCircleIcon = (p: P) => (
  <svg {...s(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const CopyIcon = (p: P) => (
  <svg {...s(p)}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </svg>
);
export const RefreshIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M21 12a9 9 0 1 1-2.6-6.3M21 4v5h-5" />
  </svg>
);
export const MenuIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const ArrowUpIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
export const LogoutIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h12" />
  </svg>
);
export const ChevronDownIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const TrashIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
export const AlertTriangleIcon = (p: P) => (
  <svg {...s(p)}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);
