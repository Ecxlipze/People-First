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
    <div className="relative z-20 rounded-t-[2rem] bg-[#f2f8f8] shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] max-md:-mt-8 sm:rounded-t-[3rem] md:-mt-[100vh]">
      <PinnedRecede
        pinTallContent
        className="relative flex flex-col items-center justify-center py-10 sm:py-14 lg:py-16 xl:min-h-[73.385vw] xl:justify-start xl:py-0"
      >
        {/* decorative paper-plane pairs, flanking the heading in the top corners
            (matches the mockup). Purely aesthetic. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <Image
            src="/images/icons/left-plane.png"
            alt=""
            width={392}
            height={353}
            className="absolute left-[1.48vw] top-[2.9vw] hidden w-[20.42vw] select-none xl:block"
          />
          <Image
            src="/images/icons/right-plane.png"
            alt=""
            width={256}
            height={227}
            className="absolute right-[16.67vw] top-[1.9vw] hidden w-[13.33vw] select-none xl:block"
          />
        </div>

        {/* heading — one-shot arrival rather than the previous scroll scrub */}
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center xl:mx-0 xl:ml-[14.06vw] xl:mt-[4.79vw] xl:w-[60.42vw] xl:max-w-none xl:self-start xl:px-0">
          <h2 className="text-xl font-normal leading-snug tracking-tight text-[#118d89] sm:text-2xl lg:text-[1.8rem] lg:leading-snug xl:text-[2.604vw] xl:leading-[1.4]">
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
          className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-2 gap-3.5 px-6 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:pr-32 xl:absolute xl:left-[4.167vw] xl:top-[26.927vw] xl:mt-0 xl:flex xl:w-[75.52vw] xl:max-w-none xl:flex-wrap xl:justify-center xl:gap-x-[2.604vw] xl:gap-y-[3.646vw] xl:px-0 xl:pr-0"
          step={55}
        >
          {VENTURES.map((v) => (
            <div
              key={v.name}
              className="xl:h-[12.135vw] xl:w-[13.02vw] xl:shrink-0"
            >
            <a
              href={v.href}
              style={{ borderColor: v.accent }}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[linear-gradient(160deg,#9e8cb2_0%,#9a85a6_100%)] p-4 shadow-[0_10px_30px_-12px_rgba(80,80,120,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-14px_rgba(80,80,120,0.35)] xl:rounded-[0.78vw] xl:px-[1.667vw] xl:pb-[1.04vw] xl:pt-[1.563vw]"
            >
              {/* logo box — real logo once the file exists, else a soft box */}
              <div
                className="flex h-16 items-center justify-center overflow-hidden rounded-xl bg-[#f0f0f0] px-3 sm:h-20 xl:h-[3.438vw] xl:shrink-0 xl:rounded-[0.36vw] xl:px-[0.5vw]"
                style={{ boxShadow: `inset 0 0 0 1px ${v.accent}` }}
              >
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

              <h3 className="mt-3.5 text-sm font-semibold leading-tight text-white sm:text-base xl:mt-[0.73vw] xl:whitespace-nowrap xl:text-[0.938vw] xl:leading-none">
                {v.name}
              </h3>
              <p className="mt-1 text-[11px] leading-tight text-white/70 sm:text-xs xl:mt-[0.52vw] xl:text-[0.625vw] xl:leading-none">
                {v.tagline}
              </p>

              <span
                style={{ borderColor: v.accent }}
                className="mt-auto flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-xs font-medium text-white/80 xl:h-[1.823vw] xl:min-h-0 xl:px-[1.04vw] xl:text-[0.573vw]"
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
