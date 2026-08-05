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
              className="max-xl:!opacity-100 text-[2.2rem] font-extrabold leading-none tracking-tight text-black sm:text-[2.5rem]"
            >
              The Story
            </h2>
            <p
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="max-xl:!opacity-100 mt-3 text-xl font-semibold text-black sm:text-2xl"
            >
              Every Movement Begins with a Question.
            </p>

            {/* the founding question, as a quote bubble */}
            <div
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="max-xl:!opacity-100 relative mt-8"
            >
              {/* Quote mark sits OUTSIDE the bubble, above and left of its
                  top-left corner (QA: "position & style not same"). Measured in
                  HOME7.pdf: the glyph's ink box is x68–135 / y530–588 (68×59)
                  while the bubble runs x80.. / y552.., so it starts 12px LEFT of
                  the bubble edge and 22px ABOVE its top — about a 59px cap on the
                  1920 frame (~44px at 1440). Colour #481456, confirmed as the
                  modal glyph pixel. */}
              <span
                aria-hidden
                className="absolute -left-2 -top-6 select-none font-serif text-[2.75rem] font-bold leading-none tracking-tighter text-[#481456]"
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
              className="max-xl:!opacity-100 mt-4 text-sm leading-relaxed text-black sm:text-base"
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
                  <p className="text-sm text-black sm:text-base">
                    {plain}{" "}
                    <span className="font-bold text-[#491557]">
                      {strong}
                    </span>
                  </p>
                </li>
              ))}
            </ul>

            <p
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="max-xl:!opacity-100 mt-6 text-lg text-black sm:text-xl"
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
            /* max-w raised 380 → 460px. In HOME7 the photo disc is ~600px of a
               1920 frame (450px at 1440) and the callout is 75% of it; at 380px
               the callout came out only 285px, too small for the copy, which then
               overflowed the circle. */
            className="max-xl:!opacity-100 relative mx-auto w-full max-w-[460px] pb-0 sm:pb-40"
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

            {/* The ring is a GRADIENT, not a flat purple. Tracing the stroke
                down the circle in HOME7.pdf gives #444776 near the top, #407190
                at mid-height and #4fa0af at the bottom — purple-navy easing into
                teal. A flat #491557 border read as a different shape entirely.
                Rendered with a gradient background + an inset ring so the fill
                (#f6f6f6 in the design, not pure white) sits inside the stroke.
                Circle is 450px of the 1920 frame with a ~10px stroke. */}
            <div className="relative z-10 -mt-12 flex min-h-[17rem] w-full flex-col items-center justify-center rounded-[2rem] bg-[linear-gradient(180deg,#444776_0%,#407190_50%,#4fa0af_100%)] p-[5px] text-center shadow-[0_18px_44px_-16px_rgba(30,20,80,0.4)] sm:absolute sm:-bottom-12 sm:left-1/2 sm:mt-0 sm:aspect-square sm:min-h-0 sm:w-[75%] sm:-translate-x-1/2 sm:rounded-full">
              {/* `overflow-hidden` keeps this a true CIRCLE — without clipping,
                  the copy pushed the flex box taller than its aspect-square and
                  it rendered as an OVAL. The design's circle is 450px against the
                  ~600px photo (75%), which sm:w-[75%] matches; its content starts
                  ~8% down from the inner edge. */}
              <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[calc(2rem-5px)] bg-[#f6f6f6] px-5 py-6 sm:justify-start sm:rounded-full sm:px-[12%] sm:pb-0 sm:pt-[8%]">
              {/* Logo circle sits FULLY INSIDE the callout, near its top — 130px
                  of the 450px circle (29%). Cropping the mockup shows it clear of
                  the ring on all sides; an earlier reading of these coordinates
                  as "straddling the top edge" was wrong.
                  Same teal-blue gradient and light-on-dark logo as the Ecosystem
                  hub; `brightness-0 invert` on the old asset flattened it to a
                  white silhouette, losing the fan colours and teal "First". */}
              <span className="flex h-[29%] min-h-14 w-[29%] min-w-14 flex-none items-center justify-center rounded-full bg-[linear-gradient(135deg,#0286a4_0%,#035688_100%)]">
                <Image
                  src="/images/logo-light.webp"
                  alt="People First"
                  width={800}
                  height={184}
                  className="w-[84%] object-contain"
                />
              </span>
              {/* Inner type is sized to the content budget the design implies:
                  its three blocks occupy ~205px of a 450px circle (46%), so ours
                  must fit the same share of a smaller circle. */}
              <h3 className="mt-3 text-base font-bold leading-tight text-[#491557] sm:mt-2 sm:text-[15px]">
                was born out of a simple conclusion:
              </h3>
              <p className="mt-2 text-[13px] font-semibold leading-snug text-black sm:mt-1.5 sm:text-[12px]">
                People don&apos;t just need isolated education, funding, or jobs
              </p>
              <p className="mt-2 text-[12px] font-medium leading-snug text-[#00757e] sm:mt-1.5 sm:text-[11px] sm:leading-[1.35]">
                They need connections, opportunities, mentorship, and a unified
                platform where they can discover themselves, perform at their
                highest level, and build meaningful lives.
              </p>
              {/* Closing mark is a LEFT double-quote glyph in the design too (a
                  ‟ pair, not a ” — its ink box is 35×31 at x1236–1270), teal
                  #00747d, sitting under the paragraph inside the circle. */}
              <span className="mt-2 select-none font-serif text-2xl font-bold leading-none text-[#00747d]">
                &ldquo;
              </span>
              </div>
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
