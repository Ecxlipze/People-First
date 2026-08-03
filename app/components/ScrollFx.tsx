"use client";

import { useEffect, useRef, useState } from "react";
import {
  prefersReducedMotion,
  subscribeScrollFrame,
} from "@/app/lib/motion";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/* Observer options shared by <Reveal> and <Stagger>.

   `threshold` is a fraction of the ELEMENT, not of the viewport, so a single
   value cannot serve both a small card and a section taller than the screen: at
   0.12 a 3000px-tall block needs 360px on screen (fine), but a block taller than
   ~8 viewports would need more than the viewport can ever show, and would never
   fire. Passing 0 alongside it means "any part visible" always qualifies, and
   `rootMargin`'s bottom inset is what actually delays the trigger until the
   element has entered properly. That combination behaves the same for normal
   cards and still fires for very tall sections.

   The negative bottom inset shrinks the viewport's lower edge, so an element must
   cross above it to count as intersecting — that is what makes the entrance read
   as an arrival instead of firing while still off-screen. */
const REVEAL_OBSERVER: IntersectionObserverInit = {
  threshold: [0, 0.12],
  rootMargin: "0px 0px -8% 0px",
};

function stageForReveal(
  el: HTMLElement,
  { y, scale, delay = 0 }: { y: number; scale: number; delay?: number },
) {
  el.style.opacity = "0";
  el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
  el.style.filter = "blur(7px)";
  el.style.willChange = "transform, opacity, filter";
  el.style.transition = [
    `opacity 620ms ${REVEAL_EASE} ${delay}ms`,
    `transform 760ms ${REVEAL_EASE} ${delay}ms`,
    `filter 700ms ${REVEAL_EASE} ${delay}ms`,
  ].join(", ");
}

function revealElement(el: HTMLElement) {
  el.dataset.revealed = "true";
  el.style.opacity = "1";
  el.style.transform = "translate3d(0, 0, 0) scale(1)";
  el.style.filter = "blur(0)";

  const settle = (event: TransitionEvent) => {
    if (event.propertyName !== "transform") return;
    el.style.willChange = "auto";
    el.style.transform = "";
    el.style.filter = "";
    el.style.transition = "";
    el.removeEventListener("transitionend", settle);
  };
  el.addEventListener("transitionend", settle);
}

function showWithoutMotion(el: HTMLElement) {
  el.dataset.revealed = "true";
  el.style.opacity = "1";
  el.style.transform = "none";
  el.style.filter = "none";
  el.style.transition = "none";
  el.style.willChange = "auto";
}

/* Reveal — a clear, one-shot viewport entrance. The element stays staged just
   below the viewport, then lifts, sharpens and scales into place when it enters.
   One-shot motion is intentionally used here: it reads as an arrival rather
   than the subtle continuous drift of the previous scroll scrubber. */
export function Reveal({
  children,
  className = "",
  y = 64,
  scale = 0.94,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      showWithoutMotion(el);
      return;
    }

    stageForReveal(el, { y, scale });

    if (!("IntersectionObserver" in window)) {
      showWithoutMotion(el);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealElement(el);
          observer.disconnect();
          break;
        }
      },
      REVEAL_OBSERVER,
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [y, scale]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}

/* Recede — for a pinned (sticky) hero. As the first viewport scrolls away the
   content scales down, tilts back into depth, and fades/blurs, so it appears to
   recede into the background behind the section swiping up over it. */
export function Recede({
  children,
  className = "",
  dwell = 0.4,
  span = 0.9,
}: {
  children: React.ReactNode;
  className?: string;
  /* Viewport heights of scroll during which the hero holds completely still
     before it starts receding. Without a dwell the hero began dissolving on the
     very first wheel tick, so it never had a moment of being simply *there*. */
  dwell?: number;
  /* Viewport heights the recede itself spans once the dwell is over. */
  span?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    const update = () => {
      const vh = window.innerHeight;
      const p = Math.max(
        0,
        Math.min(1, (window.scrollY - vh * dwell) / (vh * span)),
      );
      // Smoothstep easing for cinematic feel
      const ease = p * p * (3 - 2 * p);
      el.style.opacity = String(1 - ease * 0.92);
      el.style.transform = `perspective(1200px) rotateX(${ease * 3.5}deg) scale(${1 - ease * 0.07}) translateY(${-ease * 55}px)`;
      el.style.filter = `blur(${ease * 3}px)`;
    };
    const unsubscribe = subscribeScrollFrame(update);
    return unsubscribe;
  }, [dwell, span]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </div>
  );
}

/* Stagger — the list/grid counterpart to <Reveal>. Each item owns its observer,
   so tall mobile stacks reveal as individual cards reach the viewport, while
   same-row desktop cards cascade with a short delay. */
export function Stagger({
  children,
  className = "",
  y = 28,
  step = 60,
  selector = ":scope > *",
}: {
  children: React.ReactNode;
  className?: string;
  /* px of upward travel each child covers. */
  y?: number;
  /* milliseconds between consecutive items in the same visible group. */
  step?: number;
  /* Which descendants to stagger. Defaults to direct children; pass e.g.
     "[data-stagger]" when the children are wrapped by layout elements. */
  selector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (items.length === 0) return;

    if (prefersReducedMotion()) {
      items.forEach(showWithoutMotion);
      return;
    }

    items.forEach((el, i) => {
      /* Reset the cascade after six items. On long mobile lists this prevents a
         card far down the page from inheriting a needlessly long delay. */
      const delay = Math.min((i % 6) * step, 320);
      stageForReveal(el, { y, scale: 0.94, delay });
    });

    if (!("IntersectionObserver" in window)) {
      items.forEach(showWithoutMotion);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          revealElement(el);
          observer.unobserve(el);
        });
      },
      REVEAL_OBSERVER,
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [y, step, selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* CountUp — an animated number counter that runs once, when the element first
   scrolls into view.

   Values on this site are written as display strings ("100+", "80%", "25+"),
   so rather than requiring every caller to split the number from its
   decoration, this parses the numeric run out of `value` and rebuilds the
   string around it. That keeps the rendered text identical to what was there
   before at rest — including for reduced-motion and no-JS users, since the full
   string is what server-renders. */
export function CountUp({
  value,
  className = "",
  duration = 1400,
}: {
  /* The final display string, e.g. "100+", "80%", "27%". */
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Server-render (and reduced-motion render) the finished value so the text is
  // never missing or mid-count for crawlers and assistive tech.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
    if (!match || prefersReducedMotion()) return;

    const [, prefix, rawNumber, suffix] = match;
    const target = Number(rawNumber.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;

    // Preserve the source formatting: decimals and thousands separators.
    const decimals = rawNumber.includes(".")
      ? rawNumber.split(".")[1].length
      : 0;
    const grouped = rawNumber.includes(",");
    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      if (!grouped) return fixed;
      const [int, frac] = fixed.split(".");
      const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return frac ? `${withCommas}.${frac}` : withCommas;
    };

    let raf = 0;
    let start = 0;
    let running = false;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = clamp01((now - start) / duration);
      // easeOutCubic — fast off the mark, settling gently onto the final value.
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${prefix}${format(target * eased)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    // IntersectionObserver (not a scroll handler): this fires once and needs no
    // per-frame work, so it costs nothing while scrolling.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || running) continue;
          running = true;
          io.disconnect();
          setDisplay(`${prefix}${format(0)}${suffix}`);
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
