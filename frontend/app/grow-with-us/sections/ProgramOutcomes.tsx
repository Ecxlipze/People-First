import Image from "next/image";
import { Reveal, Stagger } from "@/app/components/ScrollFx";

/* Grow With Us → "PROGRAM OUTCOMES". Deep-teal band with four translucent
   tiles in a 2×2 grid; each illustration overlaps the left edge of its tile and
   the copy sits to its right, with the key phrase in bold white. */
type Outcome = {
  prefix?: string;
  bold: string;
  rest: string;
  icon: string;
  alt: string;
};

const OUTCOMES: Outcome[] = [
  {
    prefix: "Ability to ",
    bold: "earn income remotely",
    rest: " through freelancing or digital business",
    icon: "/images/grow/out-earn.webp",
    alt: "",
  },
  {
    bold: "Improved employability",
    rest: " in technology and digital roles",
    icon: "/images/grow/out-employability.webp",
    alt: "",
  },
  {
    bold: "Real-world skills",
    rest: " aligned with current market demand",
    icon: "/images/grow/out-skills.webp",
    alt: "",
  },
  {
    bold: "Greater economic independence,",
    rest: " especially for women",
    icon: "/images/grow/out-independence.webp",
    alt: "",
  },
];

export default function ProgramOutcomes() {
  return (
    <section className="bg-[#087368] px-6 py-24 sm:px-10 sm:py-32 lg:px-24 xl:px-28">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-white sm:text-[2.5rem]">
            PROGRAM OUTCOMES
          </h2>
        </Reveal>

        {/* pl leaves room for the illustrations to hang off the left edge of
            each tile without clipping at the section boundary; the column gap
            must exceed that same overhang so the right column's illustration
            doesn't land on top of the left column's tile */}
        {/* Stagger so the 2×2 grid cascades instead of the four tiles fading in
            together. Each tile is wrapped so its entrance and hover transforms
            stay independent. */}
        <Stagger className="mt-16 grid gap-y-16 pt-8 sm:pl-12 md:mt-24 md:grid-cols-2 md:gap-x-20 md:pt-0 lg:gap-x-28">
          {OUTCOMES.map((o) => (
            <div key={o.bold}>
              <div className="group relative flex min-h-[10rem] flex-col items-center justify-center rounded-[1.25rem] bg-[#88b8b4] px-6 pb-8 pt-16 text-center transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-soft)] hover:-translate-y-1 sm:flex-row sm:justify-start sm:py-8 sm:pl-28 sm:pr-8 sm:text-left">
                {/* .pf-pop rather than a `group-hover:scale-105` utility: this
                    icon is vertically centred with -translate-y-1/2, which
                    compiles to the `translate` property. .pf-pop animates
                    `scale` on its own longhand, so the centring survives. */}
                <Image
                  src={o.icon}
                  alt={o.alt}
                  aria-hidden
                  width={640}
                  height={640}
                  className="pf-pop pointer-events-none absolute -top-12 left-1/2 h-24 w-auto -translate-x-1/2 select-none drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)] sm:-left-12 sm:top-1/2 sm:h-32 sm:-translate-x-0 sm:-translate-y-1/2 lg:-left-16 lg:h-36"
                />
                <p className="font-display text-[0.95rem] font-medium leading-snug text-white sm:text-[1.05rem] lg:text-lg">
                  {o.prefix}
                  <strong className="font-bold text-white">{o.bold}</strong>
                  {o.rest}
                </p>
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
