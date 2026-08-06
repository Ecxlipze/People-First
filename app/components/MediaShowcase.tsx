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

  return (
    <div ref={trackRef} className="relative w-full overflow-hidden pb-12 pt-8 sm:pb-16 sm:pt-16">
      <div
        ref={stageRef}
        className="flex w-full flex-col items-center justify-center"
      >
        <Reveal className="mb-6 px-6 text-center sm:mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-[2.6rem] lg:leading-[1.1]">
            Featured Work
          </h2>
          <p className="mt-2 text-lg text-zinc-700 sm:text-xl lg:text-[1.3rem] lg:leading-snug">
            Let’s give you exceptional reasons to choose us.
          </p>
        </Reveal>

        <div className="mx-auto grid w-full max-w-[56rem] items-center gap-8 px-6 sm:px-10 md:grid-cols-2 md:gap-12 lg:pr-32 xl:pr-40">
          {/* text */}
          <Reveal className="order-2 md:order-1 lg:pl-10 lg:pt-4">
            <div ref={textRef} className="max-w-[320px]">
              <h3 className="text-[2.2rem] font-bold leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl">
                Podcast: market<br />strategy
              </h3>
              <p className="mt-4 text-[14px] leading-snug text-gray-500">
                We are strategy consultants who work with startup strategies and
                help promote and sell your products, including helping marketing.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-4xl font-bold text-[#d73042] sm:text-4xl">
                  80%
                </span>
                <span className="text-[12px] font-semibold leading-tight text-zinc-500">
                  Increased
                  <br />
                  Performance Rate
                </span>
              </div>
            </div>
          </Reveal>

          {/* media */}
          <Reveal className="relative order-1 mx-auto w-full max-w-[260px] md:order-2">
            {/* Diffused cyan, purple, and pink glow behind the media frame. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-16 -z-10 bg-[radial-gradient(ellipse_at_50%_50%,rgba(100,200,230,0.5)_0%,rgba(180,130,240,0.4)_35%,rgba(230,130,180,0.3)_65%,transparent_75%)] opacity-100 blur-3xl"
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
            <div ref={mediaRef} className="relative">
              <MediaFrame
                src="/images/featured/feature1.webp"
                alt="A man working on a laptop during a late-evening podcast recording session"
              />
            </div>
            {/* StatCard positioned over the lower-left area of the image. */}
            <div
              ref={statRef}
              className="absolute -bottom-4 -left-6 z-20 sm:-bottom-6 sm:-left-8"
            >
              <StatCard variant="compact" value="27%" className="scale-95 origin-bottom-left">
                have knowledge about market strategies.
              </StatCard>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
