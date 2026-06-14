import { Container, SectionHeading } from "@/components/ui";
import { NamedIcon, CheckCircleIcon } from "@/components/icons";
import { SERVICES } from "@/lib/site";

export function ServicesGrid({ showOutcomes = false }: { showOutcomes?: boolean }) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Advisory services that drive measurable impact"
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service) => (
            <li
              key={service.slug}
              className="flex h-full flex-col rounded-xl border border-line bg-white p-6 transition-shadow hover:shadow-[0_12px_30px_-12px_rgba(5,13,66,0.18)]"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange/10 text-orange">
                <NamedIcon name={service.icon} className="h-6 w-6" />
              </span>

              <h3 className="mt-5 font-serif text-lg text-ink">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-body">{service.description}</p>

              {showOutcomes && (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="eyebrow text-orange">Key Outcomes</p>
                  <ul className="mt-3 space-y-2">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-center gap-2 text-sm text-body">
                        <CheckCircleIcon className="h-4 w-4 shrink-0 text-orange" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
