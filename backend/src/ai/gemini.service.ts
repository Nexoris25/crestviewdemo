import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import {
  ChatResult,
  ChatTurn,
  LeadAnalysis,
  LeadAnalysisInput,
  LeadEmail,
  SERVICES,
  statusFromScore,
} from './ai.types';
import { COMPANY_KNOWLEDGE } from './company-knowledge';

/**
 * Wraps Google Gemini for lead intelligence + the marketing-site assistant.
 * Every method falls back to a deterministic heuristic when no API key is
 * configured or the API call fails, so the product works end-to-end offline.
 */
@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly client: GoogleGenAI | null;
  /** Models tried in order: primary first, then the lighter/faster fallback. */
  private readonly models: string[];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const primary = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash';
    const fallback = process.env.GEMINI_MODEL_FALLBACK?.trim() || 'gemini-3.1-flash-lite';
    this.models = [...new Set([primary, fallback].filter(Boolean))];
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
    if (!this.client) {
      this.logger.warn('GEMINI_API_KEY not set — using rule-based fallback for AI features.');
    } else {
      this.logger.log(`Gemini enabled (models: ${this.models.join(' → ')}).`);
    }
  }

  get enabled(): boolean {
    return this.client !== null;
  }

  // ---------------------------------------------------------------- Leads ---

  async analyzeLead(input: LeadAnalysisInput): Promise<LeadAnalysis> {
    if (this.client) {
      try {
        const prompt = this.leadPrompt(input);
        const text = await this.generate(prompt, true);
        const parsed = this.parseJson(text);
        return this.normalizeAnalysis(parsed, input, true);
      } catch (err) {
        this.logger.error(`Gemini analyzeLead failed, using fallback: ${String(err)}`);
      }
    }
    return this.fallbackAnalysis(input);
  }

  async regenerateEmail(input: LeadAnalysisInput, status: string): Promise<LeadEmail> {
    if (this.client) {
      try {
        const prompt = `You are a consultant at Crestview Group, a business consulting firm.
Write a warm, concise follow-up email (120-170 words) to a prospective client who submitted an enquiry.
Vary the wording from any previous version. Return ONLY JSON: {"subject": string, "body": string}.
Prospect: ${input.fullName} at ${input.company}. Service of interest: ${input.service || 'general consulting'}.
Lead temperature: ${status}.
Their message: """${input.message}"""`;
        const text = await this.generate(prompt, true);
        const parsed = this.parseJson(text);
        if (parsed?.subject && parsed?.body) {
          return { subject: String(parsed.subject), body: String(parsed.body) };
        }
      } catch (err) {
        this.logger.error(`Gemini regenerateEmail failed, using fallback: ${String(err)}`);
      }
    }
    return this.fallbackEmail(input);
  }

  // ----------------------------------------------------------- Assistant ---

  async chat(messages: ChatTurn[]): Promise<ChatResult> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

    // 1) Website-first: answer factual questions straight from the knowledge
    //    base. This is instant, always accurate, and makes no API call.
    const fromWebsite = this.localAnswer(lastUser);
    if (fromWebsite) return fromWebsite;

    // 2) Open-ended questions (e.g. "which service fits us?") need reasoning.
    //    Try each Gemini model in order; move to the next only on failure.
    if (this.client) {
      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
      const config = {
        temperature: 0.3,
        systemInstruction: this.assistantSystemInstruction(),
        responseMimeType: 'application/json' as const,
      };
      for (const model of this.models) {
        try {
          const response = await this.client.models.generateContent({ model, contents, config });
          const parsed = this.parseJson(response.text ?? '');
          if (parsed?.reply) {
            return {
              reply: String(parsed.reply),
              suggestedService: parsed.suggestedService ? String(parsed.suggestedService) : undefined,
              reason: parsed.reason ? String(parsed.reason) : undefined,
            };
          }
          this.logger.warn(`Gemini chat model "${model}" returned no usable reply.`);
        } catch (err) {
          this.logger.warn(`Gemini chat model "${model}" failed: ${String(err)}`);
        }
      }
    }

    // 3) No API key, or every model failed (e.g. rate limited) → hand over to a
    //    human instead of guessing a possibly-wrong service recommendation.
    return this.humanHandover();
  }

  private assistantSystemInstruction(): string {
    return `You are the Crestview Assistant, the website assistant for Crestview Group.

You MUST only answer using the verified company facts below. Do NOT invent or guess any detail — especially addresses, office locations, phone numbers, emails, prices, people, or statistics. Crestview Group has ONE office, in Lagos, Nigeria; never state any other location. If a question cannot be answered from these facts, say you don't have that information and point the visitor to the contact form on our Contact page, or to info@crestviewgroup.com or +123 - 777 - 222 - 7272. Never claim to be a generic AI or mention other companies.

When a visitor describes a business challenge, recommend the single best-fitting service from the four offered. For purely factual questions (e.g. address, hours, leadership, the contact form), answer directly and set suggestedService to null.

=== VERIFIED COMPANY FACTS ===
${COMPANY_KNOWLEDGE}
=== END FACTS ===

Be friendly and concise (max 70 words). Respond ONLY with JSON in this exact shape:
{"reply": string, "suggestedService": one of [${SERVICES.map((s) => `"${s}"`).join(', ')}] or null, "reason": short string or null}`;
  }

  // -------------------------------------------------------------- Gemini ---

  private async generate(prompt: string, json: boolean): Promise<string> {
    if (!this.client) throw new Error('Gemini disabled');
    const config = json
      ? { responseMimeType: 'application/json', temperature: 0.4 }
      : { temperature: 0.5 };
    // Try each model in order; only fall through to the next on failure.
    let lastErr: unknown;
    for (const model of this.models) {
      try {
        const response = await this.client.models.generateContent({ model, contents: prompt, config });
        return response.text ?? '';
      } catch (err) {
        lastErr = err;
        this.logger.warn(`Gemini model "${model}" failed: ${String(err)}`);
      }
    }
    throw lastErr ?? new Error('All Gemini models failed');
  }

  private leadPrompt(input: LeadAnalysisInput): string {
    return `You are a lead-qualification analyst for Crestview Group, a business consulting firm.
Analyse this inbound enquiry and respond with ONLY a JSON object of this exact shape:
{
  "summary": string,                 // 2-3 sentences summarising the prospect's situation
  "score": number,                   // 0-100 likelihood this is a high-value, ready-to-engage lead
  "reasons": string[],               // 3-5 short bullet phrases explaining the score
  "toneSignals": string[],           // 1-3 of: "Urgent","Growth Focused","Goal Oriented","Cost Conscious","Exploratory"
  "nextStep": string,                // one recommended next action for the sales team (1-2 sentences)
  "email": { "subject": string, "body": string }  // a warm 120-170 word follow-up email
}
Services offered: ${SERVICES.join(', ')}.
Prospect: ${input.fullName} at ${input.company} (${input.email}${input.phone ? ', ' + input.phone : ''}).
Service of interest: ${input.service || 'not specified'}.
Their message: """${input.message}"""`;
  }

  // ------------------------------------------------------------- Helpers ---

  private parseJson(text: string): any {
    if (!text) return null;
    let t = text.trim();
    // Strip ```json ... ``` fences if present.
    t = t.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    try {
      return JSON.parse(t);
    } catch {
      const first = t.indexOf('{');
      const last = t.lastIndexOf('}');
      if (first >= 0 && last > first) {
        try {
          return JSON.parse(t.slice(first, last + 1));
        } catch {
          return null;
        }
      }
      return null;
    }
  }

  private normalizeAnalysis(
    parsed: any,
    input: LeadAnalysisInput,
    aiPowered: boolean,
  ): LeadAnalysis {
    if (!parsed) return this.fallbackAnalysis(input);
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
    const email: LeadEmail =
      parsed.email && parsed.email.subject && parsed.email.body
        ? { subject: String(parsed.email.subject), body: String(parsed.email.body) }
        : this.fallbackEmail(input);
    return {
      summary: String(parsed.summary || this.fallbackSummary(input)),
      score,
      status: statusFromScore(score),
      reasons: this.toStringArray(parsed.reasons, 5),
      toneSignals: this.toStringArray(parsed.toneSignals, 3),
      nextStep: String(parsed.nextStep || this.fallbackNextStep(statusFromScore(score))),
      email,
      aiPowered,
    };
  }

  private toStringArray(value: any, max: number): string[] {
    if (!Array.isArray(value)) return [];
    return value.map((v) => String(v)).filter(Boolean).slice(0, max);
  }

  // -------------------------------------------------- Deterministic fallback ---

  private fallbackAnalysis(input: LeadAnalysisInput): LeadAnalysis {
    const text = input.message.toLowerCase();
    let score = 42;
    const reasons: string[] = [];
    const tones: string[] = [];

    const has = (re: RegExp) => re.test(text);

    if (has(/urgent|asap|immediately|deadline|quick|soon|time[- ]sensitive/)) {
      score += 14;
      tones.push('Urgent');
      reasons.push('Urgency signalled in the message');
    }
    if (has(/budget|invest|ready|decision|approve|ceo|owner|founder|director|board/)) {
      score += 15;
      reasons.push('Decision-making authority or budget implied');
    }
    if (has(/process|inefficien|struggl|problem|challenge|bottleneck|pain|issue/)) {
      score += 11;
      reasons.push('Specific business pain point described');
    }
    if (has(/scale|expand|grow|revenue|market|customer/)) {
      score += 10;
      tones.push('Growth Focused');
      reasons.push('Clear growth ambition');
    }
    if (has(/cost|reduce|save|efficien|cashflow|profit/)) {
      tones.push('Cost Conscious');
    }
    if (input.service) {
      score += 8;
      reasons.push(`Named a service of interest: ${input.service}`);
    }
    if (input.message.length > 160) {
      score += 7;
      reasons.push('Detailed, considered enquiry');
    }
    if (input.phone) score += 5;

    score = Math.max(20, Math.min(95, score));
    const status = statusFromScore(score);
    if (tones.length === 0) tones.push('Exploratory');
    if (reasons.length === 0) reasons.push('General enquiry — worth a qualifying conversation');
    reasons.push('Strong fit for consulting support');

    return {
      summary: this.fallbackSummary(input),
      score,
      status,
      reasons: reasons.slice(0, 5),
      toneSignals: [...new Set(tones)].slice(0, 3),
      nextStep: this.fallbackNextStep(status),
      email: this.fallbackEmail(input),
      aiPowered: false,
    };
  }

  private fallbackSummary(input: LeadAnalysisInput): string {
    const svc = input.service || this.inferService(input.message);
    return `${input.fullName} from ${input.company} reached out regarding ${svc.toLowerCase()}. Their message indicates a concrete business need that aligns with Crestview's advisory services and is worth qualifying with a discovery conversation.`;
  }

  private fallbackNextStep(status: string): string {
    if (status === 'Hot') return 'Schedule a discovery call within 48 hours while interest is high.';
    if (status === 'Warm') return 'Send a tailored follow-up and propose a short intro call this week.';
    return 'Add to nurture sequence and share a relevant case study to build engagement.';
  }

  private fallbackEmail(input: LeadAnalysisInput): LeadEmail {
    const service = input.service || this.inferService(input.message);
    return {
      subject: `${service} — let's talk, ${input.company}`,
      body: `Hi ${input.fullName.split(' ')[0] || input.fullName},

Thank you for reaching out to Crestview Group. Based on what you shared, it sounds like your organisation could benefit from a focused look at ${service.toLowerCase()}.

Our team helps businesses turn challenges like yours into clear, practical plans — and then supports you through delivery so the results actually land.

We'd love to learn more about your goals and discuss how we can help. Are you available for a short introductory call in the next few days?

Kind regards,
The Crestview Group Team`,
    };
  }

  private inferService(message: string): string {
    const t = message.toLowerCase();
    if (/market|expand|new region|country|scale|customer/.test(t)) return 'Market Entry & Growth';
    if (/process|operation|efficien|workflow|deadline|productiv|cost|approval/.test(t))
      return 'Operations & Process Improvement';
    if (/financ|cash|budget|forecast|invest|profit|revenue/.test(t))
      return 'Financial Advisory & Planning';
    return 'Business Strategy & Advisory';
  }

  /**
   * Answers a question directly from the website knowledge base, with no API
   * call. Returns null when the question isn't a known fact (so the caller can
   * fall through to Gemini). Never guesses a service recommendation here.
   */
  private localAnswer(message: string): ChatResult | null {
    const t = message.trim().toLowerCase();
    if (!t) return null;

    if (/contact form|fill .*form|is there a (contact )?form|enquiry form|how (do|can) i (get in touch|contact|reach)|get in touch|reach (you|out|your team)/.test(t)) {
      return {
        reply:
          "Yes — there's a contact form on our Contact page. Fill it in and our team will respond within a day. You can also email info@crestviewgroup.com or call +123 - 777 - 222 - 7272.",
      };
    }
    if (/office|address|located|location|where.*(you|crestview|office)|head ?office|hq|headquarter/.test(t)) {
      return {
        reply:
          "Crestview Group's office is at 16 Kofo Abayomi Street, Victoria Island, Lagos, Nigeria. It's our only office, and we serve clients across Africa.",
      };
    }
    if (/phone|call you|telephone|contact number|number to call|whatsapp/.test(t)) {
      return { reply: 'You can call us on +123 - 777 - 222 - 7272, Monday to Friday, 9:00 AM - 5:00 PM.' };
    }
    if (/\bemail\b|e-mail|mail you/.test(t)) {
      return { reply: 'You can email us at info@crestviewgroup.com — we aim to respond within a day.' };
    }
    if (/hours|opening time|when.*(open|closed)|are you open|working time/.test(t)) {
      return { reply: 'Our office hours are Monday to Friday, 9:00 AM - 5:00 PM.' };
    }
    if (/who.*(runs?|leads?|ceo|founder|owns?|manage)|leadership|management team|your team\b/.test(t)) {
      return {
        reply:
          'Our leadership team is John Alabi (CEO), Ann Daniel (Lead Strategist) and Danladi Jacob (Managing Partner).',
      };
    }
    if (/(what|which).*services?|services you (offer|provide)|what do you (do|offer)|list.*services?/.test(t)) {
      return {
        reply: `We offer four services: ${SERVICES.join(', ')}. Tell me about your challenge and I'll point you to the best fit.`,
      };
    }
    return null;
  }

  /** Graceful human handover when the AI can't respond (e.g. models rate-limited). */
  private humanHandover(): ChatResult {
    return {
      reply:
        "Our AI assistant is briefly unavailable right now, so I don't want to guess. For a quick response please use the contact form on our Contact page, or reach our team directly at info@crestviewgroup.com or +123 - 777 - 222 - 7272 — we usually reply within a day.",
    };
  }
}
