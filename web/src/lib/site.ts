/**
 * Central content + configuration for the CrestView marketing site.
 * Keeping copy here keeps pages declarative and the schema markup in sync
 * with what is actually rendered.
 */

export const SITE = {
  name: "CrestView",
  legalName: "Crestview Group",
  brandLine: "Group",
  /** Canonical production origin — used for metadata + JSON-LD. */
  url: "https://www.crestviewgroup.com",
  tagline: "Strategy. Clarity. Growth",
  description:
    "CrestView is a consulting partner helping ambitious businesses across Africa grow with clarity, insight and practical strategy.",
  footerBlurb: "Trusted advisor to ambitious businesses in Africa and beyond.",
  builtBy: { label: "Nexoris Technologies", href: "https://nexoris.tech" },
  copyrightYear: 2026,
} as const;

export const CONTACT = {
  address: {
    street: "16 Kofo Abayomi Street",
    locality: "Victoria Island, Lagos",
    region: "Lagos",
    country: "Nigeria",
    full: "16 Kofo Abayomi Street, Victoria Island, Lagos, Nigeria",
  },
  phone: "+123 - 777 - 222 - 7272",
  phoneHref: "+1237772227272",
  email: "info@crestviewgroup.com",
  emailNote: "We aim to respond within a day",
  hours: "Monday - Friday 9:00 AM - 5:00 PM",
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const SOCIALS: { label: string; href: string; icon: "linkedin" | "mail" | "x" }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/crestviewgroup", icon: "linkedin" },
  { label: "Email", href: "mailto:info@crestviewgroup.com", icon: "mail" },
  { label: "X (Twitter)", href: "https://x.com/crestviewgroup", icon: "x" },
];

export type IconName =
  | "idea"
  | "settings"
  | "chart"
  | "pie"
  | "search"
  | "target"
  | "rocket";

export interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  outcomes: string[];
  icon: IconName;
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "business-strategy-advisory",
    title: "Business Strategy & Advisory",
    description:
      "Develop winning strategies and make confident decisions that drive sustainable growth.",
    outcomes: ["Strategic clarity", "Growth planning", "Competitive advantage"],
    icon: "idea",
  },
  {
    slug: "operations-process-improvement",
    title: "Operations & Process Improvement",
    description:
      "Streamline operations and build efficient processes that increase productivity and reduce costs.",
    outcomes: ["Increase productivity", "Reduce cost", "Better execution"],
    icon: "settings",
  },
  {
    slug: "market-entry-growth",
    title: "Market Entry & Growth",
    description:
      "Enter new markets and scale your business with confidence and local intelligence.",
    outcomes: ["Market expansion", "Revenue growth", "Risk reduction"],
    icon: "chart",
  },
  {
    slug: "financial-advisory-planning",
    title: "Financial Advisory & Planning",
    description:
      "Strengthen your financial foundation and plan for long-term value and resilience.",
    outcomes: ["Better forecasting", "Improved cashflow", "Sustainable profitability"],
    icon: "pie",
  },
];

export interface ProcessStep {
  number: string;
  title: string;
  lead: string;
  description: string;
  icon?: IconName;
}

/** Home page — "What working with us actually looks like". */
export const HOME_PROCESS: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    lead: "We start by listening",
    description:
      "Before we suggest anything, we sit with you to understand your business, what you are trying to achieve and what is holding you back.",
  },
  {
    number: "02",
    title: "Strategy",
    lead: "We put plans on paper",
    description:
      "You get a clear document that spells out what we will do, how long it will take, and what the outcome will look like. You approve it before we begin.",
  },
  {
    number: "03",
    title: "Execution",
    lead: "We do the work",
    description:
      "Our team deliver in stages and keep you updated throughout. You always know where things stand without having to follow up.",
  },
  {
    number: "04",
    title: "Results",
    lead: "We show you what we delivered",
    description:
      "At the end of every engagement, we walk you through what was completed, what improved, and what we think you should focus on next.",
  },
];

/** Services page — "Clear process. Real impact". */
export const SERVICES_PROCESS: ProcessStep[] = [
  {
    number: "1",
    title: "Discovery",
    lead: "",
    description: "We understand your business, challenges and goals.",
    icon: "search",
  },
  {
    number: "2",
    title: "Analysis",
    lead: "",
    description: "We analyze data, assess opportunities, and identify gaps.",
    icon: "chart",
  },
  {
    number: "3",
    title: "Strategy",
    lead: "",
    description: "We develop a practical strategy tailored to your needs.",
    icon: "target",
  },
  {
    number: "4",
    title: "Implementation support",
    lead: "",
    description: "We work with you to implement and achieve measurable result.",
    icon: "rocket",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "As a long-time user of WDK AI ToolKit, I can confidently say that their solutions have revolutionised the way we operate.",
    name: "Artemisia Udinese",
    role: "Marketing Specialist",
    avatar: "/images/avatar-testimonial.jpg",
  },
  {
    quote:
      "As a long-time user of WDK AI ToolKit, I can confidently say that their solutions have revolutionised the way we operate.",
    name: "Artemisia Udinese",
    role: "Marketing Specialist",
    avatar: "/images/avatar-testimonial.jpg",
  },
  {
    quote:
      "As a long-time user of WDK AI ToolKit, I can confidently say that their solutions have revolutionised the way we operate.",
    name: "Artemisia Udinese",
    role: "Marketing Specialist",
    avatar: "/images/avatar-testimonial.jpg",
  },
];

export const IMPACT_STATS: { value: string; label: string }[] = [
  { value: "100+", label: "Businesses advised" },
  { value: "15+", label: "Years of combined experience" },
  { value: "10+", label: "Countries across Africa" },
  { value: "20+", label: "Industries served" },
  { value: "85+", label: "Clients who returned or refer us" },
];

export const VALUES: { title: string; description: string; icon: IconName }[] = [
  { title: "Integrity", description: "We do the right thing always", icon: "target" },
  { title: "Excellence", description: "We strive for the highest standards", icon: "idea" },
  { title: "Collaboration", description: "We succeed when you do", icon: "settings" },
  { title: "Impact", description: "We focus on what moves the needle", icon: "chart" },
];

export const MISSION =
  "To empower business with clarity, insight and practical strategies that drive sustainable growth and measurable impact.";

export const STORY =
  "Lorem ipsum dolor sit amet consectetur. Neque in commodo maecenas mollis curabitur dolor. Posuere nunc lectus condimentum bibendum nisl. Non tellus nisl nibh turpis. Scelerisque consectetur platea lectus habitant faucibus.";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
  linkedin: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "John Alabi",
    role: "CEO",
    bio: "Lorem ipsum dolor sit amet consectetur. Neque in commodo.",
    photo: "/images/team-ceo.jpg",
    linkedin: "https://www.linkedin.com/in/crestview-ceo",
  },
  {
    name: "Ann Daniel",
    role: "Lead Strategist",
    bio: "Lorem ipsum dolor sit amet consectetur. Neque in commodo.",
    photo: "/images/team-strategist.jpg",
    linkedin: "https://www.linkedin.com/in/crestview-strategist",
  },
  {
    name: "Danladi Jacob",
    role: "Managing Partner",
    bio: "Lorem ipsum dolor sit amet consectetur. Neque in commodo.",
    photo: "/images/team-partner.jpg",
    linkedin: "https://www.linkedin.com/in/crestview-partner",
  },
];
