"use client";

import { useEffect, useRef } from "react";
import {
  prefersReducedMotion,
  subscribeScrollFrame,
} from "@/app/lib/motion";

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
