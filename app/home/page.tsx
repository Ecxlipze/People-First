import Link from "next/link";
import Image from "next/image";
import SideNav from "@/app/components/SideNav";
import FeaturedWork from "@/app/components/FeaturedWork";
import VenturesShowcase from "@/app/components/VenturesShowcase";
import GalleryShowcase from "@/app/components/GalleryShowcase";
import TestimonialsShowcase from "@/app/components/TestimonialsShowcase";
import EcosystemShowcase from "@/app/components/EcosystemShowcase";
import StoryShowcase from "@/app/components/StoryShowcase";
import { Recede } from "@/app/components/ScrollFx";
import HeroCTA from "@/app/components/HeroCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore the People First ecosystem. Discover our ventures, featured work, community, and growth opportunities.",
  alternates: {
    canonical: "/home",
  },
};

export default function HomePage() {
  return (
    <>
      {/* right vertical navbar — fixed z-[100], persists visibly across every section */}
      <SideNav />

      <div className="relative overflow-x-clip bg-[linear-gradient(135deg,#e6ebfb_0%,#f1eefb_38%,#f6f3fc_70%,#f7f5fd_100%)]">
        {/* ── SECTION 1: HERO ──
          Pinned to the top so the next section slides up and overlaps it.
          The tall track gives the sticky hero room to pin while FeaturedWork
          swipes up over it by one viewport at every responsive size. */}
        <div className="relative max-md:h-auto md:h-[200vh]">
          <section className="bg-hero-gradient max-md:relative md:sticky md:top-0 h-[100svh] overflow-hidden md:h-screen">

            {/* ── Decorative pattern band ──
                One image carrying all four of the design's background graphics
                (the two paper planes, the purple dot and the crimson dot) plus
                the faint swoosh lines, baked in at fixed relative positions.

                Placement is measured, not guessed. Locating each element inside
                pattern.png by colour and least-squares fitting those positions
                against the same elements' ink boxes in HOME1.pdf gives a single
                best placement of full width at top 47% — which is where the
                `top` values below come from. (The band cannot be made to match
                the mockup element-for-element: the design draws the planes ~1.6×
                larger relative to the dots than this artwork does, so ~80px of
                per-element residual is inherent to the asset and not something
                any placement can remove. 47% is the optimum; see the report.)

                Below md the band sits in the empty gap BETWEEN the "Learn × Grow
                × Lead" row and the CTA buttons — that gap is the only place on a
                phone with room for it. It used to be anchored by its TOP edge at
                55%, so as the viewport narrowed its height grew with its width
                and pushed up through the paragraph and the Learn row; at 320×568
                it intruded ~40px into the copy (HOM-03).

                Anchoring is `bottom-[76px]`, i.e. measured up from the CTA row
                (which occupies the bottom ~60px) rather than down from the top.
                Anchoring downward cannot work: the copy block is a fixed ~355px
                tall regardless of viewport height, so any fixed top offset that
                clears it on a 568px-tall screen runs straight into the buttons on
                a taller one, and vice versa. Growing upward from the buttons
                clears both ends at every size from 320×568 to 430×932 (verified;
                worst copy clearance +14px at 320×568).

                Width is 160% of the viewport, not 100%. The artwork is a very
                wide 4.16:1 band, so at full width it renders only 77–99px tall on
                a phone — which scales the planes to ~25px and the dots to ~8px,
                technically present but invisible, and squashed into the strip
                behind the buttons. That is why the pattern looked missing. At
                160% it is 123–165px tall with the planes at ~45px.

                Hidden under `max-height:500px`: at that height the copy alone
                fills ~300 of the ~480px available, leaving no decorative room —
                the same height at which the rest of the hero already collapses
                its type and padding. */}
            <Image
              src="/images/pattern.png"
              alt=""
              aria-hidden
              width={1923}
              height={462}
              priority
              className="animate-fade-in-up pointer-events-none absolute bottom-[76px] left-1/2 z-0 w-[160%] max-w-none -translate-x-1/2 select-none md:bottom-auto md:top-[52%] md:w-full md:max-w-[1350px] lg:top-[47%] [@media(max-height:500px)]:hidden"
            />

            <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 lg:pt-12 xl:px-28 xl:pt-14 [@media(max-height:500px)]:pt-4">
              <Link
                href="/"
                aria-label="People First — landing"
                className="group inline-flex min-h-11 items-center"
              >
                <Image
                  src="/images/logo.svg"
                  alt="People First"
                  width={398}
                  height={100}
                  priority
                  className="h-10 w-auto sm:h-12 lg:h-[52px] [@media(max-height:500px)]:h-9"
                />
              </Link>
            </header>

            <Recede>
              <main className="animate-fade-in-up relative z-10 w-full max-w-[92%] px-6 pb-40 pr-12 pt-6 sm:max-w-[min(56rem,72%)] sm:px-14 sm:pb-0 sm:pt-20 lg:pl-[80px] lg:pt-[100px] xl:pl-[100px] xl:pt-[100px] [@media(max-height:500px)]:pt-2">
                {/* `whitespace-nowrap` is scoped to lg and up — it is only
                    satisfiable there. The string needs 643px at the sm size
                    (60px) but the column is 349–536px wide from 640–1023px, and
                    322–386px against a 222–322px column on phones, so below lg
                    nowrap forced a line 49–295px wider than its container. The
                    section is `overflow-hidden`, so that surplus was clipped
                    rather than scrolled: "Why Struggle Alone?" lost its tail off
                    the right edge. Letting it wrap naturally below lg matches the
                    mockup's own mobile view, which breaks after "Struggle".
                    At lg+ the full line fits (429px in a 601px column) so the
                    single-line desktop composition is unchanged. */}
                <h1 className="text-3xl font-bold leading-[1.1] tracking-tight min-[390px]:text-4xl sm:text-6xl lg:whitespace-nowrap lg:text-[2.5rem] xl:text-[2.85rem] [@media(max-height:500px)]:text-3xl">
                  <span className="text-[#feb7c1]">Why </span>
                  <span className="text-[#ade2dc]">Struggle Alone?</span>
                </h1>

                {/* #5661e8, sampled from the mockup's glyph interiors. The old
                    #4a65d6 was both darker and less saturated. */}
                <p className="mt-5 text-base font-medium leading-relaxed text-[#5661e8] sm:mt-6 sm:text-lg lg:mt-6 lg:text-[15px] lg:leading-relaxed xl:text-base [@media(max-height:500px)]:mt-3 [@media(max-height:500px)]:text-sm">
                  Isolation Breeds Failure. People First Rewrites the Script.
                  Together We <br className="hidden lg:block"/>Progress, Together We Win. Across your physical,
                  mind &amp; market journey
                </p>

                {/* The two "×" separators are NOT neutral grey in the design —
                    QA called this out directly ("the color of 'x' and Lead is
                    not same as in design"). Sampling the mockup shows each
                    separator takes the colour of the word that FOLLOWS it:
                    the first is #e2fe74 (matching Grow), the second #ade2dc
                    (matching Lead). They were both text-zinc-300 here.

                    "Grow" is #e2fe74, not #cbf34d — the design's lime is
                    lighter and less saturated than the value that was here. */}
                <p className="mt-4 flex items-center gap-1.5 whitespace-nowrap text-[15px] font-semibold text-[#feb7c1] sm:mt-5 sm:text-[17px] lg:mt-6 lg:text-lg xl:text-xl [@media(max-height:500px)]:mt-3 [@media(max-height:500px)]:text-sm">
                  <span>Learn</span>
                  <span className="mx-0.5 text-[#e2fe74]">x</span>
                  <span className="text-[#e2fe74]">Grow</span>
                  <span className="mx-0.5 text-[#ade2dc]">x</span>
                  <span className="text-[#ade2dc]">Lead</span>
                </p>
              </main>
            </Recede>

            {/* ── bottom-right CTAs ── */}
            <HeroCTA floating />
          </section>
        </div>

        {/* ── SECTION 2: FEATURED WORK ──
          Higher z-index + opaque bg + rounded top → swipes up over the hero. */}
        <FeaturedWork />

        {/* ── SECTION 3: VENTURES ──
          Opaque rounded block with a negative margin → swipes up over Featured
          Work; pins itself so Gallery can swipe over it in turn. */}
        <VenturesShowcase />

        {/* ── SECTION 4: GALLERY ──
          Opaque rounded block, negative margin → swipes up over the pinned
          Ventures section. Same effect as 1→2 and 2→3. */}
        <GalleryShowcase />

        {/* ── SECTION 5: TESTIMONIALS ──
          Opaque rounded block, negative margin → swipes up over the pinned
          Gallery section. Same swipe-over effect. */}
        <TestimonialsShowcase />

        {/* ── SECTION 6: ECOSYSTEM ──
          Opaque rounded block, negative margin → swipes up over the pinned
          Testimonials section. Left copy + right radial orbit of sectors. */}
        <EcosystemShowcase />

        {/* ── SECTION 7: THE STORY + FOOTER ──
          Opaque rounded block, negative margin → swipes up over the pinned
          Ecosystem section. Left founder story + right circular photo with an
          overlapping "born out of a simple conclusion" callout. The footer
          continues inside this final white panel. */}
        <StoryShowcase />
      </div>
    </>
  );
}
