"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { VENTURES } from "@/app/components/ventures";
import PinnedRecede from "@/app/components/PinnedRecede";
import { Reveal, Stagger } from "@/app/components/ScrollFx";

/* Ventures section (3). Two jobs:
   1. It SWIPES UP over Featured Work (section 2) — the outer track carries the
      negative margin + rounded opaque bg + upward shadow (swipe-over recipe).
   2. It PINS itself (via PinnedRecede) so the NEXT section (Gallery, 4) can in
      turn swipe up over it, exactly like 1→2 and 2→3.
   Heading + cards pop in as the block rises. */
export default function VenturesShowcase() {
  return (
    /* Outer track: negative margin + rounded opaque bg → swipes up over Featured
       Work. PinnedRecede inside gives Ventures its own pin so Gallery can later
       swipe over it. */
    <div className="pf-blend relative z-20 rounded-t-[2rem] bg-[#f2f8f8] shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] max-md:-mt-16 sm:rounded-t-[3rem] md:-mt-[100vh]">
      <PinnedRecede
        pinTallContent
        /* xl min-height was 73.385vw — the FULL height of the HOME3.pdf frame
           (1409 of 1920). But the design's frame includes 358pt of empty space
           below the last card row, because that is simply where the next Figma
           frame started; measured on the built page it left 284px (26.8% of the
           section) of dead whitespace under the cards. Trimming to 58vw keeps
           the heading and both card rows at their measured positions
           (cards end at 54.74vw) with a normal bottom margin instead. */
        className="pf-seam relative flex flex-col items-center justify-center py-10 sm:py-14 lg:py-16 xl:min-h-[58vw] xl:justify-start xl:py-0"
      >
        {/* decorative paper-plane pairs, flanking the heading in the top corners
            (matches the mockup). Purely aesthetic. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Plane geometry from the HOME3.pdf render (÷1.333 → 1440):
                left   x  84–314 (w 230), y  79–269
                right  x 1078–1274 (w 197), y 59–264
              Sized to those widths (16vw / 13.7vw). They sit OUTSIDE the
              heading's 4-line measure in the design; the earlier left-[1.48vw]
              put the left plane under the text once the heading was scaled up
              to its measured size. Both stay fully inside the frame. */}
          <Image
            src="/images/icons/left-plane.png"
            alt=""
            width={392}
            height={353}
            className="absolute left-[0.6vw] top-[5.5vw] hidden w-[16vw] select-none xl:block"
          />
          <Image
            src="/images/icons/right-plane.png"
            alt=""
            width={256}
            height={227}
            className="absolute right-[11.5vw] top-[4.1vw] hidden w-[13.7vw] select-none xl:block"
          />
        </div>

        {/* heading — one-shot arrival rather than the previous scroll scrub */}
        {/* Measured off the HOME3.pdf render (1920pt ÷1.333 → 1440):
              4 lines, widest 812px, cap-height ~36px, leading ~52.5px.
            The design's face is narrower than the site's at the same size, so
            matching its ~50px outright pushed the copy to 6 lines and ran it
            into the first card row. 3.05vw (~44px) is the largest size that
            still breaks into the design's FOUR lines inside a 62vw measure —
            line count and wrap shape matter more here than an exact px match.
            Container stays wide (62vw); at exactly the widest line's width
            there is zero slack and any metric difference forces a 5th line. */}
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center xl:mx-0 xl:ml-[10.5vw] xl:mt-[4.79vw] xl:w-[68vw] xl:max-w-none xl:self-start xl:px-0">
          <h2 className="font-heading text-xl font-normal leading-snug tracking-tight text-[#118d89] sm:text-2xl lg:text-[1.8rem] lg:leading-snug xl:text-[2.95vw] xl:leading-[1.2]">
            We shape <strong className="font-semibold">capable</strong>,{" "}
            <strong className="font-semibold">confident</strong>, and{" "}
            <strong className="font-semibold">market-ready</strong> individuals
            through comprehensive personal and professional growth. Through our
            core, joint, affiliated, and genesis ventures
          </h2>
        </Reveal>

        {/* venture cards grid — each card pops in on its own as it arrives.
            The <a> is wrapped: <Stagger> writes the entrance transform to its
            direct children, and the link already animates `transform` on hover —
            keeping them on separate elements stops the two from colliding. The
            wrapper carries the xl sizing so the flex layout is unchanged. */}
        <Stagger
          /* Gaps are equal on both axes below xl. At xl they are NOT equal in
             the design: measured on the HOME3.pdf render the column gap is 52pt
             (2.708vw → 39px @1440) but the ROW gap between the two card rows is
             70pt (3.646vw → 52.5px). An equal 2.708vw on both axes rendered the
             rows 13.5px too tight. */
          /* lg uses flex-wrap + justify-center rather than a 5-col grid so the
             second row of four centres under the first row of five, as in
             HOME3.pdf. A grid would left-align the orphan row. */
          /* xl track uses the design's EXACT proportions, measured off the
             HOME3.pdf render on its 1920pt frame:
               card 248 → 12.917vw    gap 52 → 2.708vw
               row block 1448 → 75.417vw, left margin 81 → 4.219vw
             5×12.917 + 4×2.708 = 75.417vw, i.e. the row fits the track exactly.
             The previous 13.02vw card against a 75.52vw track summed to 1087.43
             inside 1087.49 — about 0.06px of slack, so sub-pixel rounding forced
             a flex-wrap and the five-card row broke into uneven rows with white
             channels between them. Giving the track a hair more room than the
             cards need (75.6 vs 75.417) keeps the 5/4 split stable. */
          /* Two columns for the whole tablet/mobile range (the brief asks for a
             clean two-column grid there); the 5/4 design layout only applies
             from lg up, where there is room for five across. gap-4 on both axes
             keeps the horizontal and vertical gaps equal below xl. */
          className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-2 gap-4 px-6 sm:mt-8 lg:flex lg:flex-wrap lg:justify-center lg:gap-4 lg:pr-32 xl:absolute xl:left-[4.219vw] xl:top-[26.927vw] xl:mt-0 xl:w-[75.6vw] xl:max-w-none xl:gap-[2.708vw] xl:px-0 xl:pr-0"
          step={55}
        >
          {/* Wrapper carries an explicit basis at lg because the container is
              flex there (see the justify-center note above): five per row once
              the four 1rem gaps are subtracted. */}
          {VENTURES.map((v) => (
            <div
              key={v.name}
              /* 12.917 × 12.031vw = the design's 248 × 231 card (aspect 1.074). */
              className="lg:w-[calc((100%-4*1rem)/5)] lg:shrink-0 xl:h-[12.031vw] xl:w-[12.917vw]"
            >
            <a
              href={v.href}
              style={{ borderColor: v.accent }}
              className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-[#9b86a8] p-4 transition-all duration-300 hover:-translate-y-1 xl:rounded-[0.78vw] xl:px-[1.667vw] xl:pb-[1.04vw] xl:pt-[1.563vw]"
            >
              {/* Logo box — real logo once the file exists, else an empty plate.
                  #e9e9e9, sampled from HOME3.pdf: the grey plate IS in the
                  design (behind logos and on the logo-less cards alike), so
                  QA's "in design, grey bg is not present" does not hold once the
                  frame renders — it only looked absent because pdftocairo drops
                  most of that page. */}
              {/* The plate's own hairline is a faint VIOLET in the design
                  (#9c95e2 / #c8b2eb at its edges), constant across all nine
                  cards — not a tint of the card's accent colour, which is what
                  an inset ring of `v.accent` was drawing here. Plate height
                  checks out at 28% of the card (65px of 231px in the render),
                  which the xl track already matches. */}
              <div className="flex h-16 items-center justify-center overflow-hidden rounded-xl bg-[#e9e9e9] px-4 py-2 sm:h-20 xl:h-[3.438vw] xl:shrink-0 xl:rounded-[0.36vw] xl:px-[1vw] xl:py-[0.5vw]">
                {v.logo && v.hasLogo ? (
                  <Image
                    src={v.logo}
                    alt={v.name}
                    width={200}
                    height={72}
                    sizes="(min-width: 1280px) 10vw, (min-width: 640px) 25vw, 38vw"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span aria-hidden className="h-full w-full" />
                )}
              </div>

              <h3 className="font-heading mt-3.5 text-sm font-semibold leading-tight text-white sm:text-base xl:mt-[0.73vw] xl:text-[0.938vw] xl:leading-none">
                {v.name}
              </h3>
              <p className="font-body mt-1 text-[11px] leading-tight text-white/70 sm:text-xs xl:mt-[0.52vw] xl:text-[0.625vw] xl:leading-[1.2]">
                {v.tagline}
              </p>

              <span
                style={{ borderColor: v.accent }}
                /* whitespace-nowrap + a smaller face below sm: at 390px the
                   two-column card is ~163px wide and "Explore Website" was
                   wrapping to two lines, which cramped the button. */
                className="font-heading mt-auto flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-[11px] font-medium text-white/80 sm:px-4 sm:text-xs xl:h-[1.823vw] xl:min-h-0 xl:px-[1.04vw] xl:text-[0.573vw]"
              >
                Explore Website
                <ArrowRight className="ml-auto h-3.5 w-3.5 transition-transform group-hover:translate-x-1 xl:h-[0.73vw] xl:w-[0.73vw]" />
              </span>
            </a>
            </div>
          ))}
        </Stagger>
      </PinnedRecede>
    </div>
  );
}
