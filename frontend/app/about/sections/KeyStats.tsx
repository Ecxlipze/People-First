import Image from "next/image";
import { CountUp, Reveal, Stagger } from "@/app/components/ScrollFx";

/* About → Key Stats. Plum/maroon panel: a "Trust & Credibility" pill, the
   KEY STATS heading (STATS in gold), supporting copy, and a set of light stat
   cards (a big 100+ card, then 25+ / 20+). Below: "Our Strategic Partners" as a
   continuously moving logo rail. */

const STATS = {
  big: { value: "100+", boldText: "Brands", lightText: "Supported" },
  small: [
    { value: "25+", boldText: "Years", lightText: "In Business" },
    { value: "20+", boldText: "Certified", lightText: "Experts" },
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
        <Stagger
          className="grid items-center gap-12 lg:grid-cols-[500px_minmax(0,1fr)] lg:gap-16 xl:gap-20"
          step={110}
        >
          {/* left: heading + copy */}
          <div>
            <span className="font-display inline-block rounded-sm bg-white px-3 py-1 text-sm font-bold uppercase tracking-wide text-[#67235c] sm:text-base">
              Trust &amp; Credibility
            </span>
            <h2 className="font-display mt-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">KEY </span>
              <span className="text-pf-gold">STATS</span>
            </h2>
            <p className="mt-6 max-w-md text-base font-normal leading-relaxed text-white/90 sm:text-lg lg:text-xl">
              Our client retention rate is among the highest in the industry,
              reflecting long-term partnerships built on consistent execution.
            </p>
          </div>

          {/* right: stat cards */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-center justify-between rounded-xl bg-white px-8 py-8 shadow-none sm:px-12 sm:py-10">
              <CountUp
                value={STATS.big.value}
                className="font-display block text-5xl font-bold text-[#67235c] sm:text-6xl lg:text-7xl"
              />
              <div className="flex flex-col text-left">
                <span className="font-display text-sm font-bold uppercase leading-tight text-zinc-900 sm:text-base">{STATS.big.boldText}</span>
                <span className="font-display text-sm font-medium uppercase leading-tight text-zinc-600 sm:text-base">{STATS.big.lightText}</span>
              </div>
            </div>
            <div className="grid gap-4 min-[420px]:grid-cols-2 sm:gap-6">
              {STATS.small.map((s) => {
                return (
                <div
                  key={s.boldText}
                  className="flex items-center justify-between gap-2 rounded-xl bg-white px-6 py-6 shadow-none sm:px-8 sm:py-8"
                >
                  <CountUp
                    value={s.value}
                    className="font-display text-4xl font-bold text-[#18007a] sm:text-5xl"
                  />
                  <div className="flex flex-col text-left">
                    <span className="font-display text-[11px] font-bold uppercase leading-tight text-zinc-900 sm:text-[13px]">{s.boldText}</span>
                    <span className="font-display text-[11px] font-medium uppercase leading-tight text-zinc-600 sm:text-[13px]">{s.lightText}</span>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </Stagger>

        {/* ── strategic partners ── */}
        <Reveal className="mt-20 sm:mt-28">
          <h3 className="font-display text-center text-3xl font-bold uppercase tracking-tight text-[#f6d9ff] sm:text-[2.65rem]">
            OUR STRATEGIC PARTNERS
          </h3>
          <div className="about-partner-marquee mt-12 flex flex-col gap-4 sm:gap-6">
            <div className="about-partner-track">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  role={copy === 0 ? "list" : undefined}
                  aria-label={
                    copy === 0 ? "People First strategic partners" : undefined
                  }
                  aria-hidden={copy === 1}
                  className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6"
                >
                  {PARTNERS.map((partner) => (
                    <div
                      key={`${copy}-${partner.name}`}
                      role={copy === 0 ? "listitem" : undefined}
                      className="group flex h-24 w-[220px] shrink-0 items-center justify-center bg-white px-6 shadow-sm sm:h-28 sm:w-[280px] lg:w-[320px]"
                    >
                      <Image
                        src={partner.logo}
                        alt={copy === 0 ? partner.name : ""}
                        width={337}
                        height={97}
                        className="max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div
              className="about-partner-track"
              style={{ animationDirection: "reverse" }}
            >
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  aria-hidden="true"
                  className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6"
                >
                  {[...PARTNERS.slice(2), ...PARTNERS.slice(0, 2)].map(
                    (partner, i) => (
                      <div
                        key={`rev-${copy}-${i}`}
                        className="group flex h-24 w-[220px] shrink-0 items-center justify-center bg-white px-6 shadow-sm sm:h-28 sm:w-[280px] lg:w-[320px]"
                      >
                        <Image
                          src={partner.logo}
                          alt=""
                          width={337}
                          height={97}
                          className="max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16"
                        />
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
