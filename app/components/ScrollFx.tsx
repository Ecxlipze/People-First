"use client";

import { useEffect, useRef } from "react";

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

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
    if (prefersReduced()) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    let raf = 0;
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
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [y, scale]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, willChange: "transform, opacity" }}
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
    if (prefersReduced()) return;
    let raf = 0;
    const update = () => {
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, window.scrollY / (vh * 0.9)));
      // Smoothstep easing for cinematic feel
      const ease = p * p * (3 - 2 * p);
      el.style.opacity = String(1 - ease * 0.92);
      el.style.transform = `perspective(1200px) rotateX(${ease * 3.5}deg) scale(${1 - ease * 0.07}) translateY(${-ease * 55}px)`;
      el.style.filter = `blur(${ease * 3}px)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
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
