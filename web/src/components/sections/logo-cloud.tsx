import Image from "next/image";
import { Container } from "@/components/ui";

/* The actual "Logoipsum" placeholder partner logos from the Figma design. */
const LOGOS = [1, 2, 3, 4, 5, 6].map((n) => `/images/logos/partner-${n}.png`);

export function LogoCloud() {
  return (
    <section className="border-y border-line bg-white py-10" aria-label="Trusted by leading companies">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:justify-between">
          {LOGOS.map((src, i) => (
            <li key={src} className="shrink-0">
              <Image
                src={src}
                alt={`Partner company logo ${i + 1}`}
                width={170}
                height={60}
                className="h-9 w-auto opacity-70 transition-opacity hover:opacity-100 sm:h-10"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
