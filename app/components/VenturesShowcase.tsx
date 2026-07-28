"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { VENTURES } from "@/app/components/ventures";
import PinnedRecede from "@/app/components/PinnedRecede";
import {
  prefersReducedMotion,
  subscribeScrollFrame,
} from "@/app/lib/motion";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* Ventures section (3). Two jobs:
   1. It SWIPES UP over Featured Work (section 2) — the outer track carries the
      negative margin + rounded opaque bg + upward shadow (swipe-over recipe).
   2. It PINS itself (via PinnedRecede) so the NEXT section (Gallery, 4) can in
      turn swipe up over it, exactly like 1→2 and 2→3.
   Heading + cards scrub in as the block rises. */
export default function VenturesShowcase() {
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const cardsWrap = cardsRef.current;
    if (!heading || !cardsWrap) return;

    const cards = Array.from(
      cardsWrap.querySelectorAll<HTMLElement>("[data-card]"),
    );

    if (prefersReducedMotion()) {
      heading.style.opacity = "1";
      heading.style.transform = "none";
      heading.style.willChange = "auto";
      cards.forEach((c) => {
        c.style.opacity = "1";
        c.style.transform = "none";
        c.style.willChange = "auto";
      });
      return;
    }

    const update = () => {
      const vh = window.innerHeight;
      const headTop = heading.getBoundingClientRect().top;

      // heading reveals as the block rises into view.
      const hp = clamp01((vh * 0.9 - headTop) / (vh * 0.5));
      heading.style.opacity = String(hp);
      heading.style.transform = `translateY(${lerp(40, 0, hp)}px)`;

      // cards stagger in just after, each keyed to the grid's own arrival.
      const gridTop = cardsWrap.getBoundingClientRect().top;
      cards.forEach((c, i) => {
        const trigger = vh * 0.92 - i * 26;
        const cp = clamp01((trigger - gridTop) / (vh * 0.32));
        c.style.opacity = String(cp);
        c.style.transform = `translateY(${lerp(48, 0, cp)}px) scale(${lerp(
          0.92,
          1,
          cp,
        )})`;
      });
    };
    return subscribeScrollFrame(update);
  }, []);

  return (
    /* Outer track: negative margin + rounded opaque bg → swipes up over Featured
       Work. PinnedRecede inside gives Ventures its own pin so Gallery can later
       swipe over it. */
    <div className="relative z-20 rounded-t-[2rem] bg-[linear-gradient(135deg,#eef1fb_0%,#f4f1fc_50%,#f8f6fd_100%)] shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] max-md:-mt-8 sm:rounded-t-[3rem] md:-mt-[100vh]">
      <PinnedRecede className="relative flex flex-col items-center justify-center py-10 sm:py-14 lg:py-16">
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
            className="absolute left-6 top-10 w-20 select-none sm:left-12 sm:top-14 sm:w-28 lg:left-20"
          />
          <Image
            src="/images/icons/right-plane.png"
            alt=""
            width={256}
            height={227}
            className="absolute right-6 top-8 w-16 select-none sm:right-12 sm:top-10 sm:w-24 lg:right-56"
          />
        </div>

        {/* heading */}
        <div
          ref={headingRef}
          className="relative mx-auto max-w-3xl px-6 text-center"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          <h2 className="text-xl font-normal leading-snug tracking-tight text-[#2f7d78] sm:text-2xl lg:text-[1.8rem] lg:leading-snug">
            We shape <strong className="font-semibold">capable</strong>,{" "}
            <strong className="font-semibold">confident</strong>, and{" "}
            <strong className="font-semibold">market-ready</strong> individuals
            through comprehensive personal and professional growth. Through our
            core, joint, affiliated, and genesis ventures
          </h2>
        </div>

        {/* venture cards grid — staggers in */}
        <div
          ref={cardsRef}
          className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-2 gap-3.5 px-6 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:pr-32"
        >
          {VENTURES.map((v) => (
            <a
              key={v.name}
              href={v.href}
              data-card
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_10px_30px_-12px_rgba(80,80,120,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-14px_rgba(80,80,120,0.35)]"
            >
              {/* accent top strip */}
              <span
                aria-hidden
                style={{ backgroundColor: v.accent }}
                className="absolute inset-x-0 top-0 h-1"
              />

              {/* logo box — real logo once the file exists, else a soft box */}
              <div className="flex h-16 items-center justify-center overflow-hidden rounded-xl bg-zinc-50 px-3 ring-1 ring-inset ring-black/[0.04] sm:h-20">
                {v.logo && v.hasLogo ? (
                  <Image
                    src={v.logo}
                    alt={v.name}
                    width={200}
                    height={72}
                    className="h-full w-auto object-contain"
                  />
                ) : (
                  <span aria-hidden className="h-full w-full" />
                )}
              </div>

              <h3 className="mt-3.5 text-sm font-semibold leading-tight text-zinc-800 sm:text-base">
                {v.name}
              </h3>
              <p className="mt-1 text-[11px] leading-tight text-zinc-400 sm:text-xs">
                {v.tagline}
              </p>

              <span
                style={{ color: v.accent }}
                className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-semibold"
              >
                Explore Website
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </PinnedRecede>
    </div>
  );
}
