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
        className="absolute -bottom-2 -left-4 w-[42vw] max-w-[560px] -scale-y-100 select-none sm:-left-2"
      />
      {/* purple blob + dotted texture, bottom-right corner */}
      <Image
        src="/images/icons/blob4.png"
        alt=""
        width={859}
        height={430}
        className="absolute -bottom-2 -right-2 w-[46vw] max-w-[640px] select-none"
      />
      {/* paper-plane pair, top-left (blue + teal, pointing down) */}
      <Image
        src="/images/icons/left-plane.png"
        alt=""
        width={392}
        height={353}
        className="animate-floaty absolute left-6 top-8 w-24 select-none sm:left-12 sm:top-10 sm:w-32"
      />
      {/* paper-plane pair, top-right (teal + blue, pointing up) */}
      <Image
        src="/images/icons/right-plane.png"
        alt=""
        width={256}
        height={227}
        style={{ animationDelay: "-2.5s" }}
        className="animate-floaty absolute right-6 top-6 w-20 select-none sm:right-12 sm:top-8 sm:w-24"
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
  // Right half → label flanks right (outward, away from the copy). Left half →
  // label stacks centred (flanking left would spill into the left copy column):
  // above the node if it's in the top arc, below if in the bottom arc.
  let placement: string;
  if (x > 0.34) {
    placement = "left-full ml-3 top-1/2 -translate-y-1/2 text-left";
  } else if (y < 0) {
    placement = "bottom-full mb-2 left-1/2 -translate-x-1/2 text-center";
  } else {
    placement = "top-full mt-2 left-1/2 -translate-x-1/2 text-center";
  }
  return (
    <div
      data-node
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `calc(50% + ${x.toFixed(4)} * var(--orbit-r))`,
        top: `calc(50% + ${y.toFixed(4)} * var(--orbit-r))`,
        opacity: 0,
        willChange: "transform, opacity",
      }}
    >
      <div className="relative flex items-center justify-center">
        <span
          className="pf-pop flex h-16 w-16 items-center justify-center rounded-full text-white shadow-[0_10px_24px_-8px_rgba(20,20,50,0.5)] xl:h-[4.75rem] xl:w-[4.75rem]"
          style={{ backgroundColor: s.color }}
        >
          <SectorIcon
            sector={s}
            sizes="32px"
            className="h-7 w-7 xl:h-8 xl:w-8"
          />
        </span>

        <div className={`absolute w-36 ${placement}`}>
          <p
            className="text-sm font-bold leading-tight"
            style={{ color: s.color }}
          >
            {s.label}
          </p>
          <p className="mt-0.5 text-xs leading-tight text-zinc-500">
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

  return (
    <div className="relative z-50 -mt-8 overflow-clip rounded-t-[2rem] bg-white shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] xl:-mt-[100vh]">
      <PinnedRecede
        overlapFrom="xl"
        className="relative flex items-center py-10 sm:py-12 md:min-h-screen"
      >
        {/* decorative layer — pinned+receding with the content */}
        <Decor />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-8 sm:px-12 lg:grid-cols-2 lg:gap-8 lg:px-16 lg:pr-32">
          {/* ── left column ── */}
          <div ref={leftRef} className="max-w-xl">
            <h2
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="text-2xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-3xl lg:text-[2.4rem] lg:leading-[1.1]"
            >
              Welcome to a Compounding Corporate{" "}
              <span className="text-[#3a6ea5]">Ecosystem</span> Built Around
              You.
            </h2>

            <p
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base"
            >
              We bring together essential sectors into one collaborative
              ecosystem, working in synergy to create lasting impact, shared
              growth, and limitless opportunities for you.
            </p>

            {/* People First callout */}
            <div
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="mt-6 flex items-start gap-3.5"
            >
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[radial-gradient(circle,#e7edf7_0%,#d7e2f2_100%)] p-2">
                <Image
                  src="/images/peoplefirst.svg"
                  alt="People First"
                  width={44}
                  height={44}
                  className="h-full w-full object-contain"
                />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#3a6ea5]">
                  People First
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                  We don&apos;t just build companies; we build a self-sustaining
                  infrastructure where every sector accelerates the next.
                </p>
              </div>
            </div>

            {/* struggling-alone callout */}
            <div
              data-reveal
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="mt-6 border-l-2 border-[#2f7d78] pl-4"
            >
              <h3 className="text-xl font-bold text-[#2f7d78] sm:text-2xl">
                No more struggling alone.
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Grow, scale, and thrive with a system designed to uplift you.
              </p>
            </div>
          </div>

          {/* ── right column: orbit (desktop) ── */}
          <div
            ref={orbitRef}
            className="relative mx-auto hidden aspect-square w-full max-w-[450px] lg:block [--orbit-r:155px] xl:[--orbit-r:180px]"
          >
            {/* faint ring */}
            <span
              aria-hidden
              className="animate-orbit-slow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-zinc-200"
              style={{
                width: "calc(var(--orbit-r) * 2)",
                height: "calc(var(--orbit-r) * 2)",
              }}
            />
            {/* hub */}
            <div
              data-hub
              className="animate-ring-pulse absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#1f6ea8_0%,#0f3d66_100%)] p-6 shadow-[0_18px_40px_-14px_rgba(15,61,102,0.7)] xl:h-32 xl:w-32"
              style={{ opacity: 0, willChange: "transform, opacity" }}
            >
              <Image
                src="/images/peoplefirst.svg"
                alt="People First"
                width={96}
                height={96}
                className="h-full w-full object-contain brightness-0 invert"
              />
            </div>
            {/* orbiting sector nodes */}
            {SECTORS.map((s) => (
              <OrbitNode key={s.label} s={s} />
            ))}
          </div>

          {/* ── right column: legend (mobile) ── */}
          <ul className="flex flex-col gap-4 lg:hidden">
            {SECTORS.map((s) => (
              <li key={s.label} className="group flex items-start gap-3 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-soft)] hover:translate-x-1">
                <span
                  className="pf-pop flex h-11 w-11 flex-none items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: s.color }}
                >
                  <SectorIcon sector={s} sizes="20px" className="h-5 w-5" />
                </span>
                <div>
                  <p
                    className="text-sm font-bold leading-tight"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </p>
                  <p className="text-xs leading-tight text-zinc-500">
                    {s.tagline}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </PinnedRecede>
    </div>
  );
}
