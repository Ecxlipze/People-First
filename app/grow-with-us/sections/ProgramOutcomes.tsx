import Image from "next/image";
import { Reveal, Stagger } from "@/app/components/ScrollFx";

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
    <section className="bg-[#087368] px-6 py-28 sm:px-10 sm:py-32 lg:px-24 xl:px-28">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-[2.5rem]">
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
        <Stagger className="mt-20 grid gap-y-14 pl-10 sm:pl-14 md:grid-cols-2 md:gap-x-24 lg:gap-x-32">
          {OUTCOMES.map((o) => (
            <div key={o.lead}>
              <div className="group relative flex min-h-[10rem] items-center rounded-xl bg-[#88b8b4] py-8 pl-20 pr-8 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-soft)] hover:-translate-y-1 sm:pl-28">
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
                  className="pf-pop pointer-events-none absolute -left-10 top-1/2 h-28 w-auto -translate-y-1/2 select-none drop-shadow-[0_12px_20px_rgba(0,0,0,0.3)] sm:-left-16 sm:h-36"
                />
                <p className="text-base leading-snug text-white sm:text-xl">
                  <span className="font-bold text-white">{o.lead}</span>
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
