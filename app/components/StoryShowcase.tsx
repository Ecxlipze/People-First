"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { User, Briefcase, Network } from "lucide-react";
import SiteFooter from "@/app/components/SiteFooter";
import {
  prefersReducedMotion,
  subscribeScrollFrame,
} from "@/app/lib/motion";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* Decorative background layer — the real design assets: the teal blob (with its
   baked-in dotted texture + swoosh curves) top-left, the purple blob bottom-right,
   and the faceted paper-plane pairs top-left and top-right, echoing the mockup.
   Purely aesthetic; sits behind the content and ignores pointer events. */
function Decor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* teal blob + dotted texture, top-left corner */}
      <Image
        src="/images/icons/blob3.png"
        alt=""
        width={739}
        height={552}
        className="absolute -left-4 -top-4 w-[42vw] max-w-[560px] select-none opacity-25 sm:-left-2 sm:-top-2 xl:opacity-100"
      />
      {/* purple blob + dotted texture, bottom-right corner */}
      <Image
        src="/images/icons/blob4.png"
        alt=""
        width={859}
        height={430}
        className="absolute -bottom-2 -right-2 w-[46vw] max-w-[640px] select-none opacity-25 xl:opacity-100"
      />
      {/* paper-plane pair, top-left (blue + teal, pointing down).
          The planes drift gently rather than sitting frozen — offset delays keep
          the two pairs from moving in lockstep. */}
      <Image
        src="/images/icons/left-plane.png"
        alt=""
        width={392}
        height={353}
        className="animate-floaty absolute left-6 top-24 hidden w-24 select-none sm:left-12 sm:top-28 sm:w-32 xl:block"
      />
      {/* paper-plane pair, top-right (teal + blue, pointing up) */}
      <Image
        src="/images/icons/right-plane.png"
        alt=""
        width={256}
        height={227}
        style={{ animationDelay: "-2s" }}
        className="animate-floaty absolute right-6 top-8 hidden w-20 select-none sm:right-10 sm:top-10 sm:w-24 xl:block"
      />
    </div>
  );
}

const GAPS = [
  { icon: User, plain: "A passionate young person", strong: "lacks guidance." },
  {
    icon: Briefcase,
    plain: "A skilled professional lacks a",
    strong: "Platform To Grow",
  },
  {
    icon: Network,
    plain: "A business owner lacks the",
    strong: "Network to scale.",
  },
];

/* Story section (7). Swipes up over the pinned Ecosystem section (6). It is the
   terminal homepage panel, so the footer continues inside the same white panel
   rather than becoming another pinned/swipe-over section. */
export default function StoryShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const wideDesktop = window.matchMedia("(min-width: 1280px)");

    const revealAll = () => {
      items.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
      });
    };

    if (prefersReducedMotion()) {
      revealAll();
      return;
    }

    const update = () => {
      // The one-column iPad/mobile layout is taller than the viewport. Keeping
      // desktop's opacity scrub there makes content near the lower edge look
      // disabled and leaves an apparent blank section. In normal-flow layouts,
      // keep every item readable and reserve the full scrub for wide desktop.
      if (!wideDesktop.matches) {
        revealAll();
        return;
      }

      const vh = window.innerHeight;
      items.forEach((el, i) => {
        const top = el.getBoundingClientRect().top;
        const p = clamp01((vh * 0.9 - top - i * 10) / (vh * 0.45));
        el.style.opacity = String(p);
        el.style.transform = `translateY(${lerp(34, 0, p)}px)`;
      });
    };
    const unsubscribe = subscribeScrollFrame(update);
    wideDesktop.addEventListener("change", update);
    return () => {
      wideDesktop.removeEventListener("change", update);
      unsubscribe();
    };
  }, []);

  return (
    <div className="relative z-[60] -mt-8 overflow-clip rounded-t-[2rem] bg-white shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] xl:-mt-[100vh]">
      <div className="relative flex items-center py-10 sm:py-12 md:min-h-screen">
        {/* decorative layer — pinned+receding with the content */}
        <Decor />
        <div
          ref={rootRef}
          className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-8 sm:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-16 lg:pr-32"
        >
          {/* ── left column: the story ── */}
          <div className="max-w-2xl">
            <h2
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="max-xl:!opacity-100 text-[2.2rem] font-extrabold leading-none tracking-tight text-[#1a1a2e] sm:text-[2.5rem]"
            >
              The Story
            </h2>
            <p
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="max-xl:!opacity-100 mt-3 text-xl font-semibold text-[#1a1a2e] sm:text-2xl"
            >
              Every Movement Begins with a Question.
            </p>

            {/* the founding question, as a quote bubble */}
            <div
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="max-xl:!opacity-100 relative mt-8"
            >
              {/* Quote mark sits OUTSIDE the bubble, overlapping its top-left
                  corner, as a solid #481456 double-prime — in HOME7.pdf it is
                  clearly above and left of the blue block rather than inline
                  beside it (QA: "position & style not same"). Sans-serif and
                  heavy, not the serif “ glyph used before. */}
              <span
                aria-hidden
                className="absolute -top-5 left-1 select-none text-[2.5rem] font-black leading-none tracking-tighter text-[#481456]"
              >
                &ldquo;
              </span>
              <p className="rounded-xl bg-[#d8eefe] px-5 py-3.5 text-base font-normal leading-snug text-[#491557] sm:text-lg">
                Why do so many talented people fail, even when they have passion
                and good intentions?
              </p>
            </div>

            <p
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="max-xl:!opacity-100 mt-4 text-sm leading-relaxed text-zinc-700 sm:text-base"
            >
              After more than 25 years working closely with entrepreneurs,
              students, farmers, and investors across diverse sectors, our
              founder, Rai Salahuddin Ahmad, realized that regardless of the
              industry, individuals consistently confront the same fundamental
              challenge:{" "}
              <span className="font-bold text-[#491557]">
                People are struggling alone.
              </span>
            </p>

            {/* The three gaps — bare thin-line icons (no circle). In HOME7.pdf
                the icon strokes sample as #481456 (the same purple as the quote
                mark), NOT the dark navy used here before, and the bold accent
                phrase is noticeably LARGER than the sentence it sits in rather
                than the same size (QA: "text color and icons not same"). */}
            <ul className="mt-5 flex flex-col gap-4">
              {GAPS.map(({ icon: GapIcon, plain, strong }) => (
                /* `group` only — no hover transform on the <li> itself: it
                   carries data-reveal, whose scrubber writes `transform` every
                   frame and would erase one. The icon inside is a separate
                   element, so it can animate freely. */
                <li
                  key={strong}
                  data-reveal
                  style={{ opacity: 0, willChange: "transform, opacity" }}
                  className="group max-xl:!opacity-100 flex items-center gap-3"
                >
                  <GapIcon
                    className="pf-pop h-7 w-7 flex-none text-[#481456] transition-colors duration-[var(--dur-base)] group-hover:text-[#6b2080]"
                    strokeWidth={1.5}
                  />
                  <p className="text-sm text-zinc-700 sm:text-base">
                    {plain}{" "}
                    <span className="text-base font-bold text-[#491557] sm:text-xl">
                      {strong}
                    </span>
                  </p>
                </li>
              ))}
            </ul>

            <p
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="max-xl:!opacity-100 mt-6 text-lg text-[#1a1a2e] sm:text-xl"
            >
              Talent is everywhere, but the{" "}
              <span className="font-bold text-[#491557]">
                ecosystem to sustain it is missing.
              </span>
            </p>
          </div>

          {/* ── right column: founder photo + conclusion callout ── */}
          <div
            data-reveal
            style={{ opacity: 0, willChange: "transform, opacity" }}
            className="max-xl:!opacity-100 relative mx-auto w-full max-w-[380px] pb-0 sm:pb-32"
          >
            {/* circular founder photo */}
            {/* No white ring: scanning down the photo's vertical centre in
                HOME7.pdf goes straight from page background into sky pixels
                with no intervening stroke (QA: "border not present in design"). */}
            <div className="relative aspect-square w-full overflow-hidden rounded-full shadow-[0_24px_60px_-20px_rgba(20,40,80,0.5)]">
              <Image
                src="/images/story/founder-cliff.webp"
                alt="A person in a suit standing on a cliff edge, looking out over a mountain valley at sunrise"
                fill
                sizes="(max-width: 1024px) 90vw, 440px"
                className="object-cover"
              />
            </div>

            {/* overlapping conclusion callout circle */}
            {/* Ring is #425e84 (slate blue) and ~5px, sampled by stepping out
                from the white disc's edge in HOME7.pdf — it was a 3px purple
                #4b2f8c here (QA: "border not same as in design"). */}
            <div className="relative z-10 -mt-12 flex min-h-[17rem] w-full flex-col items-center justify-center rounded-[2rem] border-[5px] border-[#425e84] bg-white px-5 py-6 text-center shadow-[0_18px_44px_-16px_rgba(30,20,80,0.4)] sm:absolute sm:bottom-0 sm:left-1/2 sm:mt-0 sm:aspect-square sm:min-h-0 sm:w-[76%] sm:-translate-x-1/2 sm:rounded-full sm:px-8 sm:py-0">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#1f6ea8_0%,#0f3d66_100%)] p-3">
                <Image
                  src="/images/peoplefirst.svg"
                  alt="People First"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain brightness-0 invert"
                />
              </span>
              <h3 className="mt-3 text-base font-bold text-[#491557] sm:text-lg">
                was born out of a simple conclusion:
              </h3>
              <p className="mt-2 text-[13px] font-semibold leading-snug text-zinc-800">
                People don&apos;t just need isolated education, funding, or jobs
              </p>
              <p className="mt-2 text-[12px] font-medium leading-snug text-[#00757e]">
                They need connections, opportunities, mentorship, and a unified
                platform where they can discover themselves, perform at their
                highest level, and build meaningful lives.
              </p>
              <span className="mt-2 select-none text-2xl font-serif font-bold leading-none text-[#00757e]">
                &rdquo;
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The footer is part of the terminal Story panel and follows it without
          a separate overlap, pin, shadow, or rounded-section transition. */}
      <SiteFooter />
    </div>
  );
}
