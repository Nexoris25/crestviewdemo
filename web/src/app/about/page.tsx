import type { Metadata } from "next";
import Image from "next/image";
import { Container, ButtonLink, SectionHeading } from "@/components/ui";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/json-ld";
import { NamedIcon, FlagIcon, LinkedinIcon } from "@/components/icons";
import { IMPACT_STATS, VALUES, MISSION, STORY, TEAM } from "@/lib/site";
import {
  graph,
  webPageSchema,
  breadcrumbSchema,
  teamSchema,
} from "@/lib/schema";

const description =
  "CrestView is a consulting partner focused on long-term business success — empowering organisations across Africa with clarity, insight and practical strategy.";

export const metadata: Metadata = {
  title: "About Us",
  description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={graph([
          webPageSchema({
            path: "/about",
            name: "About",
            description,
            type: "AboutPage",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          ...teamSchema(),
        ])}
      />

      <PageHero
        image="/images/hero-about.jpg"
        imageAlt="A modern, light-filled boardroom"
        eyebrow="About CrestView"
        title="A consulting partner focused on long-term business success!"
        priority
      >
        <ButtonLink href="#leadership" variant="primary" withArrow>
          Meet our team
        </ButtonLink>
      </PageHero>

      {/* Impact */}
      <section className="bg-navy-deep py-14 text-white sm:py-16">
        <Container>
          <h2 className="eyebrow text-center text-orange">Our Impact</h2>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="font-serif text-4xl font-semibold text-orange sm:text-5xl">
                  {stat.value}
                </dt>
                <dd className="mx-auto mt-2 max-w-[10rem] text-sm text-white/75">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Mission & Values */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 rounded-2xl bg-cream p-6 sm:p-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
            <div>
              <p className="eyebrow text-orange">Our Mission</p>
              <div className="mt-5 flex gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-orange shadow-sm">
                  <FlagIcon className="h-6 w-6" />
                </span>
                <p className="font-serif text-xl leading-relaxed text-ink">{MISSION}</p>
              </div>
            </div>

            <div>
              <p className="eyebrow text-orange">Our Values</p>
              <ul className="mt-5 grid gap-6 sm:grid-cols-2">
                {VALUES.map((value) => (
                  <li key={value.title} className="flex flex-col">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-orange shadow-sm">
                      <NamedIcon name={value.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 font-serif text-base text-ink">{value.title}</h3>
                    <p className="mt-1 text-sm text-body">{value.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="bg-white pb-16 sm:pb-20 lg:pb-24">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/our-story.jpg"
                alt="The CrestView team collaborating in a meeting"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="max-w-lg">
              <h2 className="font-serif text-2xl text-ink sm:text-3xl">Our Story</h2>
              <p className="mt-5 text-base leading-relaxed text-body">{STORY}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Leadership */}
      <section id="leadership" className="scroll-mt-20 bg-white pb-16 sm:pb-20 lg:pb-24">
        <Container>
          <SectionHeading
            eyebrow="Our Leadership"
            title="Experience. Trusted. Committed to your success."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member) => (
              <li
                key={member.name}
                className="flex gap-4 rounded-xl border border-line bg-white p-4"
              >
                <Image
                  src={member.photo}
                  alt={`Portrait of ${member.name}`}
                  width={96}
                  height={112}
                  className="h-28 w-24 shrink-0 rounded-lg object-cover"
                />
                <div className="flex min-w-0 flex-col">
                  <h3 className="font-serif text-lg text-ink">{member.name}</h3>
                  <p className="text-sm font-medium text-orange">{member.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-body">{member.bio}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="mt-auto inline-flex h-8 w-8 items-center justify-center rounded-md bg-navy/5 text-navy transition-colors hover:bg-orange hover:text-white"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
