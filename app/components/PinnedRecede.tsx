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
  pinTallContent = false,
  compactStage = false,
}: {
  children: React.ReactNode;
  hold?: number;
  className?: string;
  /* By default the sticky stage is a full viewport tall and centres its content
     in it, which is right for a section meant to fill the screen. For a short
     block that should read as a COMPACT section immediately following the
     previous one, that centring becomes dead space above the content (a 371px
     block centred in 1200px leaves ~414px of blank band). This makes the stage
     height follow its content instead, so consecutive sections sit close
     together. The pin itself, and the next section's overlap, are unaffected. */
  compactStage?: boolean;
  /* Breakpoint where the following section starts using a full -100vh pull.
     Long tablet layouts can use "xl" so iPads keep a compact overlap. "none"
     keeps the animated flow handoff without pinning or overlap compensation. */
  overlapFrom?: "none" | "md" | "lg" | "xl";
  /* A tall panel cannot safely stick from its top because its lower content
     would be clipped below the viewport. Opting in makes it scroll normally
     first, then stick from its bottom for the overlap handoff. */
  pinTallContent?: boolean;
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
        stageRef.current.style.top = "";
        stageRef.current.style.bottom = "";
        stageRef.current.style.overflow = "visible";
        stageRef.current.style.alignItems = "stretch";
      }
      inner.style.opacity = "1";
      inner.style.transform = "none";
      inner.style.filter = "none";
    };

    let raf = 0;
    let attached = false;
    let pinMode: "none" | "top" | "bottom" = "none";
    const update = () => {
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;

      if (pinMode !== "none") {
        const contentHeight = inner.scrollHeight;
        const pinStart =
          pinMode === "bottom" ? Math.max(0, contentHeight - vh) : 0;
        const distance =
          pinMode === "bottom"
            ? r.height - contentHeight
            : r.height - vh;
        // Top-pinned panels recede across their full sticky hold. A tall,
        // bottom-pinned panel starts the same effect only after its final
        // viewport has arrived, so every card remains naturally scrollable.
        const p =
          distance > 0 ? clamp01((-r.top - pinStart) / distance) : 0;
        // Stay bright for most of the hold, ease out only near the end.
        const q = clamp01((p - 0.35) / 0.65);
        const ease = q * q * (3 - 2 * q);
        inner.style.opacity = String(1 - ease * 0.88);
        inner.style.transform = `perspective(1200px) rotateX(${ease * 3}deg) scale(${1 - ease * 0.06}) translateY(${-ease * 50}px)`;
        inner.style.filter = `blur(${ease * 2}px)`;
      } else {
        // ---- Flow path: no pin (phones, and tall tablet/desktop sections) ----
        //
        // CRITICAL: the recede (fade/scale/lift) must NOT run here.
        //
        // A section's opaque background, rounded top and shadow live on the
        // WRAPPER; this scrubber only transforms the INNER content. When the
        // section is pinned, that split is exactly what's wanted — the next
        // panel climbs over the wrapper while the content behind it recedes.
        //
        // Without a pin there is no panel climbing over anything, so fading or
        // lifting the content only pulls it away from its own background: the
        // wrapper keeps painting its bare fill, which reads as a dead band
        // between sections, and the content sits visibly offset from the
        // rounded top edge it belongs to. Measured on a 390px viewport this
        // left FeaturedWork at opacity 0 above a 1469px strip of bare
        // background, and held Ventures/Gallery/Testimonials at ~0.64 opacity
        // with their copy pushed 46–65px below their own panel edge.
        //
        // So the flow path is an ENTRANCE ONLY, and it settles to exactly
        // opacity 1 / no transform / no blur, where content and background are
        // back in register. Sections never fade out on the way up.
        const enter = clamp01((vh * 1.05 - r.top) / (vh * 0.5));
        const e = enter * enter * (3 - 2 * enter);

        // Once fully entered, clear the properties outright rather than writing
        // the identity values. A lingering `transform`/`filter` on this element
        // makes it a containing block for `position: fixed` descendants, which
        // is what detaches the SideNav rail from the viewport.
        if (e >= 0.999) {
          inner.style.opacity = "";
          inner.style.transform = "";
          inner.style.filter = "";
        } else {
          inner.style.opacity = String(0.35 + e * 0.65);
          inner.style.transform = `translate3d(0, ${(1 - e) * 40}px, 0) scale(${0.985 + e * 0.015})`;
          inner.style.filter = `blur(${(1 - e) * 2.4}px)`;
        }
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const apply = () => {
      const reduced = prefersReducedMotion();
      if (reduced) {
        pinMode = "none";
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
      const canOverlap = needsFullOverlapCompensation();
      pinMode = canOverlap
        ? fitsViewport
          ? "top"
          : pinTallContent
            ? "bottom"
            : "none"
        : "none";

      if (pinMode === "top") {
        // restore the tall track (CSS `md:h-screen` handles the stage), then scrub.
        track.style.height = TRACK_H;
        track.style.marginBottom = "";
        if (stageRef.current) {
          stageRef.current.style.height = "";
          stageRef.current.style.position = "";
          stageRef.current.style.top = "";
          stageRef.current.style.bottom = "";
          stageRef.current.style.overflow = "";
          stageRef.current.style.alignItems = "";
        }
      } else if (pinMode === "bottom") {
        // Preserve the panel's full natural height, then provide the same hold
        // distance below it. A negative sticky top equal to viewport minus
        // content height lets the full panel scroll first, then pins its final
        // viewport while the next section climbs over.
        const contentHeight = inner.scrollHeight;
        track.style.height = `calc(${contentHeight}px + ${hold * 100}vh)`;
        track.style.marginBottom = "";
        if (stageRef.current) {
          stageRef.current.style.height = `${contentHeight}px`;
          stageRef.current.style.position = "sticky";
          stageRef.current.style.top = `calc(100vh - ${contentHeight}px)`;
          stageRef.current.style.bottom = "";
          stageRef.current.style.overflow = "visible";
          stageRef.current.style.alignItems = "stretch";
        }
      } else {
        disable(canOverlap);
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
  }, [hold, overlapFrom, pinTallContent, compactStage]);

  return (
    <div
      ref={trackRef}
      className="relative max-md:!h-auto"
      style={{ height: `calc(100vh + ${hold * 100}vh)` }}
    >
      <div
        ref={stageRef}
        className={`flex overflow-hidden md:sticky md:top-0 ${
          compactStage ? "md:items-start" : "md:h-screen md:items-center"
        }`}
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
