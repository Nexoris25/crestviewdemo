import type { Metadata } from "next";
import { poppins, inter } from "./fonts";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AssistantWidget } from "@/components/assistant/assistant-widget";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.legalName} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "business consulting",
    "strategy advisory",
    "operations improvement",
    "market entry",
    "financial advisory",
    "Africa consulting",
  ],
  authors: [{ name: SITE.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.legalName,
    title: `${SITE.legalName} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: "en_US",
    images: [{ url: "/images/hero-about.jpg", width: 1920, height: 1280, alt: SITE.legalName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.legalName} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/images/hero-about.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <JsonLd data={graph([organizationSchema(), websiteSchema()])} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <AssistantWidget />
      </body>
    </html>
  );
}
