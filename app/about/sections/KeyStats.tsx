import Image from "next/image";
import { CountUp, Reveal } from "@/app/components/ScrollFx";

/* About → Key Stats. Plum/maroon panel: a "Trust & Credibility" pill, the
   KEY STATS heading (STATS in gold), supporting copy, and a set of light stat
   cards (a big 100+ card, then 25+ / 20+). Below: "Our Strategic Partners" as a
   grid of white logo cards. */

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
  {
    name: "National University of Computer & Emerging Sciences",
    logo: "/images/about-page/nu-logo.png",
  },
  {
    name: "FinTech News Pakistan",
    logo: "/images/about-page/Fintech-Logo.png",
  },
];

export default function KeyStats() {
  return (
    <section className="bg-pf-plum px-6 py-20 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* ── stats row ── */}
        <Reveal className="grid items-center gap-10 lg:grid-cols-2">
          {/* left: heading + copy */}
          <div>
            <span className="inline-block rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-pf-plum">
              Trust &amp; Credibility
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="text-white">KEY </span>
              <span className="text-pf-gold">STATS</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              Our client retention rate is among the highest in the industry,
              reflecting long-term partnerships built on consistent execution.
            </p>
          </div>

          {/* right: stat cards */}
          <div className="flex flex-col gap-4">
            {/* The three figures count up the first time they scroll into
                view — the payoff of a "Key Stats" panel is the numbers, so
                they earn the emphasis. */}
            <div className="pf-card rounded-2xl bg-white px-7 py-8 text-right shadow-xl">
              <CountUp
                value={STATS.big.value}
                className="block text-5xl font-extrabold text-pf-plum sm:text-6xl"
              />
              <span className="mt-1 block text-sm font-semibold text-zinc-500">
                {STATS.big.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.small.map((s) => (
                <div
                  key={s.label}
                  className="pf-card flex items-center justify-between gap-2 rounded-2xl bg-white px-5 py-5 shadow-xl"
                >
                  <CountUp
                    value={s.value}
                    className="text-3xl font-extrabold text-pf-plum sm:text-4xl"
                  />
                  <span className="text-right text-xs font-semibold leading-tight text-zinc-500">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── strategic partners ── */}
        <Reveal className="mt-16 sm:mt-20">
          <h3 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            OUR STRATEGIC PARTNERS
          </h3>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {PARTNERS.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="pf-card flex h-24 items-center justify-center rounded-xl bg-white px-5 shadow-md"
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={220}
                  height={80}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            ))}
            {/* trailing empty cell — mirrors the mockup's 2×4 grid with a gap */}
            <div aria-hidden className="hidden sm:block" />
            <div aria-hidden className="hidden sm:block" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
