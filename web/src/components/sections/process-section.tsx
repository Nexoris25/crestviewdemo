import { Container, SectionHeading } from "@/components/ui";
import { NamedIcon } from "@/components/icons";
import type { ProcessStep } from "@/lib/site";

/**
 * Dark "How we work" band. `numbered` renders the home variant (oversized ghost
 * numerals); `icon` renders the services variant (icon badge + step number).
 */
export function ProcessSection({
  title,
  steps,
  variant,
}: {
  title: string;
  steps: ProcessStep[];
  variant: "numbered" | "icon";
}) {
  return (
    <section className="bg-navy-deep py-16 text-white sm:py-20 lg:py-24">
      <Container>
        <SectionHeading eyebrow="How we work" title={title} tone="light" />

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step) => (
            <li key={step.number} className="relative">
              {variant === "numbered" ? (
                <>
                  <span
                    aria-hidden
                    className="pointer-events-none block font-serif text-6xl font-semibold leading-none text-white/5"
                  >
                    {step.number}
                  </span>
                  <div className="-mt-7">
                    <h3 className="font-serif text-xl text-white">
                      <span className="mr-2 text-orange">{step.number}</span>
                      {step.title}
                    </h3>
                    {step.lead && (
                      <p className="mt-2 text-sm font-medium text-orange">{step.lead}</p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {step.description}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-orange">
                      {step.icon && <NamedIcon name={step.icon} className="h-5 w-5" />}
                    </span>
                    <span className="font-serif text-lg text-orange">{step.number}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-lg text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{step.description}</p>
                </>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
