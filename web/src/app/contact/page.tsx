import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/sections/page-hero";
import { ContactPanel } from "@/components/contact/contact-panel";
import { JsonLd } from "@/components/json-ld";
import { MapPinIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { CONTACT } from "@/lib/site";
import {
  graph,
  webPageSchema,
  breadcrumbSchema,
  contactPointSchema,
} from "@/lib/schema";

const description =
  "Get in touch with CrestView. Visit our Victoria Island office, email or call us — or use our AI assistant to find the right service for your business.";

export const metadata: Metadata = {
  title: "Contact Us",
  description,
  alternates: { canonical: "/contact" },
};

const CARDS = [
  {
    icon: MapPinIcon,
    title: "Our Office",
    value: CONTACT.address.full,
    note: "",
    href: "",
  },
  {
    icon: MailIcon,
    title: "Email Us",
    value: CONTACT.email,
    note: CONTACT.emailNote,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: PhoneIcon,
    title: "Call Us",
    value: CONTACT.phone,
    note: CONTACT.hours,
    href: `tel:${CONTACT.phoneHref}`,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={graph([
          {
            ...webPageSchema({ path: "/contact", name: "Contact", description, type: "ContactPage" }),
            mainEntity: contactPointSchema(),
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ])}
      />

      <PageHero
        image="/images/hero-contact.jpg"
        imageAlt="CrestView office workspace"
        eyebrow="Contact Us"
        title="Let's discuss what's next for your business."
        priority
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          {/* Info cards */}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((card) => {
              const Icon = card.icon;
              const body = (
                <>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange/10 text-orange">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 font-serif text-lg text-ink">{card.title}</h2>
                  <p className="mt-2 break-words text-sm text-body">{card.value}</p>
                  {card.note && <p className="mt-1 text-xs text-muted">{card.note}</p>}
                </>
              );
              return (
                <li
                  key={card.title}
                  className="rounded-xl border border-line bg-white p-6 transition-shadow hover:shadow-[0_12px_30px_-16px_rgba(5,13,66,0.25)]"
                >
                  {card.href ? (
                    <a href={card.href} className="block focus-visible:outline-none">
                      {body}
                    </a>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>

          {/* Panel */}
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
            <div className="max-w-md">
              <p className="eyebrow text-orange">Get in touch</p>
              <h2 className="mt-3 font-serif text-2xl text-ink sm:text-3xl">
                Tell us where you are — we&apos;ll help you get where you&apos;re going.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-body">
                Send us a message and our team will respond within a day, or chat with our AI
                assistant to discover the service that fits your needs.
              </p>
            </div>

            <ContactPanel />
          </div>
        </Container>
      </section>
    </>
  );
}
