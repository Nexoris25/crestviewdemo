"use client";

import { useMemo, useState } from "react";
import { Container, ButtonLink } from "@/components/ui";
import { SendIcon, CheckCircleIcon, NamedIcon } from "@/components/icons";
import { SERVICES } from "@/lib/site";

interface Option {
  label: string;
  service: string;
}
interface Question {
  prompt: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    prompt: "What is your biggest business challenge right now?",
    options: [
      { label: "Expanding into new market", service: "market-entry-growth" },
      { label: "Growing revenue", service: "business-strategy-advisory" },
      { label: "Improving operations", service: "operations-process-improvement" },
      { label: "Financial planning", service: "financial-advisory-planning" },
      { label: "Others", service: "business-strategy-advisory" },
    ],
  },
  {
    prompt: "Which stage best describes your business?",
    options: [
      { label: "Early stage / finding direction", service: "business-strategy-advisory" },
      { label: "Growing but stretched thin", service: "operations-process-improvement" },
      { label: "Ready to scale into new markets", service: "market-entry-growth" },
      { label: "Established, optimising returns", service: "financial-advisory-planning" },
    ],
  },
  {
    prompt: "What outcome matters most over the next year?",
    options: [
      { label: "Clarity & a confident strategy", service: "business-strategy-advisory" },
      { label: "Efficiency & lower costs", service: "operations-process-improvement" },
      { label: "Reaching new customers", service: "market-entry-growth" },
      { label: "Financial stability & growth", service: "financial-advisory-planning" },
    ],
  },
];

/** Pick the service with the highest score; the stated challenge counts double. */
function recommend(choices: (Option | undefined)[]): string {
  const tally = new Map<string, number>();
  choices.forEach((choice, i) => {
    if (!choice) return;
    tally.set(choice.service, (tally.get(choice.service) ?? 0) + (i === 0 ? 2 : 1));
  });
  let best = SERVICES[0].slug;
  let bestScore = -1;
  for (const [slug, score] of tally) {
    if (score > bestScore) {
      best = slug;
      bestScore = score;
    }
  }
  return best;
}

export function ServiceRecommender() {
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<(Option | undefined)[]>(
    () => Array(QUESTIONS.length).fill(undefined),
  );
  const [note, setNote] = useState("");

  const total = QUESTIONS.length;
  const finished = step >= total;
  const current = QUESTIONS[step];
  const selected = choices[step];

  const result = useMemo(
    () => (finished ? SERVICES.find((s) => s.slug === recommend(choices)) : undefined),
    [finished, choices],
  );

  const choose = (option: Option) =>
    setChoices((prev) => prev.map((c, i) => (i === step ? option : c)));

  const restart = () => {
    setStep(0);
    setChoices(Array(QUESTIONS.length).fill(undefined));
    setNote("");
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Intro */}
          <div className="min-w-0 max-w-lg">
            <p className="eyebrow text-orange">AI service recommender</p>
            <h2 className="mt-3 font-serif text-2xl text-ink sm:text-3xl md:text-[2.25rem]">
              Let&apos;s find the right service for your business
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body">
              Answer a few questions and our AI adviser will recommend the best fit for your
              business.
            </p>
          </div>

          {/* Quiz card */}
          <div className="min-w-0 rounded-2xl bg-navy-deep p-6 text-white shadow-xl sm:p-8">
            {!finished ? (
              <>
                <p className="text-xs font-medium uppercase tracking-wide text-white/55">
                  Step {step + 1} of {total}
                </p>
                <div
                  className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-valuenow={step + 1}
                  aria-valuemin={1}
                  aria-valuemax={total}
                  aria-label="Quiz progress"
                >
                  <div
                    className="h-full rounded-full bg-orange transition-all"
                    style={{ width: `${((step + 1) / total) * 100}%` }}
                  />
                </div>

                <h3 className="mt-6 font-serif text-xl text-white">{current.prompt}</h3>

                <fieldset className="mt-5 space-y-3">
                  <legend className="sr-only">{current.prompt}</legend>
                  {current.options.map((opt) => {
                    const checked = selected?.label === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => choose(opt)}
                        aria-pressed={checked}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                          checked
                            ? "border-orange bg-orange/15 text-white"
                            : "border-white/15 bg-white/5 text-white/85 hover:border-white/40"
                        }`}
                      >
                        {opt.label}
                        {checked && <CheckCircleIcon className="h-5 w-5 shrink-0 text-orange" />}
                      </button>
                    );
                  })}
                </fieldset>

                <label className="mt-5 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                  <span className="sr-only">Tell us more (optional)</span>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tell us more... (optional)"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <SendIcon className="h-4 w-4 text-white/50" />
                </label>

                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!selected}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {step + 1 === total ? "See recommendation" : "Next"}
                </button>
              </>
            ) : (
              result && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/55">
                    Your recommended service
                  </p>
                  <span className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange/20 text-orange">
                    <NamedIcon name={result.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-serif text-2xl text-white">{result.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">{result.description}</p>
                  <ul className="mt-4 space-y-2">
                    {result.outcomes.map((o) => (
                      <li key={o} className="flex items-center gap-2 text-sm text-white/85">
                        <CheckCircleIcon className="h-4 w-4 shrink-0 text-orange" />
                        {o}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <ButtonLink href="/contact" variant="primary" className="w-full sm:w-auto">
                      Talk to an adviser
                    </ButtonLink>
                    <button
                      type="button"
                      onClick={restart}
                      className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      Start over
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
