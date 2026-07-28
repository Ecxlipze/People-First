import Image from "next/image";
import { Box, Blocks } from "lucide-react";
import { Reveal } from "@/app/components/ScrollFx";
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
  return (
    <div
      /* the wash is the accent at 6% — the `/ca 0.060000` ExtGState the
         mockup applies to each of these cards */
      className="flex h-full flex-col items-center rounded-xl border px-5 py-7 text-center"
      style={{
        backgroundColor: `${tier.accent}0f`,
        borderColor: `${tier.accent}33`,
      }}
    >
      <div className="grid h-14 place-items-center">
        {tier.icon ? (
          <Image
            src={tier.icon}
            alt={tier.iconAlt ?? ""}
            aria-hidden={tier.iconAlt ? undefined : true}
            width={300}
            height={300}
            className="h-12 w-auto select-none"
          />
        ) : tier.name === "CORE VENTURES" ? (
          <Box
            className="h-11 w-11"
            style={{ color: tier.accent }}
            strokeWidth={2}
            aria-hidden
          />
        ) : (
          <Blocks
            className="h-11 w-11"
            style={{ color: tier.accent }}
            strokeWidth={2}
            aria-hidden
          />
        )}
      </div>

      <h3
        className="mt-5 text-[0.92rem] font-extrabold uppercase leading-tight tracking-wide"
        style={{ color: tier.accent }}
      >
        {tier.name}
      </h3>
      <p className="mt-4 text-[0.82rem] leading-relaxed text-zinc-600">
        {tier.blurb}
      </p>
    </div>
  );
}

export default function VenturesImpact() {
  return (
    <section className="relative z-20 -mt-6 overflow-hidden rounded-t-[2rem] bg-[linear-gradient(170deg,#fbf7ff_0%,#f9f5fe_45%,#f6f1fc_100%)] pb-24 pt-16 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:-mt-8 sm:rounded-t-[3rem] sm:pb-28 sm:pt-20">
      {/* soft cyan bloom, lower-right — the large blurred disc in the mockup */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(120,215,230,0.28)_0%,rgba(120,215,230,0)_70%)]"
      />

      {/* No right padding on the container — it would pull the centred
          headings off the page's true centre. The bands that actually sit
          under the icon rail reserve that room themselves. */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        {/* ── venture tiers ── */}
        <Reveal className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:pr-[11rem]">
          {VENTURE_TIERS.map((t) => (
            <TierCard key={t.name} tier={t} />
          ))}
        </Reveal>

        {/* ── results ──
            No `lg:pr` on the headings: reserving rail space here would shrink
            the box from the right and pull the centred text off the page's
            true centre. Only the bands that actually sit under the rail (the
            cards and grids below) carry the reservation. */}
        <Reveal className="mt-20 text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-[#1a1a2e] sm:text-2xl">
            Results Clients Can Expect
          </h2>
        </Reveal>

        {/* The mockup scatters these five rather than gridding them: the top
            row sits high, the bottom two are nudged inward and down. Below
            `md` that reads as noise, so they become a plain stack. */}
        <Reveal className="mt-10 lg:pr-[11rem]">
          <ul className="mx-auto grid max-w-5xl gap-x-8 gap-y-7 md:grid-cols-3">
            {RESULTS.map((r, i) => (
              <li
                key={r.text}
                className={`flex items-center gap-4 ${
                  /* items 4 and 5 form the offset lower row */
                  i === 3 ? "md:col-start-1 md:ml-[18%]" : ""
                } ${i === 4 ? "md:col-start-2 md:ml-[10%] md:mt-6" : ""}`}
              >
                <Image
                  src={r.icon}
                  alt=""
                  aria-hidden
                  width={320}
                  height={320}
                  className="h-14 w-14 shrink-0 select-none object-contain"
                />
                <p className="text-[0.82rem] font-bold leading-snug text-[#1a1a2e]">
                  {r.text}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── impact focus areas ── */}
        <Reveal className="mt-24 text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[#1a1a2e] sm:text-3xl">
            Impact Focus Areas
          </h2>
        </Reveal>

        {/* 3 across, then 2 centred beneath — the mockup's layout. The second
            row is centred by starting it in column 1 of a 4-col track at
            `md`… simpler: a second grid with its own max-width. */}
        <Reveal className="mt-12 lg:pr-[11rem]">
          <div className="mx-auto grid max-w-5xl items-stretch gap-5 md:grid-cols-3">
            {IMPACT_AREAS.slice(0, 3).map((a) => (
              <ImpactCard key={a.title} area={a} />
            ))}
          </div>
          <div className="mx-auto mt-5 grid max-w-3xl items-stretch gap-5 md:grid-cols-2">
            {IMPACT_AREAS.slice(3).map((a) => (
              <ImpactCard key={a.title} area={a} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ImpactCard({ area }: { area: (typeof IMPACT_AREAS)[number] }) {
  const featured = area.featured ?? false;
  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-lg px-5 pb-6 pt-5 shadow-[0_10px_30px_-18px_rgba(60,50,110,0.45)] ${
        featured ? "bg-[#090c62]" : "bg-white"
      }`}
    >
      {/* Icon top-right, inside the card. It is NOT absolutely positioned
          over the title: these are wide 3D renders and at this card width the
          longer titles ("Women's Financial Independence") run under them. The
          header row reserves the space instead. */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`text-[1.02rem] font-extrabold leading-tight ${
            featured ? "text-white" : "text-[#1a1a2e]"
          }`}
        >
          {area.title}
        </h3>
        <Image
          src={area.icon}
          alt=""
          aria-hidden
          width={480}
          height={480}
          className="-mt-1 h-16 w-16 shrink-0 select-none object-contain"
        />
      </div>

      <p
        className={`mt-3 text-[0.76rem] leading-relaxed ${
          featured ? "text-white/85" : "text-zinc-500"
        }`}
      >
        {area.blurb}
      </p>
    </div>
  );
}
