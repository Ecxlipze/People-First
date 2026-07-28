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
}: {
  children: ReactNode;
  swipeOver?: boolean;
  holdForNext?: boolean;
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
      const pinEnd = panelHeight;
      const progress = clamp01(
        (localScroll - pinStart) / viewportHeight,
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
        setAbsolute(viewportHeight);
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
      track.style.height = `${panelHeight + (holdForNext ? viewportHeight : 0)}px`;
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
  }, [holdForNext]);

  return (
    <div
      ref={trackRef}
      className={`relative ${
        swipeOver ? "-mt-[100svh] md:-mt-[100vh]" : "mt-16"
      }`}
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
