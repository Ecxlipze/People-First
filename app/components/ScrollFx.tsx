"use client";

import { useEffect, useRef, useState } from "react";
import {
  prefersReducedMotion,
  subscribeScrollFrame,
} from "@/app/lib/motion";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* Reveal — scrubbed to scroll. As the element rises through the viewport its
   progress maps 0→1 to opacity, a translateY lift, and a subtle scale-up.
   Unlike a one-shot trigger, it tracks the scroll position continuously
   (Apple-style), so scrubbing back up reverses it. */
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
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.95; // element top enters here → p=0
      const end = vh * 0.42; // element top reaches here → p=1
      const p = Math.max(0, Math.min(1, (start - r.top) / (start - end)));
      el.style.opacity = String(p);
      el.style.transform = `translateY(${(1 - p) * y}px) scale(${
        scale + p * (1 - scale)
      })`;
    };
    const unsubscribe = subscribeScrollFrame(update);
    return unsubscribe;
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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    const update = () => {
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, window.scrollY / (vh * 0.9)));
      // Smoothstep easing for cinematic feel
      const ease = p * p * (3 - 2 * p);
      el.style.opacity = String(1 - ease * 0.92);
      el.style.transform = `perspective(1200px) rotateX(${ease * 3.5}deg) scale(${1 - ease * 0.07}) translateY(${-ease * 55}px)`;
      el.style.filter = `blur(${ease * 3}px)`;
    };
    const unsubscribe = subscribeScrollFrame(update);
    return unsubscribe;
  }, []);

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

/* Stagger — the list/grid counterpart to <Reveal>. Instead of moving the whole
   block as one unit, each direct child scrubs in on its own slightly delayed
   ramp, so a row of cards cascades rather than appearing as a slab.

   Several sections already hand-rolled this exact loop (Testimonials cards,
   Ecosystem left column, Ventures). This is the shared version for new usage;
   the existing bespoke ones are left alone since their triggers are tuned to
   their own pinned tracks. */
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
  /* px of scroll offset between consecutive children — the cascade amount. */
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
      items.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
      });
      return;
    }

    /* Children are hidden HERE, from inside the effect, rather than via an
       inline style on the server-rendered markup. That way the content is
       visible by default and only this running effect can hide it — so a
       hydration failure or disabled JS degrades to "no animation" instead of
       "no content". */
    items.forEach((el) => {
      el.style.opacity = "0";
      el.style.willChange = "transform, opacity";
    });

    const update = () => {
      const vh = window.innerHeight;
      items.forEach((el, i) => {
        const top = el.getBoundingClientRect().top;
        // Each successive child needs the page scrolled a little further before
        // it starts, which is what produces the cascade.
        const p = clamp01((vh * 0.92 - top - i * step) / (vh * 0.42));
        el.style.opacity = String(p);
        el.style.transform = `translateY(${(1 - p) * y}px)`;
      });
    };

    return subscribeScrollFrame(update);
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
