import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import type { Lead } from '@prisma/client';

export interface LeadDto {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string | null;
  location: string | null;
  service: string | null;
  message: string;
  source: string;
  status: string;
  score: number;
  summary: string | null;
  reasons: string[];
  toneSignals: string[];
  nextStep: string | null;
  email_draft: { subject: string; body: string } | null;
  aiPowered: boolean;
  createdAt: string;
}

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  async create(dto: CreateLeadDto): Promise<LeadDto> {
    const analysis = await this.gemini.analyzeLead({
      fullName: dto.fullName,
      company: dto.company,
      email: dto.email,
      phone: dto.phone,
      service: dto.service,
      message: dto.message,
    });

    const lead = await this.prisma.lead.create({
      data: {
        fullName: dto.fullName,
        company: dto.company,
        email: dto.email,
        phone: dto.phone ?? null,
        service: dto.service ?? null,
        message: dto.message,
        consent: dto.consent ?? false,
        status: analysis.status,
        score: analysis.score,
        summary: analysis.summary,
        reasons: JSON.stringify(analysis.reasons),
        toneSignals: JSON.stringify(analysis.toneSignals),
        nextStep: analysis.nextStep,
        emailSubject: analysis.email.subject,
        emailBody: analysis.email.body,
        aiPowered: analysis.aiPowered,
      },
    });

    await this.prisma.activity.createMany({
      data: [
        {
          type: 'lead_submitted',
          message: `New lead submitted from ${dto.company}`,
          leadId: lead.id,
        },
        {
          type: 'ai_analysis',
          message: `AI scored ${dto.fullName} as ${analysis.status} (${analysis.score}/100)`,
          leadId: lead.id,
        },
      ],
    });

    return this.serialize(lead);
  }

  async findAll(filters: { status?: string; service?: string; search?: string }): Promise<LeadDto[]> {
    const where: Record<string, unknown> = {};
    if (filters.status && filters.status !== 'All') where.status = filters.status;
    if (filters.service) where.service = filters.service;
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search } },
        { company: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }
    const leads = await this.prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return leads.map((l) => this.serialize(l));
  }

  async findOne(id: string): Promise<LeadDto> {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    return this.serialize(lead);
  }

  async regenerateEmail(id: string): Promise<{ subject: string; body: string }> {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');

    const email = await this.gemini.regenerateEmail(
      {
        fullName: lead.fullName,
        company: lead.company,
        email: lead.email,
        phone: lead.phone ?? undefined,
        service: lead.service ?? undefined,
        message: lead.message,
      },
      lead.status,
    );

    await this.prisma.lead.update({
      where: { id },
      data: { emailSubject: email.subject, emailBody: email.body },
    });
    await this.prisma.activity.create({
      data: {
        type: 'email_generated',
        message: `AI follow-up email regenerated for ${lead.fullName}`,
        leadId: lead.id,
      },
    });

    return email;
  }

  async updateStatus(id: string, status: string): Promise<LeadDto> {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    const updated = await this.prisma.lead.update({ where: { id }, data: { status } });
    await this.prisma.activity.create({
      data: {
        type: 'status_updated',
        message: `Lead status updated to ${status} for ${lead.fullName}`,
        leadId: id,
      },
    });
    return this.serialize(updated);
  }

  /** Permanently delete a lead. Related activities cascade-delete via Prisma. */
  async remove(id: string): Promise<{ id: string; deleted: true }> {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    await this.prisma.lead.delete({ where: { id } });
    return { id, deleted: true };
  }

  private serialize(lead: Lead): LeadDto {
    return {
      id: lead.id,
      fullName: lead.fullName,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      location: lead.location,
      service: lead.service,
      message: lead.message,
      source: lead.source,
      status: lead.status,
      score: lead.score,
      summary: lead.summary,
      reasons: safeArray(lead.reasons),
      toneSignals: safeArray(lead.toneSignals),
      nextStep: lead.nextStep,
      email_draft:
        lead.emailSubject && lead.emailBody
          ? { subject: lead.emailSubject, body: lead.emailBody }
          : null,
      aiPowered: lead.aiPowered,
      createdAt: lead.createdAt.toISOString(),
    };
  }
}

function safeArray(json: string | null): string[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}
