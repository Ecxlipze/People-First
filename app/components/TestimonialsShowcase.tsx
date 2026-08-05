"use client";

import Image from "next/image";
import { TESTIMONIALS, type Testimonial } from "@/app/components/testimonials";
import PinnedRecede from "@/app/components/PinnedRecede";
import { Reveal, Stagger } from "@/app/components/ScrollFx";

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
  return (
    /* Outer track: swipes up over the pinned Gallery section. Light near-white
       background matches the design (distinct from the lavender sections). */
    <div className="relative z-40 rounded-t-[2rem] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf8_100%)] shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] max-md:-mt-8 sm:rounded-t-[3rem] md:-mt-[100vh]">
      <PinnedRecede
        overlapFrom="xl"
        className="flex flex-col items-center justify-center py-10 sm:py-14"
      >
        {/* Previously both the heading and the cards were scrubbed to scroll
            position from one shared handler, which tied all twelve cards to the
            grid's single offset — so they drifted in together rather than each
            arriving. <Reveal>/<Stagger> give every card its own one-shot
            entrance the moment it reaches the viewport. */}
        <Reveal className="w-full">
          <h2 className="px-6 text-center text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            People are saying about us
          </h2>
        </Reveal>

        {/* masonry grid — 1→2→3→4 columns; break-inside-avoid keeps cards whole.
            The cards are the direct children of this column container, so the
            default ":scope > *" selector targets them without a data attribute. */}
        {/* Column geometry from HOME5.pdf: 4 columns on a 1920 frame with a
            412.5pt pitch (cards ~355pt wide, ~57pt gutters), first column
            starting at x=185. That is a wider grid than the old max-w-6xl, and
            the gap is larger than the previous gap-4 — QA #10 ("cards sizes
            doesn't match with design"). */}
        <Stagger
          className="mx-auto mt-6 w-full max-w-[1500px] gap-4 px-6 [column-fill:balance] sm:mt-8 sm:columns-2 sm:gap-[3.5%] lg:columns-4 lg:pr-32"
          step={45}
        >
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="mb-4 break-inside-avoid">
              {/* rounded-xl (12px), down from rounded-2xl (16px) — QA #16. */}
              <article className="pf-card group flex flex-col rounded-xl border border-black/[0.06] bg-white p-4 shadow-[0_10px_30px_-14px_rgba(80,80,120,0.25)]">
                {/* header: avatar + name/handle + twitter icon */}
                <div className="flex items-start gap-2.5">
                  <Avatar t={t} i={i} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-zinc-900 sm:text-sm">
                      {t.name}
                    </p>
                    {/* handle #52525b and body #27272a, sampled from HOME5.pdf
                        (QA #13: "@username color not match"). */}
                    <p className="truncate text-[11px] text-[#52525b]">
                      {t.handle}
                    </p>
                  </div>
                  <TwitterBird className="pf-pop h-4 w-4 flex-none text-[#1da9ee]" />
                </div>

                {/* body */}
                <p className="mt-3 text-xs leading-relaxed text-[#27272a] sm:text-sm">
                  {t.body}
                </p>

                {/* tags — #0ea5e9 in the design, and a tighter top gap than the
                    body copy above (QA #14: hashtags sat too far below). */}
                <p className="mt-1.5 flex flex-wrap gap-x-2 text-xs font-medium text-[#0ea5e9]">
                  {t.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </p>
              </article>
            </div>
          ))}
        </Stagger>
      </PinnedRecede>
    </div>
  );
}
