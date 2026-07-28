import Image from "next/image";
import { Reveal } from "@/app/components/ScrollFx";

/* Grow With Us → "PROGRAM OUTCOMES". Deep-teal band with four translucent
   tiles in a 2×2 grid; each illustration overlaps the left edge of its tile and
   the copy sits to its right, with the key phrase in bold white. */
type Outcome = {
  /* `lead` is the bolded phrase, `rest` the remainder of the sentence */
  lead: string;
  rest: string;
  icon: string;
  alt: string;
};

const OUTCOMES: Outcome[] = [
  {
    lead: "Ability to earn income remotely",
    rest: " through freelancing or digital business",
    icon: "/images/grow/out-earn.webp",
    alt: "",
  },
  {
    lead: "Improved employability",
    rest: " in technology and digital roles",
    icon: "/images/grow/out-employability.webp",
    alt: "",
  },
  {
    lead: "Real-world skills",
    rest: " aligned with current market demand",
    icon: "/images/grow/out-skills.webp",
    alt: "",
  },
  {
    lead: "Greater economic independence,",
    rest: " especially for women",
    icon: "/images/grow/out-independence.webp",
    alt: "",
  },
];

export default function ProgramOutcomes() {
  return (
    <section className="bg-[#0d6b5c] px-6 py-20 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]">
            PROGRAM OUTCOMES
          </h2>
        </Reveal>

        {/* pl leaves room for the illustrations to hang off the left edge of
            each tile without clipping at the section boundary; the column gap
            must exceed that same overhang so the right column's illustration
            doesn't land on top of the left column's tile */}
        <Reveal className="mt-16 grid gap-y-12 pl-10 sm:pl-14 md:grid-cols-2 md:gap-x-20 lg:gap-x-24">
          {OUTCOMES.map((o) => (
            <div
              key={o.lead}
              className="group relative flex min-h-[6.5rem] items-center rounded-lg bg-white/15 py-6 pl-16 pr-6 backdrop-blur-[1px] transition-transform duration-300 hover:-translate-y-1 sm:pl-20"
            >
              <Image
                src={o.icon}
                alt={o.alt}
                aria-hidden
                width={640}
                height={640}
                className="pointer-events-none absolute -left-10 top-1/2 h-[5.5rem] w-auto -translate-y-1/2 select-none drop-shadow-[0_12px_20px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105 sm:-left-14 sm:h-[6.5rem]"
              />
              <p className="text-[0.9rem] leading-snug text-white/85 sm:text-[0.95rem]">
                <span className="font-bold text-white">{o.lead}</span>
                {o.rest}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
