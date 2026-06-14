import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessSection } from "@/components/sections/process-section";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { Testimonials } from "@/components/sections/testimonials";
import { JsonLd } from "@/components/json-ld";
import { HOME_PROCESS } from "@/lib/site";
import {
  graph,
  webPageSchema,
  breadcrumbSchema,
  servicesCatalogSchema,
  reviewsSchema,
} from "@/lib/schema";

const description =
  "CrestView helps ambitious businesses grow with confidence through strategy, operations, market-entry and financial advisory across Africa.";

export const metadata: Metadata = {
  title: "Helping ambitious businesses grow with confidence",
  description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={graph([
          webPageSchema({
            path: "/",
            name: "Home",
            description,
          }),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          servicesCatalogSchema(),
          ...reviewsSchema(),
        ])}
      />

      <PageHero
        image="/images/hero-home.jpg"
        imageAlt="Looking up at modern corporate skyscrapers"
        eyebrow="Strategy. Clarity. Growth."
        title="Helping ambitious businesses grow with confidence!"
        priority
        size="tall"
        scrollHint="What we do"
      >
        <ButtonLink href="/contact" variant="primary" withArrow>
          Get started
        </ButtonLink>
        <ButtonLink href="/services" variant="outline">
          Explore services
        </ButtonLink>
      </PageHero>

      <ServicesGrid />

      <ProcessSection
        title="What working with us actually looks like"
        steps={HOME_PROCESS}
        variant="numbered"
      />

      <LogoCloud />

      <Testimonials />
    </>
  );
}
