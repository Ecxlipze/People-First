"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import SmartImage from "@/app/components/SmartImage";
import { GALLERY } from "@/app/components/gallery";
import PinnedRecede from "@/app/components/PinnedRecede";
import { Reveal } from "@/app/components/ScrollFx";

/* Gallery section (4). Swipes up over the pinned Ventures section (3) — the
   outer track carries the negative margin + rounded opaque bg + upward shadow
   (the swipe-over recipe). PinnedRecede inside pins it too, so a later section
   can swipe over Gallery in turn.

   The centrepiece is a coverflow-style carousel: the active photo sits centred
   and large, its neighbours peek in from the sides scaled down and dimmed.
   Advance by arrows, dots, drag/swipe, or the auto-timer. */
export default function GalleryShowcase() {
  const [active, setActive] = useState(0);
  const n = GALLERY.length;

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + n) % n),
    [n],
  );
  const to = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  // Auto-advance pauses for every direct interaction mode. Separate flags
  // avoid a pointer-up resuming the timer while the mouse or keyboard focus is
  // still inside the carousel.
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || dragging || focused;
  useEffect(() => {
    if (paused || n <= 1) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % n), 4200);
    return () => window.clearInterval(id);
  }, [paused, n]);

  // keyboard arrows when the carousel region is focused.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
  };

  // pointer drag / swipe.
  const drag = useRef<{ x: number; active: boolean }>({ x: 0, active: false });
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, active: true };
    setDragging(true);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    drag.current.active = false;
    setDragging(false);
    if (dx > 40) go(-1);
    else if (dx < -40) go(1);
  };

  return (
    /* Outer track: swipes up over the pinned Ventures section. */
    <div className="relative z-30 rounded-t-[2rem] bg-[linear-gradient(135deg,#eef1fb_0%,#f4f1fc_50%,#f8f6fd_100%)] shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] max-md:-mt-8 sm:rounded-t-[3rem] md:-mt-[100vh]">
      <PinnedRecede className="flex flex-col items-center justify-center py-10 sm:py-14">
        {/* heading */}
        <Reveal y={28} scale={0.98}>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            OUR <span className="text-[#4b2fb3]">GALLERY</span>
          </h2>
        </Reveal>

        {/* carousel */}
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Gallery photos"
          tabIndex={0}
          onKeyDown={onKey}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setFocused(false);
            }
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            drag.current.active = false;
            setDragging(false);
          }}
          className="relative mt-6 w-full touch-pan-y select-none outline-none sm:mt-8 lg:pr-24"
          style={{ perspective: "1600px" }}
        >
          {/* stage — the peeking neighbours are positioned relative to centre */}
          <div className="relative mx-auto flex h-[clamp(280px,44vh,460px)] w-full max-w-5xl items-center justify-center">
            {GALLERY.map((photo, i) => {
              // signed distance from the active slide, wrapped to the short way
              // round the ring so slide 0 and slide n-1 are neighbours.
              let offset = i - active;
              if (offset > n / 2) offset -= n;
              if (offset < -n / 2) offset += n;
              const abs = Math.abs(offset);
              const isActive = offset === 0;

              return (
                <button
                  key={i}
                  type="button"
                  aria-label={isActive ? photo.alt : `Show ${photo.alt}`}
                  aria-current={isActive}
                  onClick={() => !isActive && to(i)}
                  tabIndex={isActive ? 0 : -1}
                  className="absolute h-full w-[62%] overflow-hidden rounded-2xl shadow-[0_30px_70px_-30px_rgba(40,40,80,0.6)] transition-[transform,opacity,filter] duration-500 ease-out sm:w-[46%] lg:w-[38%]"
                  style={{
                    // each step out shifts less than the previous, so distant
                    // slides bunch toward the edges — an endless-stream look.
                    transform: `translateX(${
                      Math.sign(offset) * (abs === 0 ? 0 : 55 + (abs - 1) * 26)
                    }%) scale(${isActive ? 1 : Math.max(0.62, 0.84 - (abs - 1) * 0.1)})`,
                    opacity:
                      abs > 3
                        ? 0
                        : isActive
                          ? 1
                          : Math.max(0.2, 0.6 - (abs - 1) * 0.2),
                    filter: isActive
                      ? "none"
                      : `brightness(${0.9 - (abs - 1) * 0.08})`,
                    zIndex: 20 - abs,
                    pointerEvents: abs > 3 ? "none" : "auto",
                    cursor: isActive ? "default" : "pointer",
                  }}
                >
                  {photo.src && photo.hasImage ? (
                    /* Fades up once decoded, with a shimmer standing in until
                       then — carousel slides are frequently still loading when
                       they first swing into view. */
                    <SmartImage
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 62vw, (max-width: 1024px) 46vw, 38vw"
                      className="object-cover"
                      draggable={false}
                      priority={i === 0}
                      skeleton
                    />
                  ) : (
                    /* styled placeholder until real photos are dropped in */
                    <span
                      aria-hidden
                      className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#dfe3f5_0%,#e7e1f4_100%)]"
                    >
                      <ImageIcon className="h-10 w-10 text-[#9aa0c9]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* dots */}
        <div className="mt-3 flex items-center justify-center gap-0.5">
          {GALLERY.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === active}
              onClick={() => to(i)}
              className="group grid h-11 w-11 place-items-center rounded-full"
            >
              <span
                aria-hidden
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-6 bg-[#4b2fb3]"
                    : "w-2 bg-zinc-300 group-hover:bg-zinc-400"
                }`}
              />
            </button>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/gallery"
          className="pf-interactive mt-6 inline-flex min-h-11 items-center rounded-md bg-[#2e1a86] px-8 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(46,26,134,0.7)] hover:-translate-y-0.5 hover:bg-[#241569] hover:shadow-[0_14px_34px_-10px_rgba(46,26,134,0.8)] sm:text-base"
        >
          View our Gallery
        </Link>
      </PinnedRecede>
    </div>
  );
}
