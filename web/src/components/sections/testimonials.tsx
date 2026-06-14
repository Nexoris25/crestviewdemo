"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, SectionHeading } from "@/components/ui";
import { QuoteIcon } from "@/components/icons";
import { TESTIMONIALS } from "@/lib/site";

function Card({ index }: { index: number }) {
  const t = TESTIMONIALS[index];
  return (
    <figure className="flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-[0_12px_30px_-18px_rgba(5,13,66,0.25)]">
      <QuoteIcon className="h-7 w-7 text-orange/80" />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-body">
        {t.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <Image
          src={t.avatar}
          alt={t.name}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
        />
        <span>
          <span className="block text-sm font-semibold text-ink">{t.name}</span>
          <span className="block text-xs text-muted">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Clients success stories"
          title="Real results. Lasting partnerships."
        />

        {/* Desktop / tablet: full grid. */}
        <ul className="mt-12 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((_, i) => (
            <li key={i}>
              <Card index={i} />
            </li>
          ))}
        </ul>

        {/* Mobile: one card with dot controls. */}
        <div className="mt-10 sm:hidden">
          <Card index={active} />
          <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Testimonials">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all ${
                  active === i ? "w-6 bg-orange" : "w-2.5 bg-line"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
