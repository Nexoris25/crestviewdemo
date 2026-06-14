import Link from "next/link";
import { Container } from "@/components/ui";
import { SITE, CONTACT, NAV, SOCIALS } from "@/lib/site";
import {
  LinkedinIcon,
  MailIcon,
  XIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons";

const SOCIAL_ICONS = { linkedin: LinkedinIcon, mail: MailIcon, x: XIcon };

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-white/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr] lg:gap-12">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2" aria-label="CrestView — home">
            <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden focusable="false">
              <path
                d="M16 3 5 27h22L16 3Z"
                fill="none"
                stroke="var(--color-orange)"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path d="M16 12 11 23h10L16 12Z" fill="var(--color-orange)" />
            </svg>
            <span className="flex flex-col leading-none text-white">
              <span className="font-serif text-base font-semibold tracking-wide">CRESTVIEW</span>
              <span className="text-[0.5rem] font-semibold uppercase tracking-[0.35em] text-orange">
                Group
              </span>
            </span>
          </Link>

          <p className="mt-6 font-serif text-lg text-white">{SITE.tagline}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            {SITE.footerBlurb}
          </p>

          <ul className="mt-6 flex flex-wrap gap-3">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer">
          <h2 className="font-serif text-lg text-white">Quick Links</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/75 underline-offset-4 transition-colors hover:text-orange hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact info */}
        <div>
          <h2 className="font-serif text-lg text-white">Contact Info</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
              <span className="text-white/75">{CONTACT.address.full}</span>
            </li>
            <li className="flex items-start gap-3">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
              <a href={`tel:${CONTACT.phoneHref}`} className="text-white/75 hover:text-orange">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
              <a href={`mailto:${CONTACT.email}`} className="break-all text-white/75 hover:text-orange">
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built by{" "}
            <a
              href={SITE.builtBy.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange hover:underline"
            >
              {SITE.builtBy.label}
            </a>
          </p>
          <p>
            Copyright @ {SITE.copyrightYear} {SITE.legalName}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
