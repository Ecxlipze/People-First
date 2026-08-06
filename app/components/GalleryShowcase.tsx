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
    /* Outer track: swipes up over the pinned Ventures section.
       Background #f2f8f8, sampled from HOME4.pdf — the same pale mint the
       Ventures section uses, not the lavender gradient this carried. The whole
       block (heading, carousel, button) centres on one axis with no sidebar
       padding, matching the design's shared x≈931 centreline. */
    <div className="relative z-30 rounded-t-[2rem] bg-[#f2f8f8] shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] max-md:-mt-8 sm:rounded-t-[3rem] md:-mt-[100vh]">
      {/* No horizontal padding on the column itself — the carousel's ±2 slides
          must reach the viewport edges to be clipped like the design's. The
          heading and button carry their own px-6 instead. */}
      <PinnedRecede className="flex flex-col items-center justify-center overflow-hidden py-10 sm:py-14">
        {/* heading */}
        <Reveal y={28} scale={0.98} className="px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            OUR <span className="text-[#150065]">GALLERY</span>
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
          /* No lg:pr-* here. In HOME4.pdf the heading, the centre photo and the
             button all share ONE vertical axis (x≈932 / 930 / 931.5 on the 1920
             frame), so the carousel must be centred on the same box as the other
             two. */
          className="relative mt-8 w-full touch-pan-y select-none outline-none lg:mt-12"
          style={{ perspective: "1600px" }}
        >
          {/* stage — slides are positioned relative to centre.
              The design's centre photo is 399×675 on the 1920 frame, a PORTRAIT
              0.59 aspect (≈300×506 at 1440), so the stage height and slide width
              target that ratio.
              FULL WIDTH, no max-w: in HOME4 the ±2 slides run off both frame
              edges (the left one starts at x=0, the right ends at x=1867 of
              1920), so they are meant to bleed. A max-w-5xl stage would pull them
              inside the container and lose that clipped-edge look. */}
          <div className="relative flex h-[clamp(300px,52vh,506px)] w-full items-center justify-center">
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
                  /* 19% at lg gives the exact required spread to fit the 5 slides
                     without overlapping the desktop SideNav on the right, whilst
                     maintaining the tight visual clustering seen in HOME4.pdf. */
                  className="absolute h-full w-[62%] overflow-hidden bg-[#f0f0f0] transition-[transform,opacity] duration-500 ease-out sm:w-[40%] lg:w-[19%]"
                  style={{
                    /* FIVE slides are visible in HOME4.pdf, not three: a centre
                       photo, both ±1 neighbours, and both ±2 slides clipped by
                       the frame edges. Measuring each slide's height on the 1920
                       frame gives a clean scale ladder —
                         centre  675px  → 1.000
                         ±1      512px  → 0.759
                         ±2      359px  → 0.532
                       Slide centres sit at 138 / 511.5 / 930 / 1357.5 / 1727, so
                       the step is ~105% of a slide width from centre to ±1 and
                       ~93% from ±1 to ±2 — the gaps tighten as the slides shrink.
                       Verified at 1920 (the design's own frame width): our outer
                       centres land 798px from the middle against the design's
                       794px.
                       This previously hid everything past ±1 via `opacity: abs >
                       1 ? 0 : 1`, which is why only three photos ever showed —
                       the mockup shows FIVE at once. */
                    /* Math: 90% for adjacent slide distance and 155% for outer slide distance.
                       This tightens the gaps between slides to closely match the HOME4.pdf mockup. */
                    transform: `translateX(${
                      Math.sign(offset) * (abs === 0 ? 0 : 90 + (abs - 1) * 65)
                    }%) scale(${abs === 0 ? 1 : abs === 1 ? 0.759 : 0.532})`,
                    opacity: abs > 2 ? 0 : 1,
                    zIndex: isActive ? 20 : 10 - abs,
                    pointerEvents: abs > 2 ? "none" : "auto",
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
                      priority={i < 5}
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
        <div className="mt-3 flex items-center justify-center gap-0.5 lg:hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === (active % 5)}
              onClick={() => {
                // Find the closest absolute index for this dot to prevent long sweeps
                const base = Math.round(active / 5) * 5;
                to(base + i);
              }}
              className="group grid h-11 w-11 place-items-center rounded-full"
            >
              <span
                aria-hidden
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === (active % 5)
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
          /* Button fill #150065, sampled from HOME4.pdf. `mt-10` (was mt-6)
             gives the bottom margin QA asked for under the carousel. */
          className="pf-interactive mt-10 inline-flex min-h-11 items-center rounded-md bg-[#150065] px-8 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(21,0,101,0.7)] hover:-translate-y-0.5 hover:bg-[#0f0049] hover:shadow-[0_14px_34px_-10px_rgba(21,0,101,0.8)] sm:text-base"
        >
          View our Gallery
        </Link>
      </PinnedRecede>
    </div>
  );
}
