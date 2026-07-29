import Image from "next/image";
import { CountUp, Reveal } from "@/app/components/ScrollFx";

/* About → Key Stats. Plum/maroon panel: a "Trust & Credibility" pill, the
   KEY STATS heading (STATS in gold), supporting copy, and a set of light stat
   cards (a big 100+ card, then 25+ / 20+). Below: "Our Strategic Partners" as a
   continuously moving logo rail. */

const STATS = {
  big: { value: "100+", label: "Brands Supported" },
  small: [
    { value: "25+", label: "Years In Business" },
    { value: "20+", label: "Certified Experts" },
  ],
};

const PARTNERS: { name: string; logo: string }[] = [
  {
    name: "National University of Computer & Emerging Sciences",
    logo: "/images/about-page/nu-logo.png",
  },
  {
    name: "FinTech News Pakistan",
    logo: "/images/about-page/Fintech-Logo.png",
  },
  { name: "SkillX", logo: "/images/about-page/skiilx-logo.png" },
  { name: "KOT Enterprises", logo: "/images/about-page/kot-logo.png" },
];

export default function KeyStats() {
  return (
    <section className="bg-[#67235c] px-6 py-24 sm:px-10 sm:py-28 lg:px-24 xl:px-28">
      <div className="mx-auto max-w-[1440px]">
        {/* ── stats row ── */}
        <Reveal className="grid items-center gap-12 lg:grid-cols-[500px_minmax(0,1fr)] lg:gap-20">
          {/* left: heading + copy */}
          <div>
            <span className="inline-block rounded-sm bg-white px-3 py-1 text-sm font-bold uppercase tracking-wide text-[#67235c] sm:text-base">
              Trust &amp; Credibility
            </span>
            <h2 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-7xl">
              <span className="text-white">KEY </span>
              <span className="text-pf-gold">STATS</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/85 sm:text-[1.6rem] sm:leading-[1.35]">
              Our client retention rate is among the highest in the industry,
              reflecting long-term partnerships built on consistent execution.
            </p>
          </div>

          {/* right: stat cards */}
          <div className="flex flex-col gap-4">
            {/* The three figures count up the first time they scroll into
                view — the payoff of a "Key Stats" panel is the numbers, so
                they earn the emphasis. */}
            <div className="pf-card flex min-h-36 items-center justify-end rounded-2xl bg-[#f6f8ff] px-10 py-8 text-right shadow-xl">
              <CountUp
                value={STATS.big.value}
                className="block text-5xl font-extrabold text-[#67235c] sm:text-6xl"
              />
              <span className="ml-2 self-end pb-2 text-sm text-zinc-500">
                {STATS.big.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.small.map((s) => (
                <div
                  key={s.label}
                  className="pf-card flex min-h-28 items-center justify-between gap-3 rounded-2xl bg-[#f6f8ff] px-7 py-6 shadow-xl"
                >
                  <CountUp
                    value={s.value}
                    className="text-4xl font-extrabold text-[#18007a] sm:text-5xl"
                  />
                  <span className="text-right text-xs leading-tight text-zinc-500 sm:text-sm">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── strategic partners ── */}
        <Reveal className="mt-20 sm:mt-28">
          <h3 className="text-center text-3xl font-extrabold tracking-tight text-[#f6d9ff] sm:text-[2.65rem]">
            OUR STRATEGIC PARTNERS
          </h3>
          <div className="about-partner-marquee mt-12">
            <div className="about-partner-track">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  role={copy === 0 ? "list" : undefined}
                  aria-label={
                    copy === 0 ? "People First strategic partners" : undefined
                  }
                  aria-hidden={copy === 1}
                  className="flex shrink-0 gap-6 pr-6"
                >
                  {PARTNERS.map((partner) => (
                    <div
                      key={`${copy}-${partner.name}`}
                      role={copy === 0 ? "listitem" : undefined}
                      className="pf-card flex h-28 w-[250px] shrink-0 items-center justify-center bg-white px-7 shadow-md sm:h-32 sm:w-[310px] lg:w-[340px]"
                    >
                      <Image
                        src={partner.logo}
                        alt={copy === 0 ? partner.name : ""}
                        width={337}
                        height={97}
                        className="max-h-16 w-auto object-contain sm:max-h-20"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
