"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { SECTORS, type Sector } from "@/app/components/ecosystem";
import PinnedRecede from "@/app/components/PinnedRecede";
import { prefersReducedMotion } from "@/app/lib/motion";

function SectorIcon({
  sector,
  className,
  sizes,
}: {
  sector: Sector;
  className: string;
  sizes: string;
}) {
  return (
    <Image
      src={sector.iconSrc}
      alt=""
      width={512}
      height={512}
      sizes={sizes}
      className={`object-contain ${className}`}
    />
  );
}

/* Decorative background layer — the real design assets: the teal blob (with its
   baked-in dotted texture + swoosh curves) bottom-left, the purple blob (flipped
   to sit bottom-right), and the faceted paper-plane pairs in the top corners.
   Purely aesthetic; sits behind the content and ignores pointer events. */
function Decor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* teal blob + dotted texture, bottom-left corner (flipped from the
          top-left source art) */}
      <Image
        src="/images/icons/blob3.png"
        alt=""
        width={739}
        height={552}
        className="absolute -bottom-2 -left-4 w-[35vw] max-w-[480px] -scale-y-100 select-none sm:-left-2"
      />
      {/* purple blob + dotted texture, bottom-right corner */}
      <Image
        src="/images/icons/blob4.png"
        alt=""
        width={859}
        height={430}
        className="absolute -bottom-2 -right-2 w-[40vw] max-w-[560px] select-none xl:-bottom-32 xl:-right-16 xl:w-[35vw] xl:max-w-[480px]"
      />
      {/* paper-plane pair, top-left (blue + teal, pointing down) */}
      <Image
        src="/images/icons/left-plane.png"
        alt=""
        width={392}
        height={353}
        className="animate-floaty absolute left-12 top-12 w-20 select-none sm:left-24 sm:top-16 sm:w-32"
      />
      {/* paper-plane pair, top-right (teal + blue, pointing up) */}
      <Image
        src="/images/icons/right-plane.png"
        alt=""
        width={256}
        height={227}
        style={{ animationDelay: "-2.5s" }}
        className="animate-floaty absolute right-12 top-10 w-16 select-none sm:right-40 sm:top-16 sm:w-28"
      />
    </div>
  );
}

/* One orbiting node + its flanking label. Positioned by clock angle around the
   hub using the same trig as RadialNav (left = sin·r, top = -cos·r). Labels sit
   on the outer side (right half → label to the right, left half → to the left).
   Desktop only — the orbit is decorative and needs room. */
function OrbitNode({ s }: { s: Sector }) {
  const rad = (s.angle * Math.PI) / 180;
  const x = Math.sin(rad);
  const y = -Math.cos(rad);
  // Keep labels on the outside of the ring. The top and bottom nodes stack their
  // labels vertically; the remaining nodes flank left/right. This avoids the
  // previous cluster of centred labels on the left arc, which collided with both
  // one another and the section copy.
  let placement: string;
  if (s.angle === 0) {
    placement =
      "bottom-full left-1/2 mb-2 -translate-x-1/2 text-center";
  } else if (s.angle > 0 && s.angle < 180) {
    placement =
      "left-full top-1/2 ml-2 -translate-y-1/2 text-left 2xl:ml-3";
  } else if (s.angle > 180 && s.angle < 240) {
    placement = "left-1/2 top-full mt-2 -translate-x-1/2 text-center";
  } else {
    placement =
      "right-full top-1/2 mr-2 -translate-y-1/2 text-right 2xl:mr-3";
  }
  return (
    <div
      data-node
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        /* Each node carries its own radius multiplier — see the `r` note in
           ecosystem.ts. The design's ring runs 138–187px around a 130px hub, so
           a single shared radius flattens a deliberately uneven arrangement. */
        left: `calc(50% + ${(x * s.r).toFixed(4)} * var(--orbit-r))`,
        top: `calc(50% + ${(y * s.r).toFixed(4)} * var(--orbit-r))`,
        opacity: 0,
        willChange: "transform, opacity",
      }}
    >
      <div className="relative flex items-center justify-center">
        {/* Node is 82px against the hub's 130px in the design — a 0.63 ratio.
            Diagonal gradient (light top-left → dark bottom-right), not a flat
            fill: every node in HOME6.pdf is shaded that way. */}
        <span
          className="pf-pop flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_10px_24px_-8px_rgba(20,20,50,0.5)] 2xl:h-16 2xl:w-16"
          style={{
            backgroundImage: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)`,
          }}
        >
          <SectorIcon
            sector={s}
            sizes="32px"
            className="h-6 w-6 2xl:h-7 2xl:w-7"
          />
        </span>

        {/* Label sizes from the design's boxes: AGRICULTURE 35.2pt and its
            tagline 22.8pt on the 1920 frame → ~19px and ~13px at 1440, where
            these were 14px/12px. Taglines are BLACK in HOME6, not zinc-500. */}
        <div
          className={`absolute w-32 min-[1400px]:w-36 2xl:w-44 ${placement}`}
        >
          <p
            className="text-[15px] font-semibold leading-tight 2xl:text-[17px]"
            style={{ color: s.color }}
          >
            {s.label}
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-black 2xl:text-[12px]">
            {s.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}

/* Ecosystem section (6). Swipes up over the pinned Testimonials section (5) —
   outer track carries the negative margin + rounded opaque bg + upward shadow
   (the swipe-over recipe). PinnedRecede pins it too. Left column of copy, right
   column an orbit of sector nodes around a People First hub (desktop); the
   sectors stack as a legend on mobile. Content scrubs in as the block rises. */
export default function EcosystemShowcase() {
  const leftRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const left = leftRef.current;
    const orbit = orbitRef.current;
    if (!left || !orbit) return;

    const leftItems = Array.from(
      left.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const nodes = Array.from(
      orbit.querySelectorAll<HTMLElement>("[data-node], [data-hub]"),
    );

    if (prefersReducedMotion()) {
      [...leftItems, ...nodes].forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
      });
      return;
    }

    /* One-shot entrances, replacing the previous scroll scrubber. The scrubber
       tied every element's opacity to its live scroll offset, so content drifted
       continuously instead of arriving — which read as nothing happening. Each
       element now animates once, when it actually reaches the viewport.

       The two groups get different motion on purpose:
         · left column — a short lift, like <Reveal> elsewhere on the site
         · orbit nodes — a scale-up from the centre of the ring, staggered around
           it, so the diagram assembles itself

       The nodes are positioned on the ring with `left`/`top` plus Tailwind's
       -translate-x/y-1/2 (the `translate` property), so animating `transform`
       here cannot disturb their placement. */
    const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

    const stage = (el: HTMLElement, from: string, delay: number) => {
      el.style.opacity = "0";
      el.style.transform = from;
      el.style.willChange = "transform, opacity";
      el.style.transition = [
        `opacity 600ms ${EASE} ${delay}ms`,
        `transform 720ms ${EASE} ${delay}ms`,
      ].join(", ");
    };

    leftItems.forEach((el, i) => stage(el, "translateY(34px)", i * 70));
    // Nodes ease in around the ring; capped so the last one isn't left waiting.
    nodes.forEach((el, i) => stage(el, "scale(0.4)", Math.min(i * 80, 560)));

    /* Orbit members (nodes AND the hub) must land on `scale(1)` rather than
       `none`: clearing the transform outright would also drop any scale the
       element's own classes rely on, and the hub additionally runs
       `animate-ring-pulse`. Membership is checked against the collected set, not
       a data attribute, since the hub uses data-hub and the nodes data-node. */
    const orbitMembers = new Set<HTMLElement>(nodes);

    const reveal = (el: HTMLElement) => {
      el.style.opacity = "1";
      el.style.transform = orbitMembers.has(el) ? "scale(1)" : "none";
      const settle = (event: TransitionEvent) => {
        if (event.propertyName !== "transform") return;
        el.style.willChange = "auto";
        el.style.transition = "";
        el.removeEventListener("transitionend", settle);
      };
      el.addEventListener("transitionend", settle);
    };

    if (!("IntersectionObserver" in window)) {
      [...leftItems, ...nodes].forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.transition = "none";
        el.style.willChange = "auto";
      });
      return;
    }

    /* threshold 0 alongside a negative bottom rootMargin: a `threshold` is a
       fraction of the element, which cannot work for both a small node and a
       column taller than the viewport. The margin is what delays the trigger
       until the element has properly entered. */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { threshold: [0, 0.12], rootMargin: "0px 0px -8% 0px" },
    );

    [...leftItems, ...nodes].forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // .pf-blend flattens the swipe-over dressing on mobile (square top, no
  // shadow, no negative pull); see globals.css. Safe alongside `overflow-clip`
  // because the joining hairline is drawn inside this box, not outside it.
  return (
    <div className="pf-blend relative z-50 -mt-16 overflow-clip rounded-t-[2rem] bg-white shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] md:-mt-8 xl:-mt-[100vh]">
      <PinnedRecede
        overlapFrom="xl"
        /* Extra top padding: in HOME6.pdf the "Welcome to a Compounding…"
           heading starts at y≈390 of a 1409-tall frame (~28% down), leaving room
           for the flanking crystal art above it. With py-10/12 the crystals sat
           tight against the section's top edge — QA #17 ("needs spacing/margin
           at top, because the images placed at both ends should be at above
           position"). */
        className="pf-seam relative flex items-center pb-10 pt-24 sm:pb-12 sm:pt-32 md:min-h-screen lg:pt-40"
      >
        {/* decorative layer — pinned+receding with the content */}
        <Decor />
        <div className="relative z-10 mx-auto grid w-full max-w-[1720px] grid-cols-1 items-center gap-8 px-8 sm:px-12 lg:px-16 lg:pr-32 xl:grid-cols-[560px_1fr] xl:gap-8 2xl:gap-12 xl:pr-[340px] min-[1400px]:pr-[380px] 2xl:pr-[420px]">
          {/* ── left column ── */}
          <div ref={leftRef} className="max-w-none xl:mt-12">
            <h2
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              /* Pure BLACK in the design, not zinc-900 — the modal glyph pixel
                 across all three heading lines in HOME6.pdf is #000000. Same for
                 the body copy and both callout paragraphs below, which were
                 zinc-600. The heading spans x 80→836 over lines at y 389/459/529,
                 i.e. 70pt leading, so ~46px type at a 1440 viewport. */
              className="text-2xl leading-tight tracking-tight text-black sm:text-3xl lg:text-[2.125rem] lg:leading-[1.35]"
            >
              <span className="font-bold">Welcome to a</span>
              <br />
              <span className="font-bold">Compounding Corporate</span>
              <br />
              {/* "Ecosystem" is a GRADIENT in the design (#3979a5 → #406aa4),
                  not the flat #3581a6 used here before. */}
              <span className="bg-[linear-gradient(90deg,#3979a5_0%,#406aa4_100%)] bg-clip-text font-bold text-transparent">
                Ecosystem
              </span>{" "}
              <span className="font-bold">Built Around You.</span>
            </h2>

            <p
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="mt-4 max-w-[400px] text-sm leading-normal text-black sm:text-[15px]"
            >
              We bring together essential sectors into one collaborative
              ecosystem, working in synergy to create lasting impact, shared
              growth, and limitless opportunities for you.
            </p>

            {/* People First callout */}
            <div
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="mt-6 flex items-start gap-3"
            >
              {/* 72px circle in the design (component detection), filled
                  #548fae.
                  The logo is the LIGHT-ON-DARK variant: in HOME6 "People" is
                  white and "First" teal, over the multicoloured fan. Neither
                  peoplefirst.svg (the tall landing artwork) nor logo.svg (navy
                  "People") reads on this fill — the navy text disappeared into
                  the blue entirely. logo-light.webp is logo.svg's own bitmap with
                  just the navy wordmark recoloured white, so the fan and "First"
                  keep their brand colours. As in the design it overflows the
                  circle's width rather than being padded inside it. */}
              <span className="relative flex h-14 w-14 flex-none items-center justify-center rounded-full bg-[#548fae] shadow-sm sm:h-[72px] sm:w-[72px]">
                <Image
                  src="/images/logo-light.webp"
                  alt="People First"
                  width={800}
                  height={184}
                  className="w-[85%] object-contain"
                />
              </span>
              <div>
                {/* "People First" and "No more struggling alone." share a 61.5pt
                    box in the design — 0.70 of the h2's 87.9pt, so ~24px against
                    the heading's 34px. Both are teal GRADIENTS
                    (#367fa6 → #2a9aa8), not the flat #2f8ea7 used before. */}
                <h3 className="bg-[linear-gradient(90deg,#367fa6_0%,#2a9aa8_100%)] bg-clip-text text-lg font-semibold text-transparent sm:text-[1.4rem]">
                  People First
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-black sm:text-sm">
                  We don&apos;t just build companies; we build a self-sustaining
                  infrastructure where every sector accelerates the next.
                </p>
              </div>
            </div>

            {/* struggling-alone callout */}
            <div
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              /* Rule colour sampled at the bar's own pixels: #2d4d76. */
              className="mt-12 border-l-4 border-[#2d4d76] pl-4 py-0.5"
            >
              <h3 className="bg-[linear-gradient(90deg,#367fa6_0%,#2a9aa8_100%)] bg-clip-text text-lg font-semibold text-transparent sm:text-2xl">
                No more struggling alone.
              </h3>
              <p className="mt-1 text-sm leading-snug text-black sm:text-base">
                Grow, scale, and thrive with a system designed to uplift you.
              </p>
            </div>
          </div>

          {/* ── right column: orbit (desktop) ── */}
          <div
            ref={orbitRef}
            className="relative mx-auto hidden h-[460px] w-full max-w-[640px] [--orbit-r:115px] xl:block min-[1400px]:h-[500px] min-[1400px]:max-w-[720px] min-[1400px]:[--orbit-r:130px] 2xl:h-[540px] 2xl:max-w-[780px] 2xl:[--orbit-r:145px]"
          >
            {/* faint ring */}
            <span
              aria-hidden
              className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-zinc-200"
              style={{
                width: "calc(var(--orbit-r) * 2)",
                height: "calc(var(--orbit-r) * 2)",
              }}
            />
            {/* hub */}
            {/* Hub fill sampled from HOME6.pdf: a teal-blue diagonal gradient,
                #0286a4 at the top-left through #035688 at the bottom-right —
                where this was a much darker navy (#1f6ea8 → #0f3d66).
                Sized against the nodes at the design's ratio: hub 130px to node
                82px = 0.63, so 64px nodes want a ~102px hub (h-24 ≈ 96, h-28 at
                2xl) rather than the 112–128px used before, which made the ring
                read as crowding a too-large centre. */}
            <div
              data-hub
              className="animate-ring-pulse absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0286a4_0%,#035688_100%)] shadow-[0_18px_40px_-14px_rgba(3,86,136,0.7)] 2xl:h-24 2xl:w-24"
              style={{ opacity: 0, willChange: "transform, opacity" }}
            >
              {/* Same light-on-dark logo as the callout. `brightness-0 invert`
                  on the old asset produced a flat white silhouette, losing the
                  fan's colours and the teal "First" that the design keeps. */}
              <Image
                src="/images/logo-light.webp"
                alt="People First"
                width={800}
                height={184}
                className="w-[86%] object-contain"
              />
            </div>
            {/* orbiting sector nodes */}
            {SECTORS.map((s) => (
              <OrbitNode key={s.label} s={s} />
            ))}
          </div>

          {/* ── right column: legend (mobile) ── */}
          <ul className="flex flex-col gap-4 xl:hidden">
            {SECTORS.map((s) => (
              <li key={s.label} className="group flex items-start gap-3 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-soft)] hover:translate-x-1">
                {/* Same diagonal gradient as the desktop orbit nodes. */}
                <span
                  className="pf-pop flex h-12 w-12 flex-none items-center justify-center rounded-full text-white"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)`,
                  }}
                >
                  <SectorIcon sector={s} sizes="24px" className="h-6 w-6" />
                </span>
                <div>
                  <p
                    className="text-[15px] font-bold leading-tight"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </p>
                  <p className="text-xs leading-snug text-black">{s.tagline}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </PinnedRecede>
    </div>
  );
}
