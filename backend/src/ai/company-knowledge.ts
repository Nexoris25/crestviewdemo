/**
 * The single source of truth the assistant is allowed to speak from. These
 * facts mirror exactly what the marketing website publishes. The assistant must
 * not invent anything beyond this (addresses, prices, names, etc.).
 */
export const COMPANY_KNOWLEDGE = `
COMPANY: Crestview Group
TAGLINE: Strategy. Clarity. Growth.
ABOUT: Crestview Group is a business consulting partner focused on long-term business success. We help ambitious businesses grow with confidence through clarity, insight and practical strategy. We are a trusted advisor to ambitious businesses in Africa and beyond.

HEAD OFFICE (the only office): 16 Kofo Abayomi Street, Victoria Island, Lagos, Nigeria.
PHONE: +123 - 777 - 222 - 7272
EMAIL: info@crestviewgroup.com
OFFICE HOURS: Monday to Friday, 9:00 AM - 5:00 PM.
AREAS SERVED: Africa (and beyond). We are headquartered in Lagos, Nigeria.
CONTACT FORM: Yes — the website HAS a contact form on the Contact page. Visitors can submit an enquiry there (full name, company, email, phone, service of interest, and a message), and the team responds within a day. The site also has this AI assistant chat. To get in touch, use the contact form, email info@crestviewgroup.com, or call +123 - 777 - 222 - 7272.

MISSION: To empower business with clarity, insight and practical strategies that drive sustainable growth and measurable impact.
VALUES: Integrity (we do the right thing always); Excellence (we strive for the highest standards); Collaboration (we succeed when you do); Impact (we focus on what moves the needle).

IMPACT: 100+ businesses advised; 15+ years of combined experience; 10+ countries across Africa; 20+ industries served; 85+ clients who returned or refer us.

LEADERSHIP: John Alabi (CEO); Ann Daniel (Lead Strategist); Danladi Jacob (Managing Partner).

SERVICES (exactly four):
1. Business Strategy & Advisory — Develop winning strategies and make confident decisions that drive sustainable growth. Key outcomes: Strategic clarity, Growth planning, Competitive advantage.
2. Operations & Process Improvement — Streamline operations and build efficient processes that increase productivity and reduce costs. Key outcomes: Increase productivity, Reduce cost, Better execution.
3. Market Entry & Growth — Enter new markets and scale your business with confidence and local intelligence. Key outcomes: Market expansion, Revenue growth, Risk reduction.
4. Financial Advisory & Planning — Strengthen your financial foundation and plan for long-term value and resilience. Key outcomes: Better forecasting, Improved cashflow, Sustainable profitability.

HOW WE WORK: Discovery (we start by listening), Strategy (we put plans on paper), Execution (we deliver in stages), Results (we show you what we delivered).
`.trim();
