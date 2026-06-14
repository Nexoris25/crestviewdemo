import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessSection } from "@/components/sections/process-section";
import { ServiceRecommender } from "@/components/sections/service-recommender";
import { JsonLd } from "@/components/json-ld";
import { SERVICES_PROCESS } from "@/lib/site";
import {
  graph,
  webPageSchema,
  breadcrumbSchema,
  servicesCatalogSchema,
} from "@/lib/schema";

const description =
  "Explore CrestView's consulting services — business strategy, operations improvement, market entry and financial advisory — each built around your goals.";

export const metadata: Metadata = {
  title: "Our Services",
  description,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={graph([
          webPageSchema({
            path: "/services",
            name: "Services",
            description,
            type: "CollectionPage",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          servicesCatalogSchema(),
        ])}
      />

      <PageHero
        image="/images/hero-services.jpg"
        imageAlt="A consultant working at a desk with a laptop"
        eyebrow="Our Services"
        title="Solutions designed around your business goals!"
        priority
        scrollHint="What we do"
      >
        <ButtonLink href="#recommender" variant="primary" withArrow>
          Find my service
        </ButtonLink>
      </PageHero>

      <ServicesGrid showOutcomes />

      <ProcessSection
        title="Clear process. Real impact"
        steps={SERVICES_PROCESS}
        variant="icon"
      />

      <div id="recommender" className="scroll-mt-20">
        <ServiceRecommender />
      </div>
    </>
  );
}
