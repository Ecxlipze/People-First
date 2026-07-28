import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Reveal } from "@/app/components/ScrollFx";
import {
  PIPELINE,
  ECOSYSTEM_BANNER,
  type PipelineStage,
} from "@/app/what-we-do/pipeline";

/* What We Do → "The Three Dimensions of Holistic Evolution" (SECTION 4).

   Fourth pane of the swipe-over stack. Three parts, in the mockup's order:
     1. left-aligned intro with a purple swoosh in the top-right corner
     2. the purple "Building the Ecosystem Together" banner, two columns
        split by a hairline rule
     3. "Our Evolutionary Pipeline" — three stage cards (410×499 on a 1440
        canvas, equal columns) each ending in a coloured outcome strip

   The venture lists inside the cards are the same data section 2 renders as
   stage columns; see pipeline.ts. */

function StageCard({ stage }: { stage: PipelineStage }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-[#f7f7f9] shadow-[0_12px_36px_-20px_rgba(60,50,110,0.45)]">
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-5">
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[0.95rem] font-bold text-white"
            style={{ backgroundColor: stage.pillBg }}
          >
            {stage.number}
          </span>
          <div className="min-w-0">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-zinc-500">
              {stage.label}
            </p>
            <h3 className="text-[1.05rem] font-semibold leading-tight text-[#1a1a2e]">
              {stage.headline}
            </h3>
          </div>
        </div>

        <p className="mt-4 text-[0.72rem] leading-relaxed text-zinc-600">
          {stage.rationale}
        </p>

        {stage.feature ? (
          /* MIND STAGE — one feature card, vertically centred in the space the
             other two columns fill with their venture lists */
          <div className="mt-4 flex min-h-0 flex-1 items-center">
            <div
              className="w-full rounded-lg border bg-white px-4 py-5 text-center"
              style={{ borderColor: `${stage.pillBg}44` }}
            >
              <GraduationCap
                className="mx-auto h-6 w-6"
                style={{ color: stage.pillBg }}
                strokeWidth={2}
                aria-hidden
              />
              <p
                className="mt-2.5 text-[0.82rem] font-bold leading-tight"
                style={{ color: stage.pillBg }}
              >
                {stage.feature.name}
              </p>
              <p className="mt-2.5 text-[0.68rem] leading-relaxed text-zinc-500">
                {stage.feature.blurb}
              </p>
            </div>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {stage.ventures.map((v) => (
              <li
                key={v.name}
                /* the left rule is the accent tab the mockup puts on each row */
                className="rounded-md border border-l-4 border-zinc-200 bg-white px-3 py-2"
                style={{ borderLeftColor: stage.pillBg }}
              >
                <p className="text-[0.76rem] font-bold leading-tight text-[#1a1a2e]">
                  {v.name}
                </p>
                <p className="mt-1 text-[0.66rem] leading-snug text-zinc-500">
                  {v.blurb}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* outcome strip — full-bleed foot of the card */}
      <div
        className="mt-auto px-5 py-3.5"
        style={{ backgroundColor: stage.outcome.bg }}
      >
        <p className="text-[0.7rem] font-bold uppercase tracking-wide text-white/85">
          Outcome:{" "}
          <span className="normal-case text-white">{stage.outcome.title}</span>
        </p>
        <p className="mt-1 text-[0.62rem] leading-snug text-white/80">
          {stage.outcome.detail}
        </p>
      </div>
    </div>
  );
}

export default function EvolutionPipeline() {
  return (
    <section className="relative z-30 -mt-6 overflow-hidden rounded-t-[2rem] bg-white pb-24 pt-16 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:-mt-8 sm:rounded-t-[3rem] sm:pb-28 sm:pt-20">
      {/* purple swoosh, flush to the top-right corner as in the mockup — real
          artwork rather than a CSS approximation, since it carries fine line
          work a gradient can't reproduce. The asset is cropped to the corner
          and fades out along its own lower-left edge, so it needs no mask and
          sits at right-0/top-0.

          Converted straight from the supplied swoosh.png, which already has
          the correct orientation — no CSS transform, no re-cropping.

          Hidden below md, where it would crowd the heading. */}
      <Image
        src="/images/what-we-do/s4/swoosh.webp"
        alt=""
        aria-hidden
        width={525}
        height={352}
        className="pointer-events-none absolute right-0 top-0 hidden w-[46%] max-w-[620px] select-none md:block"
      />

      {/* Legibility scrim for the icon rail.

          The swoosh reaches the top-right corner, putting saturated purple
          behind the rail's top two labels — their default grey measures ~1.1:1
          there, i.e. invisible.

          This is a soft white radial centred on the rail band. It is strong at
          the corner where the artwork is densest and falls off quickly, so the
          labels clear 3:1 while the swoosh still reads as reaching the corner
          rather than being cut short by a hard fade.

          lg+ only: below that the rail is an off-canvas drawer with its own
          opaque background, so there is nothing to rescue. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 hidden h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.75)_45%,rgba(255,255,255,0)_72%)] lg:block"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        {/* ── intro ── left-aligned; the right half is the swoosh's space, so
            the copy is held to a column rather than centred */}
        <Reveal className="max-w-2xl">
          <p className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Brand Architecture
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#1a1a2e] sm:text-4xl lg:text-[2.6rem]">
            The Three Dimensions of{" "}
            <span className="text-[#491557]">Holistic</span> Evolution
          </h2>
          <p className="mt-6 text-[0.86rem] leading-relaxed text-zinc-600">
            The People First Evolution Model divides development into three
            distinct operational circles — Physical, Mind, and Market — because
            true economic empowerment must mirror the natural progression of
            human capability.
          </p>
          <p className="mt-4 text-[0.86rem] leading-relaxed text-zinc-600">
            We build the foundation, cultivate potential, and create the
            pathways that lead our people to lasting prosperity.
          </p>
        </Reveal>

        {/* ── purple banner ── */}
        <Reveal className="mt-12 lg:pr-[11rem]">
          <div className="overflow-hidden rounded-xl bg-[linear-gradient(100deg,#5d1a68_0%,#7a2585_55%,#8e2c96_100%)] px-7 py-8 shadow-[0_18px_44px_-24px_rgba(90,25,105,0.7)] sm:px-9">
            <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)] md:gap-8">
              <div className="flex items-center gap-4">
                <Image
                  src="/images/what-we-do/s4/ecosystem-icon.webp"
                  alt=""
                  aria-hidden
                  width={248}
                  height={248}
                  className="h-14 w-14 shrink-0 select-none"
                />
                <h3 className="text-[1.05rem] font-bold leading-tight text-white">
                  {ECOSYSTEM_BANNER.title}
                </h3>
              </div>

              {ECOSYSTEM_BANNER.columns.map((col, i) => (
                <p
                  key={col.slice(0, 24)}
                  /* hairline rule between the two text columns, as in the
                     mockup — only on the second, and only once they sit side
                     by side */
                  className={`text-[0.78rem] leading-relaxed text-white/85 ${
                    i === 1 ? "md:border-l md:border-white/25 md:pl-8" : ""
                  }`}
                >
                  {col}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── pipeline ── */}
        <Reveal className="mt-20 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a2e] sm:text-3xl lg:text-[2rem]">
            Our Evolutionary Pipeline
          </h2>
        </Reveal>

        <Reveal className="mt-12 grid items-stretch gap-6 md:grid-cols-3 md:gap-5 lg:pr-[11rem]">
          {PIPELINE.map((s) => (
            <StageCard key={s.number} stage={s} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
