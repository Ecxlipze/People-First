"use client";

import { useRef } from "react";
import Image from "next/image";
import { Reveal } from "@/app/components/ScrollFx";
import { MediaFrame, StatCard } from "@/app/components/media";

/* An Apple-style pinned scroll stage: the section holds in the middle of the
   viewport for a beat while, driven purely by scroll position, the media frame
   scales up, then the text and stat card fade/slide in as it settles. Releases
   into the next section once the track is scrolled through. */
export default function MediaShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  // Pinned scroll behavior removed to allow sections to flow naturally as compact blocks.

  // Bottom padding trimmed (was pb-12/pb-16) so Tech Events starts sooner after
  // this block — the two read as consecutive compact sections rather than
  // separate full-height stages. No min-h-screen/100vh is used here.
  return (
    <div ref={trackRef} className="relative w-full overflow-hidden pb-10 pt-6 sm:pb-14 sm:pt-10">
      <div
        ref={stageRef}
        className="flex w-full flex-col items-center justify-center"
      >
        {/* Header sits slightly tighter than the media block below it: a smaller
            heading/subtitle pair plus a reduced bottom gap pulls the podcast
            content up ~20px, matching the mockup's header-to-media rhythm. */}
        {/* Header metrics from home2.pdf (1920pt render ÷1.333):
              "Featured Work"  cap-band 48pt → ~50px, bold
              subtitle          band 38pt    → ~26px, regular
              heading→subtitle  162→194      → 24px  (mt-6)
              subtitle→content  231→325      → ~70px (mb-16)
            The subtitle previously sat flush against the podcast block; the
            design gives it ~70px of air. */}
        <Reveal className="mb-12 px-6 text-center sm:mb-16">
          <h2 className="text-[2.25rem] font-bold tracking-tight text-zinc-900 sm:text-[2.75rem] lg:text-[3.15rem] lg:leading-[1.1]">
            Featured Work
          </h2>
          <p className="mt-4 text-lg leading-snug text-zinc-700 sm:text-xl lg:mt-6 lg:text-[1.6rem]">
            Let’s give you exceptional reasons to choose us.
          </p>
        </Reveal>

        {/* Explicit column tracks instead of even halves, so the nowrap heading
            can never be squeezed under the photo (negative margins were tried
            here and caused exactly that: they move a column's CONTENT without
            resizing its track).

            Track widths and gap are taken from home2.pdf, measured off the
            1920pt render and scaled to 1440 (÷1.333):
              text column   x 234–625  → 293px
              gap           625 → 956  → 248px
              photo         x 956–1351 → 296px
            The gap is the single biggest correction: the columns had been sat
            almost flush, where the design gives them ~248px of separation. It
            steps down at md so tablets don't overflow. */}
        <div className="mx-auto grid w-full max-w-[56rem] items-center gap-8 px-6 sm:px-10 md:grid-cols-[293px_296px] md:justify-center md:gap-24 lg:gap-[15.5rem]">
          {/* text */}
          <Reveal className="order-2 md:order-1">
            <div ref={textRef} className="max-w-[320px] md:max-w-[293px]">
              {/* Exactly two lines: the first is held together by
                  whitespace-nowrap, the break before "strategy" is explicit. */}
              {/* 35px/41px from the mockup: cap-height 33pt → ~24.8px @1440,
                  ÷0.71 ≈ 35px; baselines 535→590 = 55pt → 41px leading. */}
              <h3 className="text-[2rem] font-bold leading-[1.17] tracking-tight text-zinc-900 sm:text-[2.19rem]">
                <span className="whitespace-nowrap">Podcast: market</span>
                <br />
                strategy
              </h3>
              {/* Paragraph baselines 669→693→716 = 24pt → 18px leading on a
                  ~14px face (1.28). */}
              <p className="mt-5 text-[14px] leading-[1.28] text-[#5b5b6b]">
                We are strategy consultants who work with startup strategies and
                help promote and sell your products, including helping marketing.
              </p>
              <div className="mt-7 flex items-center gap-3">
                <span className="text-[2rem] font-bold leading-none text-[#e23b4e]">
                  80%
                </span>
                <span className="text-[12px] font-semibold leading-[1.3] text-zinc-600">
                  Increased
                  <br />
                  Performance Rate
                </span>
              </div>
            </div>
          </Reveal>

          {/* media — slightly narrower than before (260→236px), so the frame's
              height drops while the portrait ratio is untouched (the aspect box
              derives its height from the width). */}
          <Reveal className="relative order-1 mx-auto w-full max-w-[260px] md:order-2 md:max-w-[296px]">
            {/* Glow. home2.pdf shows a halo AROUND the frame, not a wash over
                it: cyan up the top-left, purple down both sides, pink pooling
                below the photo. One centred radial can't express that (it puts
                every hue in concentric rings, which is what made the pink read
                as a solid patch), so it's three offset radials — each anchored
                where its colour belongs — layered and heavily blurred. Alphas
                stay low; the blur does the diffusion. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-20 z-0 bg-[radial-gradient(ellipse_60%_50%_at_22%_18%,rgba(90,200,235,0.55)_0%,transparent_70%),radial-gradient(ellipse_55%_65%_at_50%_105%,rgba(238,120,180,0.5)_0%,transparent_72%),radial-gradient(ellipse_75%_60%_at_50%_60%,rgba(168,120,240,0.4)_0%,transparent_75%)] opacity-90 blur-3xl"
            />
            {/* Paper-plane accent, top-right. */}
            <Image
              src="/images/icons/right-plane.png"
              alt=""
              aria-hidden
              width={358}
              height={302}
              className="animate-floaty pointer-events-none absolute -right-16 -top-12 z-20 hidden h-24 w-auto select-none object-contain sm:block"
            />
            {/* 0.698 aspect */}
            <div ref={mediaRef} className="relative z-10">
              <MediaFrame
                src="/images/featured/feature1.webp"
                alt="A man working on a laptop during a late-evening podcast recording session"
              />
            </div>
            {/* Card geometry from home2.pdf (@1440): 277×180, bottom edge
                FLUSH with the photo's bottom, overhanging the photo's left edge
                by ~151px of its 277px width (so ~126px sits over the photo).
                bottom-0 + -left-[9.4rem] reproduces that; it clears the centred
                play button and the subject's face. */}
            <div
              ref={statRef}
              className="absolute bottom-0 -left-4 z-20 sm:-left-10 md:-left-16 lg:-left-[9.4rem]"
            >
              <StatCard
                value="27%"
                fluidWidth
                className="w-[165px] sm:w-[190px] md:w-[220px] lg:w-[277px]"
              >
                have knowledge about market strategies.
              </StatCard>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
