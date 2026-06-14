import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SERVICES = [
  'Operations & Process Improvement',
  'Market Entry & Growth',
  'Business Strategy & Advisory',
  'Financial Advisory & Planning',
];

const COMPANIES = ['Prime Logistics', 'Nova Energy', 'Zentry Foods', 'Acme Retail', 'Helios Bank'];

function minsAgo(m: number) {
  return new Date(Date.now() - m * 60_000);
}
function hoursAgo(h: number) {
  return minsAgo(h * 60);
}
function daysAgo(d: number) {
  return hoursAgo(d * 24);
}

function statusFromScore(score: number): string {
  if (score >= 75) return 'Hot';
  if (score >= 45) return 'Warm';
  return 'Cold';
}

async function main() {
  // Idempotent reset.
  await prisma.activity.deleteMany();
  await prisma.lead.deleteMany();

  // ---- Showcase lead matching the Figma Lead Drawer ----
  const johnDoe = await prisma.lead.create({
    data: {
      fullName: 'John Doe',
      company: 'Prime Logistics',
      email: 'johndoe@gmail.com',
      phone: '+123 900 900 9000',
      location: 'Lagos, Nigeria',
      service: 'Operations & Process Improvement',
      consent: true,
      message:
        'We are struggling with inefficient internal processes across multiple departments. Approval cycles take too long and teams often work in silos, resulting in delays and missed deadlines.',
      status: 'Hot',
      score: 92,
      aiPowered: false,
      summary:
        'The prospect is experiencing operational inefficiencies caused by fragmented workflows and lengthy approval processes. Their organisation appears focused on improving coordination, increasing execution speed, and creating more scalable internal systems. The challenge aligns strongly with operational transformation and process improvement initiatives.',
      reasons: JSON.stringify([
        'Clear business challenge',
        'Specific pain point',
        'Decision making authority implied',
        'Strong consultation fit',
        'High likelihood of engagement',
      ]),
      toneSignals: JSON.stringify(['Urgent', 'Growth Focused', 'Goal Oriented']),
      nextStep:
        'Schedule a discovery call within 48 hours. The prospect has clearly articulated a business challenge, identified operational pain points, and demonstrated a strong fit for consulting support. Early engagement will help qualify priorities and uncover opportunities for workflow optimisation.',
      emailSubject: 'Operational Improvement Consultation',
      emailBody: `Hi John Doe.

Thank you for reaching out to Crestview Group.

Based on the information you shared, it appears your organisation may benefit from a structured review of internal processes, approval workflows, and cross-functional collaboration.

Our Operations & Process Improvement team helps businesses identify bottlenecks, improve efficiency, and implement practical systems that support long-term growth.

We would welcome the opportunity to learn more about your current challenges and discuss potential solutions tailored to your organisation.

Please let us know a convenient time for an introductory conversation.

Kind regards,
Crestview Group.`,
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(1),
    },
  });

  await prisma.activity.createMany({
    data: [
      { type: 'lead_submitted', message: 'New lead submitted from Prime Logistics', leadId: johnDoe.id, createdAt: hoursAgo(3) },
      { type: 'ai_analysis', message: 'AI scored John Doe as Hot (92/100)', leadId: johnDoe.id, createdAt: hoursAgo(3) },
      { type: 'status_updated', message: 'Lead status updated to Hot for John Doe', leadId: johnDoe.id, createdAt: hoursAgo(1) },
      { type: 'email_generated', message: 'AI follow-up email generated for John Doe', leadId: johnDoe.id, createdAt: minsAgo(2) },
    ],
  });

  // ---- A spread of additional leads for realistic dashboard stats ----
  const firstNames = ['Jane', 'Ada', 'Tunde', 'Maryam', 'Chidi', 'Grace', 'Samuel', 'Fatima', 'David', 'Zainab', 'Peter'];
  const scores = [93, 88, 81, 76, 64, 58, 49, 44, 38, 71, 55];

  for (let i = 0; i < firstNames.length; i++) {
    const score = scores[i];
    const status = statusFromScore(score);
    const company = COMPANIES[i % COMPANIES.length];
    const service = SERVICES[i % SERVICES.length];
    const created = i < 4 ? hoursAgo(2 + i * 3) : daysAgo(1 + i);
    const name = `${firstNames[i]} ${String.fromCharCode(68 + (i % 6))}.`;

    const lead = await prisma.lead.create({
      data: {
        fullName: name,
        company,
        email: `${firstNames[i].toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+123 700 000 0000',
        location: 'Lagos, Nigeria',
        service,
        consent: true,
        message: `We are exploring ${service.toLowerCase()} support to help us grow and operate more effectively over the next year.`,
        status,
        score,
        aiPowered: false,
        summary: `${name} from ${company} is exploring ${service.toLowerCase()}. The enquiry indicates a genuine business need worth qualifying with a discovery conversation.`,
        reasons: JSON.stringify(['Defined area of interest', 'Engaged enquiry', 'Good consulting fit']),
        toneSignals: JSON.stringify(status === 'Hot' ? ['Urgent', 'Growth Focused'] : ['Exploratory']),
        nextStep:
          status === 'Hot'
            ? 'Schedule a discovery call within 48 hours.'
            : status === 'Warm'
              ? 'Send a tailored follow-up and propose an intro call.'
              : 'Add to nurture sequence and share a relevant case study.',
        emailSubject: `${service} — let's talk, ${company}`,
        emailBody: `Hi ${firstNames[i]},\n\nThank you for reaching out to Crestview Group. Based on what you shared, our ${service} team can help you make real progress.\n\nAre you available for a short introductory call this week?\n\nKind regards,\nThe Crestview Group Team`,
        createdAt: created,
        updatedAt: created,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'lead_submitted',
        message: `New lead submitted from ${company}`,
        leadId: lead.id,
        createdAt: created,
      },
    });

    // Give a few leads a human action so "average response time" is realistic.
    if (i % 3 === 0) {
      await prisma.activity.create({
        data: {
          type: 'email_generated',
          message: `AI follow-up email generated for ${name}`,
          leadId: lead.id,
          createdAt: new Date(created.getTime() + (90 + i * 20) * 60_000),
        },
      });
    }
  }

  const count = await prisma.lead.count();
  console.log(`Seed complete — ${count} leads created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
