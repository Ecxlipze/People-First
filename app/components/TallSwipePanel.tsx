"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/app/lib/motion";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/*
 * A swipe-over track for sections taller than the viewport.
 *
 * The section scrolls normally until its bottom reaches the viewport. Its last
 * viewport then pins for one viewport of travel while the next panel, pulled
 * up by the same amount, slides over it. This gives long mobile/tablet content
 * the homepage's real pinned handoff without clipping its upper content.
 */
export default function TallSwipePanel({
  children,
  swipeOver = false,
  holdForNext = true,
  dwell = 0.28,
  handoff = 1,
  leadIn,
}: {
  children: ReactNode;
  swipeOver?: boolean;
  holdForNext?: boolean;
  /* Extra gap above a non-`swipeOver` panel, in viewport heights, replacing the
     default 4rem. This is the scroll room the PRECEDING pinned hero needs in
     order to have a dwell of its own — with only a 4rem gap the next panel starts
     covering the hero almost immediately, so the hero's pause has nowhere to
     happen and two opaque sections briefly overlap. */
  leadIn?: number;
  /* How long the section sits STILL and fully readable once its bottom reaches
     the viewport, before the recede starts — in viewport heights.

     Without this the handoff began the instant the section bottomed out, so a
     section was already dissolving while the reader was still on its last band;
     the page felt like it flicked between sections rather than presenting each
     one. The dwell is pure pause: nothing animates, the panel just holds. */
  dwell?: number;
  /* How much scroll the recede itself spans, in viewport heights. Raising this
     past 1 makes the transition slower and more deliberate. */
  handoff?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const panel = panelRef.current;
    if (!track || !panel) return;

    let raf = 0;
    let panelHeight = panel.offsetHeight;
    let viewportHeight = window.innerHeight;

    const setAbsolute = (top: number) => {
      panel.style.position = "absolute";
      panel.style.inset = "auto 0 auto 0";
      panel.style.top = `${top}px`;
      panel.style.width = "auto";
    };

    const update = () => {
      const rect = track.getBoundingClientRect();

      if (!holdForNext || prefersReducedMotion()) {
        setAbsolute(0);
        panel.style.opacity = "1";
        panel.style.transform = "none";
        panel.style.filter = "none";
        raf = 0;
        return;
      }

      const localScroll = -rect.top;
      const pinStart = Math.max(0, panelHeight - viewportHeight);
      const dwellPx = viewportHeight * dwell;
      const handoffPx = viewportHeight * handoff;
      /* The pin now covers dwell + handoff. During the dwell the panel stays
         pinned but `progress` is still 0, so it holds perfectly still and fully
         legible; only after that does the recede play out over `handoffPx`. */
      const pinEnd = pinStart + dwellPx + handoffPx;
      const progress = clamp01(
        (localScroll - pinStart - dwellPx) / handoffPx,
      );

      if (localScroll < pinStart) {
        setAbsolute(0);
      } else if (localScroll <= pinEnd) {
        panel.style.position = "fixed";
        panel.style.inset = "auto";
        panel.style.left = `${rect.left}px`;
        panel.style.right = "auto";
        panel.style.top = "auto";
        panel.style.bottom = "0";
        panel.style.width = `${rect.width}px`;
      } else {
        /* Park the panel exactly where the pin released it. This must equal the
           total pinned travel (dwell + handoff), not one viewport — otherwise the
           panel would snap by the difference the moment the pin ends. */
        setAbsolute(dwellPx + handoffPx);
      }

      const ease = progress * progress * (3 - 2 * progress);
      panel.style.opacity = String(1 - ease * 0.86);
      panel.style.transform = `perspective(1200px) rotateX(${ease * 3}deg) scale(${1 - ease * 0.06}) translateY(${-ease * 48}px)`;
      panel.style.filter = `blur(${ease * 2}px)`;
      raf = 0;
    };

    const scheduleUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const measure = () => {
      viewportHeight = window.innerHeight;
      panelHeight = panel.offsetHeight;
      /* The track must reserve the panel's own height PLUS every pinned pixel
         (dwell + handoff). Reserving less would end the track while the panel is
         still pinned, which collapses the pause it is meant to create.

         Reduced motion reserves nothing: `update()` bails out before pinning in
         that mode, so any extra height would just be empty space the reader has
         to scroll past for an effect that never plays. */
      const pinnedTravel =
        holdForNext && !prefersReducedMotion()
          ? viewportHeight * (dwell + handoff)
          : 0;
      track.style.height = `${panelHeight + pinnedTravel}px`;
      scheduleUpdate();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(panel);
    measure();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, [holdForNext, dwell, handoff]);

  /* The overlap is one viewport, which is what makes this panel begin covering
     the previous one exactly as that panel's HANDOFF phase starts (the handoff is
     the final viewport of its pin, after its dwell). That alignment holds while
     `handoff` is 1; a different handoff would need this margin to match it, so it
     is derived here rather than hardcoded, and the svh/vh pair is kept for mobile
     browsers whose toolbars make `vh` unreliable. */
  const usesDefaultHandoff = handoff === 1;

  return (
    <div
      ref={trackRef}
      className={`relative ${
        !swipeOver
          ? leadIn === undefined
            ? "mt-16"
            : "pf-lead-in"
          : usesDefaultHandoff
            ? "-mt-[100svh] md:-mt-[100vh]"
            : ""
      }`}
      /* Inline only for the two cases the utility classes can't express: a
         caller-supplied lead-in gap, and a non-default handoff overlap.

         The lead-in is written as a custom property so the stylesheet can zero it
         under prefers-reduced-motion (see .pf-lead-in in globals.css). It exists
         purely to give the preceding hero room to recede, and that recede does not
         run in reduced motion — leaving the gap would be blank scrolling. */
      style={
        swipeOver
          ? usesDefaultHandoff
            ? undefined
            : { marginTop: `calc(-100vh * ${handoff})` }
          : leadIn !== undefined
            ? ({ "--pf-lead-in": String(leadIn) } as React.CSSProperties)
            : undefined
      }
    >
      <div
        ref={panelRef}
        className="w-full"
        style={{
          willChange: holdForNext
            ? "transform, opacity, filter"
            : undefined,
          transformOrigin: "center bottom",
        }}
      >
        {children}
      </div>
    </div>
  );
}
