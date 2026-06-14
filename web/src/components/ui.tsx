import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRightIcon } from "@/components/icons";

/** Page-width wrapper with responsive gutters (safe down to ~280px). */
export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "outline" | "ghost-light";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-orange text-white hover:bg-orange-dark focus-visible:outline-orange",
  outline:
    "border border-white/70 text-white hover:bg-white hover:text-navy focus-visible:outline-white",
  "ghost-light":
    "border border-line bg-white text-navy hover:border-navy/40 focus-visible:outline-navy",
};

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

/** Anchor styled as a button. */
export function ButtonLink({
  href,
  variant = "primary",
  withArrow = false,
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={`${BUTTON_BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {children}
      {withArrow && <ArrowRightIcon className="h-4 w-4" />}
    </Link>
  );
}

/** Native button styled identically (for forms / interactive widgets). */
export function Button({
  variant = "primary",
  withArrow = false,
  className = "",
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  withArrow?: boolean;
} & ComponentProps<"button">) {
  return (
    <button className={`${BUTTON_BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {children}
      {withArrow && <ArrowRightIcon className="h-4 w-4" />}
    </button>
  );
}

/** Section eyebrow + heading block, centered by default. */
export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  tone = "dark",
  className = "",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left"} ${className}`}
    >
      <p className="eyebrow text-orange">{eyebrow}</p>
      <h2
        className={`mt-3 text-2xl sm:text-3xl md:text-[2.5rem] ${
          tone === "light" ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

/** Wordmark used in the header and footer. */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "light" ? "text-white" : "text-white";
  return (
    <Link href="/" className="inline-flex items-center gap-2" aria-label={`CrestView — home`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden focusable="false">
        <path
          d="M16 3 5 27h22L16 3Z"
          fill="none"
          stroke="var(--color-orange)"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M16 12 11 23h10L16 12Z" fill="var(--color-orange)" />
      </svg>
      <span className={`flex flex-col leading-none ${text}`}>
        <span className="font-serif text-lg font-semibold tracking-wide">CRESTVIEW</span>
        <span className="text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-orange">
          Group
        </span>
      </span>
    </Link>
  );
}
