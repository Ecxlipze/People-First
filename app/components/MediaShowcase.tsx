"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MediaFrame, StatCard } from "@/app/components/media";
import {
  prefersReducedMotion,
  subscribeScrollFrame,
} from "@/app/lib/motion";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
// remap a slice of overall progress [from,to] to 0..1
const slice = (p: number, from: number, to: number) =>
  clamp01((p - from) / (to - from));

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

  useEffect(() => {
    const track = trackRef.current;
    const media = mediaRef.current;
    const text = textRef.current;
    const stat = statRef.current;
    if (!track || !media || !text || !stat) return;

    // The pinned scale/fade stage runs from `md` (768px) up; phones keep normal
    // flow so nothing clips, while using a lighter element-by-element scrub.
    const desktop = window.matchMedia("(min-width: 768px)");

    const disable = () => {
      // No pinning: collapse the track and show everything in place.
      track.style.height = "auto";
      if (stageRef.current) {
        stageRef.current.style.height = "auto";
        stageRef.current.style.position = "static";
        stageRef.current.style.overflow = "visible";
        stageRef.current.style.alignItems = "stretch";
      }
    };

    // `unsubscribe` is non-null exactly while this section is subscribed to the
    // site-wide scroll frame. Sharing that one listener+RAF pair with every
    // other scroll effect (see app/lib/motion.ts) keeps a long page from
    // stacking up a listener per section.
    let unsubscribe: (() => void) | null = null;
    let pinned = false;
    const update = () => {
      const vh = window.innerHeight;

      if (pinned) {
        const r = track.getBoundingClientRect();
        const distance = r.height - vh; // scroll travelled while pinned
        const p = distance > 0 ? clamp01(-r.top / distance) : 0;

        // media scales up through the first ~60% of the pin, then holds.
        const grow = slice(p, 0, 0.6);
        media.style.transform = `scale(${lerp(0.62, 1, grow)})`;

        // text fades + rises in over the middle stretch.
        const t = slice(p, 0.2, 0.55);
        text.style.opacity = String(t);
        text.style.transform = `translateY(${lerp(40, 0, t)}px)`;

        // stat card slides in last.
        const s = slice(p, 0.55, 0.85);
        stat.style.opacity = String(s);
        stat.style.transform = `translateY(${lerp(28, 0, s)}px) scale(${lerp(
          0.9,
          1,
          s,
        )})`;
      } else {
        // Phones keep normal document flow, but each part still scrubs into
        // place as it enters instead of appearing as a static stack.
        const mediaTop = media.getBoundingClientRect().top;
        const textTop = text.getBoundingClientRect().top;
        const statTop = stat.getBoundingClientRect().top;
        const grow = clamp01((vh * 0.96 - mediaTop) / (vh * 0.5));
        const t = clamp01((vh * 0.94 - textTop) / (vh * 0.48));
        const s = clamp01((vh * 0.94 - statTop) / (vh * 0.42));
        media.style.transform = `scale(${lerp(0.88, 1, grow)})`;
        text.style.opacity = String(t);
        text.style.transform = `translateY(${lerp(34, 0, t)}px)`;
        stat.style.opacity = String(s);
        stat.style.transform = `translateY(${lerp(24, 0, s)}px) scale(${lerp(
          0.94,
          1,
          s,
        )})`;
      }
    };

    const apply = () => {
      const reduced = prefersReducedMotion();
      if (reduced) {
        pinned = false;
        disable();
        media.style.transform = "none";
        text.style.opacity = "1";
        text.style.transform = "none";
        stat.style.opacity = "1";
        stat.style.transform = "none";
        unsubscribe?.();
        unsubscribe = null;
        return;
      }

      pinned = desktop.matches;
      if (pinned) {
        track.style.height = "";
        if (stageRef.current) {
          stageRef.current.style.height = "";
          stageRef.current.style.position = "";
          stageRef.current.style.overflow = "";
          stageRef.current.style.alignItems = "";
        }
      } else {
        disable();
      }

      // subscribeScrollFrame invokes `update` immediately on subscribe, so the
      // already-subscribed branch calls it directly to re-sync after a
      // breakpoint change.
      if (unsubscribe) update();
      else unsubscribe = subscribeScrollFrame(update);
    };

    apply();
    // The md breakpoint crossing is what flips pinning on/off, so `change` is
    // the event that matters. A plain resize only needs the scrub re-measured,
    // which the shared scroll frame already does on its own resize listener.
    desktop.addEventListener("change", apply);
    // Reduced-motion can be toggled while the page is open; re-apply so the
    // effect turns off (or back on) without a reload.
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMq.addEventListener("change", apply);
    return () => {
      desktop.removeEventListener("change", apply);
      reduceMq.removeEventListener("change", apply);
      unsubscribe?.();
    };
  }, []);

  return (
    <div ref={trackRef} className="relative h-[260vh] max-md:!h-auto">
      <div
        ref={stageRef}
        className="flex overflow-hidden md:sticky md:top-0 md:h-screen md:items-center"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 sm:px-10 md:grid-cols-2 md:gap-16 lg:pr-32">
          {/* text — fades/rises in */}
          <div
            ref={textRef}
            className="order-2 md:order-1"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          >
            <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-[3.4rem] lg:leading-[1.1]">
              Podcast: market strategy
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-500">
              We are strategy consultants who work with startup strategies and
              help promote and sell your products, including helping marketing.
            </p>
            {/* #d73042 to match home2 (the other stats already use it), and
                `leading-relaxed` on the label — QA asked for more line-height
                between "Increased" and "Performance Rate". */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-4xl font-extrabold text-[#d73042] sm:text-5xl">
                80%
              </span>
              <span className="text-sm font-medium leading-relaxed text-zinc-500">
                Increased
                <br />
                Performance Rate
              </span>
            </div>
          </div>

          {/* media — scales through the pin */}
          <div className="relative order-1 md:order-2">
            {/* The bloom in home2.pdf spreads far past the frame — it is still
                tinting the page a few hundred px out — and it is centred on the
                photo rather than offset to 70%/60%. The rounded-[2rem] did
                nothing on a radial gradient.

                The bloom must stay INSIDE this box: the sticky stage above is
                `overflow-hidden`, so a large negative inset is clipped rather
                than bleeding outward — an earlier -inset-24 vanished for exactly
                that reason. Wide falloff comes from the gradient stops instead. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(226,124,203,0.45)_0%,rgba(226,124,203,0.22)_45%,rgba(226,124,203,0)_78%)]"
            />
            {/* The design's accent here is the upright teal/blue paper-plane
                pair, which already exists as its own asset — this was cropping
                the left edge of pattern.png (the crystal band) instead, which is
                a different shape entirely. In home2.pdf the pair sits just off
                the photo's top-right corner, upright and unrotated. */}
            <Image
              src="/images/icons/right-plane.png"
              alt=""
              aria-hidden
              width={272}
              height={228}
              className="animate-floaty pointer-events-none absolute -right-10 -top-12 hidden h-24 w-auto select-none object-contain sm:block"
            />
            <div ref={mediaRef} style={{ willChange: "transform" }}>
              <MediaFrame
                src="/images/featured/feature1.webp"
                alt="A man working on a laptop during a late-evening podcast recording session"
              />
            </div>
            {/* In home2.pdf the card's BOTTOM edge is flush with the photo's
                (890 vs 891 on the 1920 frame) and it overhangs sideways instead:
                card x 755–1016 against photo x 956–1351, so ~77% of its width
                sits outside the photo's left edge. We had it hanging off the
                bottom-left corner, which reads as a different composition. */}
            {/* Overhang must fit the GRID GAP (gap-12 below md, gap-16 above),
                the only free space left of this photo. An overhang equal to the
                gap leaves zero clearance and the card touches the copy in the
                other column, so use half: -left-4 (16px) below md, -left-8
                (32px) from md up. The design's literal ~77% overhang isn't
                reproducible — the mockup's photo bleeds into a page margin,
                this one has a text column beside it. */}
            <div
              ref={statRef}
              className="absolute bottom-0 -left-4 md:-left-8"
              style={{ opacity: 0, willChange: "transform, opacity" }}
            >
              <StatCard value="27%">
                have knowledge about market strategies.
              </StatCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
