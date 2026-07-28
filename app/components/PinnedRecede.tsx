"use client";

import { useEffect, useRef } from "react";

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* PinnedRecede — mirrors the hero's section-1→2 behaviour for a mid-page block.

   It wraps the content in a TALL TRACK containing a `sticky top-0 h-screen`
   stage. The track being taller than the viewport is what gives the sticky room
   to actually pin (a sticky element with no spare room in its parent just
   scrolls away — that was the bug). While pinned, the block HOLDS full-viewport
   and the next section climbs up over it; the content stays bright and only
   recedes (scale/drift/fade) at the very end of the hold — like the hero.

   `hold` = extra viewports of pin time (the track is (1+hold) viewports tall).
   The next section must pull itself up over this track with a negative margin
   so it visibly swipes over the still-pinned content. */
export default function PinnedRecede({
  children,
  hold = 1.6,
  className = "",
}: {
  children: React.ReactNode;
  hold?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner) return;

    // The pin + swipe-over runs from `md` (768px) up. Below that (phones) the
    // section flows normally so tall content (e.g. the ~1900px Testimonials
    // block) isn't clipped above the fold, and the reduced-motion path is
    // reused for anyone who asked for it.
    const desktop = window.matchMedia("(min-width: 768px)");
    // The tall-track height that gives the sticky its scroll room. We set it
    // imperatively so we can toggle it off on mobile; keep the exact value here
    // so the desktop path can RESTORE it (clearing .style.height would wipe the
    // React-provided inline height and collapse the pin — that broke desktop).
    const TRACK_H = `calc(100vh + ${hold * 100}vh)`;

    // `compensate`: at md+ the NEXT section carries `md:-mt-[100vh]` to swipe up
    // over this section's tall (pinning) track. When this section instead flows
    // (too tall to pin), that track no longer exists, so the next section's
    // -100vh pull would ride up and cover this content. Adding a matching 100vh
    // of bottom spacing cancels the pull so the next section lands right at this
    // section's true end. Below md the next section uses a small -mt-8 overlap
    // (not -100vh), so no compensation is needed there.
    const disable = (compensate = false) => {
      track.style.height = "auto";
      track.style.marginBottom = compensate ? "100vh" : "";
      if (stageRef.current) stageRef.current.style.height = "auto";
      inner.style.opacity = "1";
      inner.style.transform = "none";
      inner.style.filter = "none";
    };

    let raf = 0;
    let attached = false;
    const update = () => {
      const r = track.getBoundingClientRect();
      const distance = r.height - window.innerHeight; // scroll room while pinned
      // p: 0 as the stage sticks, 1 when the track has been fully scrolled
      // through (== next section has fully climbed over it).
      const p = distance > 0 ? clamp01(-r.top / distance) : 0;
      // Stay bright for most of the hold, ease out only near the end.
      const q = clamp01((p - 0.35) / 0.65);
      // Cubic easing for a smoother, more cinematic recede
      const ease = q * q * (3 - 2 * q);
      inner.style.opacity = String(1 - ease * 0.88);
      inner.style.transform = `perspective(1200px) rotateX(${ease * 3}deg) scale(${1 - ease * 0.06}) translateY(${-ease * 50}px)`;
      inner.style.filter = `blur(${ease * 2}px)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Engage the pin from `md` up (and never with reduced motion) — BUT only if
    // the content actually fits in the viewport. A section taller than the
    // viewport can't pin without its `h-screen` + `overflow-hidden` stage
    // clipping the overflow (the Testimonials masonry is ~1900px and did
    // exactly this on shorter viewports). Such sections fall back to normal
    // flow, where nothing is hidden; the section above still swipes over them.
    const apply = () => {
      const on = desktop.matches && !prefersReduced();
      if (on) {
        // restore the tall track (CSS `md:h-screen` handles the stage), then scrub.
        track.style.height = TRACK_H;
        track.style.marginBottom = "";
        if (stageRef.current) stageRef.current.style.height = "";
        if (!attached) {
          window.addEventListener("scroll", onScroll, { passive: true });
          attached = true;
        }
        update();
      } else {
        if (attached) {
          window.removeEventListener("scroll", onScroll);
          attached = false;
        }
        disable(desktop.matches && !prefersReduced());
      }
    };

    apply();
    desktop.addEventListener("change", apply);
    // Re-decide pin-vs-flow on resize (viewport height changes flip whether the
    // content fits — rotation, browser-chrome show/hide, window drag), then
    // scrub. `apply` re-attaches/detaches the scroll listener as needed.
    const onResize = () => {
      apply();
      onScroll();
    };
    window.addEventListener("resize", onResize);
    return () => {
      desktop.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="relative max-md:!h-auto"
      style={{ height: `calc(100vh + ${hold * 100}vh)` }}
    >
      <div
        ref={stageRef}
        className="flex overflow-hidden md:sticky md:top-0 md:h-screen md:items-center"
      >
        <div
          ref={innerRef}
          className={`w-full ${className}`}
          style={{ willChange: "transform, opacity, filter" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
