import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SERVICES } from '../ai/ai.types';

export interface Kpi {
  value: number | string;
  changePct: number | null; // vs last month
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [leads, activities] = await Promise.all([
      this.prisma.lead.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.activity.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    ]);

    const now = new Date();
    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonth = leads.filter((l) => l.createdAt >= startThisMonth);
    const lastMonth = leads.filter(
      (l) => l.createdAt >= startLastMonth && l.createdAt < startThisMonth,
    );

    const hot = leads.filter((l) => l.status === 'Hot');
    const warm = leads.filter((l) => l.status === 'Warm');
    const cold = leads.filter((l) => l.status === 'Cold');
    const total = leads.length || 1;

    const hotThisMonth = thisMonth.filter((l) => l.status === 'Hot').length;
    const hotLastMonth = lastMonth.filter((l) => l.status === 'Hot').length;

    const conversion = Math.round((hot.length / total) * 100);

    // Average response time = gap between a lead's submission and the first
    // human/admin action (email regenerated or status changed) on it.
    const responseMins = await this.averageResponseMinutes();

    const totalLeads: Kpi = {
      value: thisMonth.length,
      changePct: pctChange(thisMonth.length, lastMonth.length),
    };
    const hotLeads: Kpi = { value: hot.length, changePct: pctChange(hotThisMonth, hotLastMonth) };
    const avgResponse: Kpi = {
      value: responseMins === null ? '—' : formatDuration(responseMins),
      changePct: null,
    };
    const conversionRate: Kpi = { value: `${conversion}%`, changePct: null };

    const byStatus = [
      { label: 'Hot', count: hot.length, pct: pct(hot.length, total) },
      { label: 'Warm', count: warm.length, pct: pct(warm.length, total) },
      { label: 'Cold', count: cold.length, pct: pct(cold.length, total) },
    ];

    const byService = SERVICES.map((name) => {
      const count = leads.filter((l) => (l.service ?? '') === name).length;
      return { label: name, count, pct: pct(count, total) };
    }).sort((a, b) => b.count - a.count);

    const recentLeads = leads.slice(0, 8).map((l) => ({
      id: l.id,
      fullName: l.fullName,
      company: l.company,
      service: l.service,
      score: l.score,
      status: l.status,
      createdAt: l.createdAt.toISOString(),
    }));

    const recentActivities = activities.map((a) => ({
      id: a.id,
      type: a.type,
      message: a.message,
      createdAt: a.createdAt.toISOString(),
    }));

    return {
      kpis: { totalLeads, hotLeads, avgResponse, conversionRate },
      totalLeads: leads.length,
      byStatus,
      byService,
      recentLeads,
      recentActivities,
    };
  }

  private async averageResponseMinutes(): Promise<number | null> {
    const leads = await this.prisma.lead.findMany({
      include: {
        activities: {
          where: { type: { in: ['email_generated', 'status_updated'] } },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    });
    const diffs: number[] = [];
    for (const lead of leads) {
      const first = lead.activities[0];
      if (first) {
        diffs.push((first.createdAt.getTime() - lead.createdAt.getTime()) / 60000);
      }
    }
    if (diffs.length === 0) return null;
    return Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
  }
}

function pct(part: number, total: number): number {
  return Math.round((part / (total || 1)) * 100);
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
