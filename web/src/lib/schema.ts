/**
 * Schema.org (JSON-LD) builders. Every builder returns a plain object that is
 * serialized into a <script type="application/ld+json"> tag. Values are kept in
 * sync with the visible page content and the data in `site.ts`.
 */
import { SITE, CONTACT, SERVICES, TEAM, TESTIMONIALS, IMPACT_STATS } from "@/lib/site";

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

export function organizationSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon.svg`,
    image: `${SITE.url}/images/hero-about.jpg`,
    description: SITE.description,
    slogan: SITE.tagline,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    areaServed: "Africa",
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.locality,
      addressRegion: CONTACT.address.region,
      addressCountry: CONTACT.address.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.phone,
      email: CONTACT.email,
      contactType: "customer support",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://www.linkedin.com/company/crestviewgroup",
      "https://x.com/crestviewgroup",
    ],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function webPageSchema({
  path,
  name,
  description,
  type = "WebPage",
}: {
  path: string;
  name: string;
  description: string;
  type?: string;
}) {
  return {
    "@type": type,
    "@id": `${SITE.url}${path}#webpage`,
    url: `${SITE.url}${path}`,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function servicesCatalogSchema() {
  return {
    "@type": "OfferCatalog",
    name: "Consulting services",
    itemListElement: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        serviceType: service.title,
        provider: { "@id": ORG_ID },
        areaServed: "Africa",
      },
    })),
  };
}

export function teamSchema() {
  return TEAM.map((member) => ({
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    worksFor: { "@id": ORG_ID },
    sameAs: [member.linkedin],
  }));
}

export function reviewsSchema() {
  return TESTIMONIALS.slice(0, 1).map((t) => ({
    "@type": "Review",
    reviewBody: t.quote,
    author: { "@type": "Person", name: t.name },
    itemReviewed: { "@id": ORG_ID },
    reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
  }));
}

export function contactPointSchema() {
  return {
    "@type": "ContactPoint",
    telephone: CONTACT.phone,
    email: CONTACT.email,
    contactType: "customer support",
    areaServed: "Africa",
    availableLanguage: ["English"],
  };
}

/** Wrap a list of node objects in a single @graph document. */
export function graph(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export { IMPACT_STATS };
