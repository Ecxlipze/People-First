"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { TESTIMONIALS, type Testimonial } from "@/app/components/testimonials";
import PinnedRecede from "@/app/components/PinnedRecede";
import {
  prefersReducedMotion,
  subscribeScrollFrame,
} from "@/app/lib/motion";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// deterministic colour for the initials-monogram avatar fallback.
const AVATAR_COLORS = [
  "#4f6ef7",
  "#e0325a",
  "#5a9e95",
  "#7a5cf0",
  "#e08a2f",
  "#2f9ae0",
];
/* Classic Twitter bird — lucide dropped its brand icons, so inline the glyph. */
function TwitterBird({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.692 4.692 0 0 1-2.104.08 4.661 4.661 0 0 0 4.352 3.234 9.348 9.348 0 0 1-5.786 1.995 9.5 9.5 0 0 1-1.112-.065 13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.602a9.47 9.47 0 0 0 2.323-2.41z" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ t, i }: { t: Testimonial; i: number }) {
  if (t.avatar && t.hasAvatar) {
    return (
      <Image
        src={t.avatar}
        alt={t.name}
        width={48}
        height={48}
        className="h-12 w-12 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
    >
      {initials(t.name)}
    </span>
  );
}

/* Testimonials section (5). Swipes up over the pinned Gallery section (4) —
   outer track carries the negative margin + rounded opaque bg + upward shadow
   (the swipe-over recipe). PinnedRecede pins it too, so a later section can
   swipe over it in turn.

   Cards are laid out as a balanced 4-column masonry (CSS multi-column) so
   heights vary and columns stagger, matching the design. They scrub in as the
   block rises. */
export default function TestimonialsShowcase() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!heading || !grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-card]"));

    if (prefersReducedMotion()) {
      heading.style.opacity = "1";
      heading.style.transform = "none";
      heading.style.willChange = "auto";
      cards.forEach((c) => {
        c.style.opacity = "1";
        c.style.transform = "none";
        c.style.willChange = "auto";
      });
      return;
    }

    const update = () => {
      const vh = window.innerHeight;
      const headTop = heading.getBoundingClientRect().top;
      const hp = clamp01((vh * 0.9 - headTop) / (vh * 0.5));
      heading.style.opacity = String(hp);
      heading.style.transform = `translateY(${lerp(40, 0, hp)}px)`;

      const gridTop = grid.getBoundingClientRect().top;
      cards.forEach((c, i) => {
        const trigger = vh * 0.92 - i * 18;
        const cp = clamp01((trigger - gridTop) / (vh * 0.34));
        c.style.opacity = String(cp);
        c.style.transform = `translateY(${lerp(44, 0, cp)}px) scale(${lerp(
          0.94,
          1,
          cp,
        )})`;
      });
    };
    return subscribeScrollFrame(update);
  }, []);

  return (
    /* Outer track: swipes up over the pinned Gallery section. Light near-white
       background matches the design (distinct from the lavender sections). */
    <div className="relative z-40 rounded-t-[2rem] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf8_100%)] shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] max-md:-mt-8 sm:rounded-t-[3rem] md:-mt-[100vh]">
      <PinnedRecede
        overlapFrom="xl"
        className="flex flex-col items-center justify-center py-10 sm:py-14"
      >
        <h2
          ref={headingRef}
          className="px-6 text-center text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          People are saying about us
        </h2>

        {/* masonry grid — 1→2→3→4 columns; break-inside-avoid keeps cards whole */}
        <div
          ref={gridRef}
          className="mx-auto mt-6 w-full max-w-6xl gap-4 px-6 [column-fill:balance] sm:mt-8 sm:columns-2 lg:columns-4 lg:pr-32"
        >
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.name}
              data-card
              style={{ opacity: 0, willChange: "transform, opacity" }}
              className="mb-4 flex break-inside-avoid flex-col rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_10px_30px_-14px_rgba(80,80,120,0.25)]"
            >
              {/* header: avatar + name/handle + twitter icon */}
              <div className="flex items-start gap-2.5">
                <Avatar t={t} i={i} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-zinc-900 sm:text-sm">
                    {t.name}
                  </p>
                  <p className="truncate text-[11px] text-zinc-400">
                    {t.handle}
                  </p>
                </div>
                <TwitterBird className="h-4 w-4 flex-none text-[#1da1f2]" />
              </div>

              {/* body */}
              <p className="mt-3 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                {t.body}
              </p>

              {/* tags */}
              <p className="mt-2.5 flex flex-wrap gap-x-2 text-xs font-medium text-[#1da1f2]">
                {t.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </PinnedRecede>
    </div>
  );
}
