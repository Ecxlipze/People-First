import Image from "next/image";
import { Reveal, Stagger } from "@/app/components/ScrollFx";
import {
  VENTURE_TIERS,
  RESULTS,
  IMPACT_AREAS,
  type VentureTier,
} from "@/app/what-we-do/ventures";

/* What We Do → venture tiers, client results and impact focus areas
   (SECTION 3).

   The third pane of the swipe-over stack: like SECTION 2 it is an opaque
   rounded block with an upward shadow and a negative top margin, so it rises
   over the section above it. Its z-index is one higher than SECTION 2's for
   the same reason.

   Three bands, in the mockup's order:
     1. four venture-tier cards
     2. "Results Clients Can Expect" — five items in a loose scatter
     3. "Impact Focus Areas" — five cards, 3 then 2, one of them filled navy

   Copy and colours both come straight out of the mockup; see ventures.ts. */

function TierCard({ tier }: { tier: VentureTier }) {
  /* Two elements, deliberately: the outer div owns <Stagger>'s viewport
     entrance and the inner card owns the hover lift. */
  return (
    <div className="h-full">
      <div
        /* the wash is the accent at 6% — the `/ca 0.060000` ExtGState the
           mockup applies to each of these cards */
        className="pf-lift group relative flex h-full flex-col items-center overflow-hidden rounded-xl border px-5 py-7 text-center xl:h-[20.833vw] xl:rounded-[0.83vw] xl:px-[1vw] xl:pt-[3.1vw]"
        style={{
          backgroundColor: `${tier.accent}0f`,
          borderColor: tier.accent,
        }}
      >
        <div
          role={tier.iconAlt ? "img" : undefined}
          aria-label={tier.iconAlt}
          aria-hidden={tier.iconAlt ? undefined : true}
          className="pf-pop h-12 w-12 shrink-0 select-none bg-current xl:h-[4.35vw] xl:w-[4.35vw]"
          style={{
            color: tier.accent,
            WebkitMaskImage: `url("${tier.icon}")`,
            maskImage: `url("${tier.icon}")`,
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />

        <h3
          className="mt-5 text-[0.92rem] font-display font-extrabold uppercase leading-tight tracking-wide xl:absolute xl:left-[0.5vw] xl:right-[0.5vw] xl:top-[10.2vw] xl:mt-0 xl:text-[1.25vw] xl:leading-[1.05]"
          style={{ color: tier.accent }}
        >
          {tier.name}
        </h3>
        <p className="mt-4 text-[0.82rem] leading-relaxed text-zinc-600 xl:absolute xl:left-[1vw] xl:right-[1vw] xl:top-[14.45vw] xl:mt-0 xl:text-[1.25vw] xl:leading-[1.3]">
          {tier.blurb}
        </p>
      </div>
    </div>
  );
}

export default function VenturesImpact() {
  return (
    /* Bottom padding is deliberately much smaller than the mockup's
       `18.75vw` (270px at 1440) and the `min-h-[131.51vw]` floor is gone.
       Both came from the flat mockup canvas, where nothing followed this
       section. On the live page the swipe-over pin already holds the section
       for a beat after its last card, so that mockup padding stacked on top
       of the pin and read as a large empty gap below "Impact Focus Areas"
       before the next section arrived. */
    <section className="relative z-20 overflow-hidden rounded-t-[2rem] bg-[linear-gradient(170deg,#fbf7ff_0%,#f9f5fe_45%,#f6f1fc_100%)] pb-24 pt-16 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] sm:pb-28 sm:pt-20 xl:pb-[7vw] xl:pt-[8.85vw]">
      {/* No right padding on the container — it would pull the centred
          headings off the page's true centre. The bands that actually sit
          under the icon rail reserve that room themselves. */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 xl:max-w-none xl:px-0">
        {/* ── venture tiers ── */}
        {/* Stagger, not Reveal: four cards side by side read as a slab when they
            fade in together, so each one comes in on its own slightly delayed
            ramp. */}
        <Stagger className="grid items-stretch gap-5 sm:grid-cols-2 xl:ml-[6.77vw] xl:w-[70.3125vw] xl:grid-cols-4 xl:gap-[2.604vw]">
          {VENTURE_TIERS.map((t) => (
            <TierCard key={t.name} tier={t} />
          ))}
        </Stagger>

        {/* ── results ──
            No `lg:pr` on the headings: reserving rail space here would shrink
            the box from the right and pull the centred text off the page's
            true centre. Only the bands that actually sit under the rail (the
            cards and grids below) carry the reservation. */}
        <Reveal className="mt-20 text-center xl:mt-[6vw]">
          <h2 className="text-xl font-display font-extrabold tracking-normal text-black sm:text-2xl xl:text-[1.667vw] xl:leading-none">
            Results Clients Can Expect
          </h2>
        </Reveal>

        {/* The mockup scatters these five rather than gridding them: the top
            row sits high, the bottom two are nudged inward and down. That
            composition needs the full reference width. Medium screens use a
            balanced 2 + 2 + 1 grid, and phones use a readable stack. */}
        {/* The <li>s are one level down inside the <ul>, so the stagger targets
            them by their data attribute rather than the default direct-child
            selector. At 1536px+ they are absolutely positioned in a scatter; a
            translateY on each is independent of that `left`/`top` placement. */}
        <Stagger
          className="mt-10 xl:mt-[4.45vw]"
          selector="[data-stagger]"
          step={45}
        >
          <ul className="mx-auto grid max-w-5xl gap-x-8 gap-y-7 sm:grid-cols-2 sm:justify-items-center min-[1536px]:relative min-[1536px]:h-[12.7vw] min-[1536px]:max-w-none min-[1536px]:translate-x-[2vw] min-[1536px]:grid-cols-3 min-[1536px]:gap-0">
            {RESULTS.map((r, i) => (
              <li
                key={r.text}
                data-stagger
                className={`group flex w-full items-center justify-center gap-4 sm:justify-self-center min-[1536px]:absolute min-[1536px]:max-w-[20.833vw] min-[1536px]:items-start min-[1536px]:justify-start min-[1536px]:justify-self-auto ${
                  /* items 4 and 5 form the offset lower row */
                  i === 0
                    ? "min-[1536px]:left-[10.52vw] min-[1536px]:top-0 min-[1536px]:gap-[0.78vw]"
                    : ""
                } ${
                  i === 1
                    ? "min-[1536px]:left-[40.83vw] min-[1536px]:top-0 min-[1536px]:gap-[0.78vw]"
                    : ""
                } ${
                  i === 2
                    ? "min-[1536px]:left-[64.64vw] min-[1536px]:top-0 min-[1536px]:gap-[1.35vw]"
                    : ""
                } ${
                  i === 3
                    ? "min-[1536px]:left-[23.85vw] min-[1536px]:top-[6.25vw] min-[1536px]:gap-[2.76vw]"
                    : ""
                } ${
                  i === 4
                    ? "sm:col-span-2 sm:justify-self-center min-[1536px]:col-auto min-[1536px]:left-[52.14vw] min-[1536px]:top-[6.25vw] min-[1536px]:justify-self-auto min-[1536px]:gap-[1.77vw]"
                    : ""
                }`}
              >
                <Image
                  src={r.icon}
                  alt=""
                  aria-hidden
                  width={320}
                  height={320}
                  className="pf-pop h-14 w-14 shrink-0 select-none object-contain min-[1536px]:mt-[1.2vw] min-[1536px]:h-[5.21vw] min-[1536px]:w-[5.21vw]"
                />
                <p className="max-w-72 text-[0.82rem] font-display font-bold leading-snug text-black min-[1536px]:max-w-[18vw] min-[1536px]:text-[1.146vw] min-[1536px]:leading-[1.25]">
                  {r.text}
                </p>
              </li>
            ))}
          </ul>
        </Stagger>

        {/* ── impact focus areas ── */}
        <Reveal className="mt-24 text-center xl:mt-[7.65vw]">
          <h2 className="text-2xl font-display font-extrabold uppercase tracking-normal text-black sm:text-3xl xl:text-[2.083vw] xl:leading-none">
            Impact Focus Areas
          </h2>
        </Reveal>

        {/* 3 across, then 2 centred beneath — the mockup's layout. The second
            row is centred by starting it in column 1 of a 4-col track at
            `md`… simpler: a second grid with its own max-width. */}
        {/* Each row staggers on its own so the cascade restarts on the second
            row, rather than the two rows sharing one long ramp that would leave
            the last card waiting well past the others. */}
        <div className="mt-12 xl:mt-[7.4vw]">
          <Stagger className="mx-auto grid max-w-5xl items-stretch gap-5 lg:grid-cols-3 lg:pr-[11rem] xl:relative xl:-left-[0.78vw] xl:w-[65.52vw] xl:max-w-none xl:gap-[1.56vw] xl:pr-0">
            {IMPACT_AREAS.slice(0, 3).map((a, index) => (
              <ImpactCard key={a.title} area={a} index={index} />
            ))}
          </Stagger>
          <Stagger className="mx-auto mt-5 grid max-w-3xl items-stretch gap-5 md:grid-cols-2 xl:relative xl:-left-[1.09vw] xl:mt-[1.72vw] xl:w-[43.23vw] xl:max-w-none xl:gap-[1.56vw]">
            {IMPACT_AREAS.slice(3).map((a, index) => (
              <ImpactCard key={a.title} area={a} index={index + 3} />
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

const impactIconClasses = [
  "xl:right-[0.52vw] xl:top-[0.63vw] xl:h-[6.88vw] xl:w-[6.88vw]",
  "xl:right-[0.52vw] xl:-top-[2.82vw] xl:h-[10.26vw] xl:w-[10.26vw]",
  "xl:-right-[1.56vw] xl:-top-[0.68vw] xl:h-[10.94vw] xl:w-[10.94vw]",
  "xl:right-[0.42vw] xl:top-[1.4vw] xl:h-[6.98vw] xl:w-[6.98vw]",
  "xl:right-[0.94vw] xl:top-[0.94vw] xl:h-[8.44vw] xl:w-[8.44vw]",
];

const impactTextClasses = [
  "xl:pr-[5.5vw]",
  "xl:pr-[1vw]",
  "xl:pr-[8.5vw]",
  "xl:pr-[5.5vw]",
  "xl:pr-[6.5vw]",
];

const impactTitleClasses = [
  "xl:max-w-[12vw]",
  "xl:max-w-[10vw]",
  "xl:max-w-[9.5vw]",
  "xl:max-w-[12vw]",
  "xl:max-w-[11vw]",
];

function ImpactCard({
  area,
  index,
}: {
  area: (typeof IMPACT_AREAS)[number];
  index: number;
}) {
  return (
    <div className="h-full">
      <div
        className={`pf-card group relative flex h-full flex-col overflow-hidden rounded-lg bg-white px-5 pb-6 pt-5 shadow-[0_10px_30px_-18px_rgba(60,50,110,0.45)] !transition-all !duration-500 ease-out hover:bg-[#090c62] hover:shadow-[0_20px_40px_-15px_rgba(9,12,98,0.35)] xl:overflow-visible xl:rounded-[0.83vw] xl:px-[1.56vw] xl:pb-[1.56vw] xl:pt-[1.5vw]`}
      >
        <div className="flex items-start justify-between gap-3 xl:min-h-[5.5vw]">
          <h3
            className={`relative z-10 text-[1.02rem] font-display font-extrabold leading-tight text-[#1a1a2e] !transition-colors !duration-500 ease-out group-hover:text-white xl:text-[1.354vw] xl:leading-[1.28] ${impactTitleClasses[index]}`}
          >
            {area.title}
          </h3>
          <Image
            src={area.icon}
            alt=""
            aria-hidden
            width={480}
            height={480}
            className={`pf-pop -mt-1 h-16 w-16 shrink-0 select-none object-contain !transition-all !duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1 xl:absolute xl:m-0 ${impactIconClasses[index]}`}
          />
        </div>

        <p
          className={`relative z-10 mt-3 text-[0.76rem] leading-relaxed text-zinc-500 !transition-colors !duration-500 ease-out group-hover:text-white/85 xl:mt-0 xl:text-[0.938vw] xl:leading-[1.35] ${impactTextClasses[index]}`}
        >
          {area.blurb}
        </p>
      </div>
    </div>
  );
}
