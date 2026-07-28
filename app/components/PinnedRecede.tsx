"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/app/lib/motion";

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
  overlapFrom = "md",
}: {
  children: React.ReactNode;
  hold?: number;
  className?: string;
  /* Breakpoint where the following section starts using a full -100vh pull.
     Long tablet layouts can use "xl" so iPads keep a compact overlap. "none"
     keeps the animated flow handoff without pinning or overlap compensation. */
  overlapFrom?: "none" | "md" | "lg" | "xl";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!track || !inner) return;

    // Desktop keeps the original cinematic pin. Tablets use it only when the
    // content genuinely fits in one viewport; long tablet and phone sections
    // stay in normal flow and receive a lighter scroll-linked recede instead.
    // This avoids clipping multi-row grids while preserving motion.
    const tablet = window.matchMedia("(min-width: 768px)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const wideDesktop = window.matchMedia("(min-width: 1280px)");
    const needsFullOverlapCompensation = () =>
      overlapFrom === "none"
        ? false
        : overlapFrom === "xl"
        ? wideDesktop.matches
        : overlapFrom === "lg"
          ? desktop.matches
          : tablet.matches;
    // The tall-track height that gives the sticky its scroll room. We set it
    // imperatively so we can toggle it off on mobile; keep the exact value here
    // so the desktop path can RESTORE it (clearing .style.height would wipe the
    // React-provided inline height and collapse the pin — that broke desktop).
    const TRACK_H = `calc(100vh + ${hold * 100}vh)`;

    // `compensate`: once the configured breakpoint is active, the NEXT section
    // carries a -100vh pull. If this section falls back to normal flow, add a
    // matching viewport of bottom space so that pull cannot cover its content.
    const disable = (compensate = false) => {
      track.style.height = "auto";
      track.style.marginBottom = compensate ? "100vh" : "";
      if (stageRef.current) {
        stageRef.current.style.height = "auto";
        stageRef.current.style.position = "static";
        stageRef.current.style.overflow = "visible";
        stageRef.current.style.alignItems = "stretch";
      }
      inner.style.opacity = "1";
      inner.style.transform = "none";
      inner.style.filter = "none";
    };

    let raf = 0;
    let attached = false;
    let pinned = false;
    const update = () => {
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;

      if (pinned) {
        const distance = r.height - vh; // scroll room while pinned
        // p: 0 as the stage sticks, 1 when the track has been fully scrolled
        // through (== next section has fully climbed over it).
        const p = distance > 0 ? clamp01(-r.top / distance) : 0;
        // Stay bright for most of the hold, ease out only near the end.
        const q = clamp01((p - 0.35) / 0.65);
        const ease = q * q * (3 - 2 * q);
        inner.style.opacity = String(1 - ease * 0.88);
        inner.style.transform = `perspective(1200px) rotateX(${ease * 3}deg) scale(${1 - ease * 0.06}) translateY(${-ease * 50}px)`;
        inner.style.filter = `blur(${ease * 2}px)`;
      } else {
        // Mobile and tall tablet sections cannot safely pin because their
        // content is higher than the viewport. Give those sections a complete
        // scroll-linked handoff instead: the incoming card rises and sharpens,
        // then recedes as the following rounded card reaches it.
        const flowOnly = overlapFrom === "none";
        // Long editorial pages need a wider, stronger transition window than
        // the compact homepage cards. Start their exit as soon as the next
        // panel enters the viewport so every section-to-section handoff reads.
        const enter = flowOnly
          ? clamp01((vh * 1.05 - r.top) / (vh * 0.55))
          : clamp01((vh - r.top) / (vh * 0.38));
        const exit = flowOnly
          ? clamp01((vh * 1.02 - r.bottom) / (vh * 0.55))
          : clamp01((vh * 0.68 - r.bottom) / (vh * 0.48));
        const enterEase = enter * enter * (3 - 2 * enter);
        const exitEase = exit * exit * (3 - 2 * exit);
        const opacity = flowOnly
          ? (0.2 + enterEase * 0.8) * (1 - exitEase * 0.62)
          : (0.62 + enterEase * 0.38) * (1 - exitEase * 0.42);
        const scale = flowOnly
          ? 0.92 + enterEase * 0.08 - exitEase * 0.055
          : 0.975 + enterEase * 0.025 - exitEase * 0.035;
        const y = flowOnly
          ? (1 - enterEase) * 96 - exitEase * 54
          : (1 - enterEase) * 42 - exitEase * 26;
        const blur = flowOnly
          ? (1 - enterEase) * 3.5 + exitEase * 1.8
          : (1 - enterEase) * 1.2 + exitEase * 0.8;

        inner.style.opacity = String(opacity);
        inner.style.transform = `perspective(1200px) scale(${scale}) translateY(${y}px)`;
        inner.style.filter = `blur(${blur}px)`;
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const apply = () => {
      const reduced = prefersReducedMotion();
      if (reduced) {
        pinned = false;
        disable(needsFullOverlapCompensation());
        if (attached) {
          window.removeEventListener("scroll", onScroll);
          attached = false;
        }
        return;
      }

      // `md:min-h-screen` makes a correctly sized section exactly one viewport
      // tall, so allow a small measurement tolerance. Anything materially
      // taller uses the animated flow path, including iPad portrait/landscape.
      const fitsViewport = inner.scrollHeight <= window.innerHeight * 1.02;
      pinned = needsFullOverlapCompensation() && fitsViewport;

      if (pinned) {
        // restore the tall track (CSS `md:h-screen` handles the stage), then scrub.
        track.style.height = TRACK_H;
        track.style.marginBottom = "";
        if (stageRef.current) {
          stageRef.current.style.height = "";
          stageRef.current.style.position = "";
          stageRef.current.style.overflow = "";
          stageRef.current.style.alignItems = "";
        }
      } else {
        disable(needsFullOverlapCompensation());
      }

      if (!attached) {
        window.addEventListener("scroll", onScroll, { passive: true });
        attached = true;
      }
      update();
    };

    apply();
    tablet.addEventListener("change", apply);
    desktop.addEventListener("change", apply);
    wideDesktop.addEventListener("change", apply);
    // Re-decide pin-vs-flow on resize (viewport height changes flip whether the
    // content fits — rotation, browser-chrome show/hide, window drag), then
    // scrub. `apply` re-attaches/detaches the scroll listener as needed.
    const onResize = () => {
      apply();
      onScroll();
    };
    window.addEventListener("resize", onResize);
    return () => {
      tablet.removeEventListener("change", apply);
      desktop.removeEventListener("change", apply);
      wideDesktop.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [hold, overlapFrom]);

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
