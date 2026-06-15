import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui";

/**
 * Full-bleed hero used at the top of every page. A photographic background sits
 * under a navy gradient scrim so foreground copy always meets contrast targets.
 */
export function PageHero({
  image,
  imageAlt,
  eyebrow,
  title,
  priority = false,
  size = "standard",
  scrollHint,
  children,
}: {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  priority?: boolean;
  size?: "standard" | "tall";
  scrollHint?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className={`relative isolate flex w-full items-center overflow-hidden bg-navy-deep text-white ${
        size === "tall"
          ? "min-h-[34rem] sm:min-h-[38rem]"
          : "min-h-[24rem] sm:min-h-[28rem]"
      }`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-deep/65 via-navy-deep/35 to-navy-deep/70"
        aria-hidden
      />

      <Container className="py-20 text-center">
        <p className="eyebrow text-orange">{eyebrow}</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {children && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            {children}
          </div>
        )}
      </Container>

      {scrollHint && (
        <p className="eyebrow absolute inset-x-0 bottom-5 text-center text-white/70">
          {scrollHint}
        </p>
      )}
    </section>
  );
}
