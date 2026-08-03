import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Reveal, Stagger } from "@/app/components/ScrollFx";
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
  /* Wrapper takes <Stagger>'s scroll transform; the card inside owns the hover
     lift. Same split as the pillar and tier cards. */
  return (
    <div className="h-full">
      <div className="pf-lift pf-sheen group relative flex h-full min-h-[31.25rem] flex-col overflow-hidden rounded-xl bg-[#f3f1f2] shadow-[0_12px_28px_-16px_rgba(35,25,45,0.4)]">
        <div className="flex min-h-0 flex-1 flex-col px-5 pb-2 pt-11">
          <div className="flex items-center gap-4 sm:mx-3">
            {/* The numbered disc scales up with the card, giving the stage number
                the same emphasis the icons get on the other card types. */}
            <span
              className="pf-pop grid h-14 w-14 shrink-0 place-items-center rounded-full text-xl font-bold text-white"
              style={{ backgroundColor: stage.pillBg }}
            >
              {stage.number}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-zinc-900">
                {stage.label}
              </p>
              <h3 className="mt-1 text-xl font-medium leading-tight text-zinc-950">
                {stage.headline}
              </h3>
            </div>
          </div>

          <p className="mt-7 text-[0.7rem] leading-relaxed text-zinc-800">
            {stage.rationale}
          </p>

          {stage.feature ? (
            /* MIND STAGE — one feature card, vertically centred in the space the
               other two columns fill with their venture lists */
            <div className="mt-1 flex min-h-0 flex-1 items-center sm:mx-12">
              <div
                className="w-full rounded-xl border bg-transparent px-5 py-6 text-center transition-colors duration-[var(--dur-base)]"
                style={{ borderColor: `${stage.pillBg}44` }}
              >
                <GraduationCap
                  className="pf-pop mx-auto h-9 w-9"
                  style={{ color: stage.pillBg }}
                  strokeWidth={2}
                  aria-hidden
                />
                <p
                  className="mt-5 text-base font-bold leading-tight"
                  style={{ color: stage.pillBg }}
                >
                  {stage.feature.name}
                </p>
                <p className="mt-5 text-[0.7rem] leading-relaxed text-zinc-600">
                  {stage.feature.blurb}
                </p>
              </div>
            </div>
          ) : (
            <ul className="mt-1 space-y-1.5 sm:mx-12">
              {stage.ventures.map((v) => (
                /* Each venture row nudges right and fills with a hint of its
                   border colour on hover, so the list reads as browsable rather
                   than as static bullet points. */
                <li
                  key={v.name}
                  className="rounded-lg border border-[#50b5bd] bg-transparent px-3 py-1.5 transition-[background-color,transform] duration-[var(--dur-base)] ease-[var(--ease-out-soft)] hover:translate-x-1 hover:bg-[#50b5bd]/10"
                >
                  <p className="text-[0.7rem] font-bold leading-tight text-zinc-950">
                    {v.name}
                  </p>
                  <p className="mt-0.5 text-[0.6rem] leading-snug text-zinc-600">
                    {v.blurb}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* outcome strip — full-bleed foot of the card */}
        <div
          className="mt-auto grid min-h-16 grid-cols-[auto_1fr] items-start gap-x-5 px-6 py-3 sm:px-8"
          style={{ backgroundColor: stage.outcome.bg }}
        >
          <p className="text-[0.72rem] font-extrabold uppercase tracking-wide text-zinc-950">
            Outcome:
          </p>
          <div>
            <p className="text-[0.78rem] font-bold leading-tight text-zinc-950">
              {stage.outcome.title}
            </p>
            <p className="mt-2 text-[0.62rem] leading-snug text-zinc-800">
              {stage.outcome.detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EvolutionPipeline() {
  return (
    <section className="relative z-30 overflow-hidden rounded-t-[2rem] bg-white pb-24 pt-16 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] sm:pb-28 sm:pt-20">
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
        className="pointer-events-none absolute right-0 top-0 hidden w-[37%] max-w-[525px] select-none md:block"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 sm:px-20">
        {/* ── intro ── left-aligned; the right half is the swoosh's space, so
            the copy is held to a column rather than centred */}
        <Reveal className="max-w-[720px]">
          <p className="text-base font-medium uppercase tracking-[0.06em] text-zinc-900 sm:text-lg">
            Brand Architecture
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.22] tracking-tight text-zinc-950 sm:text-5xl lg:text-[3.125rem]">
            The Three Dimensions of{" "}
            <span className="text-[#491557]">Holistic</span> Evolution
          </h2>
          <div
            aria-hidden
            className="mt-4 h-[3px] w-56 bg-[linear-gradient(90deg,#5d1a68_0%,rgba(93,26,104,0)_100%)]"
          />
          <p className="mt-7 text-base leading-[1.42] text-zinc-900 sm:text-[1.0625rem]">
            The People First Evolution Model divides development into three
            distinct operational circles — Physical, Mind, and Market — because
            true economic empowerment must mirror the natural progression of
            human capability.
          </p>
          <p className="mt-5 text-base leading-[1.42] text-zinc-900 sm:text-[1.0625rem]">
            We build the foundation, cultivate potential, and create the
            pathways that lead our people to lasting prosperity.
          </p>
        </Reveal>

        {/* ── purple banner ── */}
        <Reveal className="mt-12 sm:mx-8 sm:mt-10">
          <div className="pf-lift pf-sheen group relative overflow-hidden rounded-xl bg-[linear-gradient(100deg,#5d1a68_0%,#7a2585_55%,#8e2c96_100%)] px-5 py-7 shadow-[0_18px_44px_-24px_rgba(90,25,105,0.7)]">
            <div className="grid gap-7 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_minmax(0,1fr)] md:gap-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/what-we-do/s4/ecosystem-icon.webp"
                  alt=""
                  aria-hidden
                  width={248}
                  height={248}
                  className="pf-pop h-16 w-16 shrink-0 select-none lg:h-20 lg:w-20"
                />
                <h3 className="text-xl font-bold leading-tight text-white">
                  {ECOSYSTEM_BANNER.title}
                </h3>
              </div>

              {ECOSYSTEM_BANNER.columns.map((col, i) => (
                <p
                  key={col.slice(0, 24)}
                  /* hairline rule between the two text columns, as in the
                     mockup — only on the second, and only once they sit side
                     by side */
                  className={`text-sm leading-[1.55] text-white/90 ${
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
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl lg:text-[2.5rem]">
            Our Evolutionary Pipeline
          </h2>
        </Reveal>

        {/* Stagger so the three stages arrive left-to-right, which also reads as
            the pipeline's own order. */}
        <Stagger
          className="mt-20 grid items-stretch gap-8 md:grid-cols-3 lg:mt-28 lg:gap-10"
          step={80}
        >
          {PIPELINE.map((s) => (
            <StageCard key={s.number} stage={s} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
