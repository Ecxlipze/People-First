import Image from "next/image";
import { Reveal, Stagger } from "@/app/components/ScrollFx";
import { PILLARS, type Pillar } from "@/app/what-we-do/pillars";

/* What We Do → "Brand Architecture" (SECTION 5).

   Final pane of the swipe-over stack: opaque rounded block, upward shadow,
   negative top margin, z-index one above the section before it.

   Layout follows the mockup's 1440×1304 canvas:
     · heading centred, flanked by hairline rules that fade out to each side
     · a purple swoosh bleeding off the TOP-LEFT corner (this section's is on
       the left; section 4's is on the right)
     · a 2×2 grid of 620×388 cards, fill #f3efef, each with a 19px accent bar
       down its left edge and an icon sitting beside the card heading

   Icons and swoosh are the mockup's own artwork, extracted from the PDF —
   the icons are custom marks (a cube, a bracket monogram, a node diagram, a
   DNA helix), so no icon-font lookalike would be faithful.

   Copy and the four accents live in pillars.ts. */

function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    /* `relative` + the absolutely-placed bar rather than a border-l: the
       mockup's bar is shorter than the card and rounded on its own, so it
       reads as a tab beside the card, not an edge of it.

       This outer element is also what <Stagger> writes its scroll transform to,
       which is why the hover lift lives on the inner card instead — one element
       cannot carry both without the scrub erasing the hover. */
    <div className="group relative h-full pl-2.5">
      {/* The accent tab grows to the card's full height on hover — a small
          confirmation that the card is the thing responding. */}
      <span
        aria-hidden
        className="absolute left-0 top-7 h-[45%] w-[11px] rounded-l-md transition-[height,top] duration-[var(--dur-base)] ease-[var(--ease-out-soft)] group-hover:top-4 group-hover:h-[calc(100%-2rem)]"
        style={{ backgroundColor: pillar.accent }}
      />

      <div className="pf-lift pf-sheen relative flex h-full flex-col overflow-hidden rounded-xl bg-[#f3efef] px-6 py-7 shadow-[0_16px_40px_-26px_rgba(60,50,110,0.5)] sm:px-7">
        {/* icon and heading share a row; the body copy below is indented to
            the heading's left edge, as in the mockup */}
        <div className="flex items-start gap-4">
          <Image
            src={`/images/what-we-do/s5/${pillar.icon}.webp`}
            alt=""
            aria-hidden
            width={256}
            height={256}
            className="pf-pop mt-0.5 h-12 w-12 shrink-0 select-none object-contain sm:h-[3.25rem] sm:w-[3.25rem]"
          />

          <div className="min-w-0 flex-1">
            <h3 className="text-[1.05rem] font-extrabold uppercase tracking-tight text-[#1a1a2e] sm:text-[1.15rem]">
              {pillar.name}
            </h3>

            <p className="mt-2.5 text-[0.78rem] leading-relaxed text-zinc-600">
              {pillar.definition}
            </p>

            <p className="mt-4 text-[0.82rem] font-bold text-[#471860]">
              Purpose:
            </p>
            <p className="mt-1.5 text-[0.78rem] leading-relaxed text-zinc-600">
              {pillar.purpose}
            </p>

            {pillar.examples && (
              <ul className="mt-4 space-y-1.5">
                {pillar.examples.map((ex) => (
                  <li key={ex} className="flex items-center gap-2.5">
                    {/* the mockup's plum check disc — a flat two-colour glyph,
                        so it is drawn rather than shipped as a raster */}
                    <svg
                      viewBox="0 0 20 20"
                      className="h-[1.05rem] w-[1.05rem] shrink-0"
                      aria-hidden
                    >
                      <circle cx="10" cy="10" r="10" fill="#471860" />
                      <path
                        d="M5.6 10.3 8.6 13.2 14.4 7.2"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[0.78rem] leading-snug text-zinc-700">
                      {ex}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* tagline pinned to the card foot so all four line up across the
            grid; centred, as the mockup has it */}
        <div className="mt-auto pt-8">
          {/* The rule is a `border-l` on the second half rather than a literal
              "|" glyph: when the two halves wrap onto separate lines a
              standalone pipe is left dangling at the end of the first. */}
          <div className="flex flex-wrap items-center justify-center gap-y-1 text-center text-[0.8rem] font-medium text-[#471860]">
            <span className={pillar.taglineSecond ? "px-3" : ""}>
              {pillar.tagline}
            </span>
            {pillar.taglineSecond && (
              <span className="border-zinc-400/70 px-3 max-sm:border-l-0 sm:border-l">
                {pillar.taglineSecond}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrandArchitecture() {
  return (
    <section className="relative z-40 overflow-hidden rounded-t-[2rem] bg-white pb-24 pt-16 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] sm:pb-28 sm:pt-20">
      {/* Corner swoosh — the mockup's own artwork, bleeding off the top-left.
          Extracted from the PDF and flipped vertically, because its placement
          matrix there has a negative height (d=-435.1); the stored raster is
          upside down relative to how the page draws it.

          Sized and offset from that same matrix: on the 1440 canvas the art
          spans x −78→502 and y −25→410, i.e. 580 wide (40.3% of the page)
          hanging 78px off the left edge and 25px off the top. Those negative
          insets are what let the blob run off-canvas instead of sitting as a
          complete shape inside the corner.

          The insets are expressed as a fraction of the *page* width (5.4% and
          1.7%), matching how they were measured — a percentage `top` would
          otherwise resolve against the section's height, which is far taller
          than the mockup canvas.

          Held behind the content (`z-10` on the container below) and hidden
          under md, where it would crowd the heading. */}
      <Image
        src="/images/what-we-do/s5/swoosh.webp"
        alt=""
        aria-hidden
        width={1100}
        height={826}
        className="pointer-events-none absolute -left-[5.4vw] -top-[1.7vw] hidden w-[40.3%] max-w-[580px] select-none md:block"
      />

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal className="text-center">
          {/* heading flanked by rules that fade outward — the mockup's are
              gradients running from #8454ff at the heading to transparent at
              the page edge, not solid hairlines.

              The rules are `flex-1` so they absorb the leftover width, which
              keeps the heading itself centred at any viewport. Below sm they
              are dropped: there is no leftover width to give them. */}
          <div className="flex items-center justify-center gap-5">
            <span
              aria-hidden
              className="hidden h-px flex-1 bg-[linear-gradient(to_right,rgba(132,84,255,0)_0%,rgba(132,84,255,0.85)_100%)] sm:block"
            />
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[#1a1a2e] sm:text-3xl lg:text-[2.4rem]">
              Brand Architecture
            </h2>
            <span
              aria-hidden
              className="hidden h-px flex-1 bg-[linear-gradient(to_left,rgba(132,84,255,0)_0%,rgba(132,84,255,0.85)_100%)] sm:block"
            />
          </div>

          <p className="mt-3 text-lg font-bold text-[#1a1a2e] sm:text-[1.4rem]">
            Building an Ecosystem, Not Just Businesses
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-[0.82rem] leading-relaxed text-zinc-600 sm:text-[0.86rem]">
            People First (Pvt) Ltd is a registered venture builder under the
            Securities and Exchange Commission of Pakistan (SECP). To scale
            seamlessly without sacrificing our community values, our corporate
            architecture is divided into four distinct pillars.
          </p>
        </Reveal>

        {/* The grid reserves rail space itself; the container above must not,
            or the centred heading would sit off the page's true centre. */}
        {/* Stagger so the four pillars arrive one after another rather than as a
            single 2×2 slab. */}
        <Stagger className="mt-14 grid items-stretch gap-8 md:grid-cols-2 md:gap-x-10 lg:pr-[11rem] sm:mt-16">
          {PILLARS.map((p) => (
            <PillarCard key={p.name} pillar={p} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
