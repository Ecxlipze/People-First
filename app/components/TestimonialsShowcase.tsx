"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { TESTIMONIALS, type Testimonial } from "@/app/components/testimonials";
import PinnedRecede from "@/app/components/PinnedRecede";
import { Reveal, Stagger } from "@/app/components/ScrollFx";

// deterministic rich gradient for the initials-monogram avatar fallback.
const AVATAR_COLORS = [
  "linear-gradient(135deg, #4f6ef7 0%, #2f4fc9 100%)",
  "linear-gradient(135deg, #e0325a 0%, #b8183d 100%)",
  "linear-gradient(135deg, #5a9e95 0%, #3a7a72 100%)",
  "linear-gradient(135deg, #7a5cf0 0%, #5437cc 100%)",
  "linear-gradient(135deg, #e08a2f 0%, #ba6714 100%)",
  "linear-gradient(135deg, #2f9ae0 0%, #1579bd 100%)",
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



/* 40px: the avatar circle measures x178→232 on the 1920 frame (54px), which is
   40px at a 1440 viewport — this rendered 48px. */
function Avatar({ t, i }: { t: Testimonial; i: number }) {
  if (t.avatar && t.hasAvatar) {
    return (
      <Image
        src={t.avatar}
        alt={t.name}
        width={80}
        height={80}
        className="h-12 w-12 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex h-12 w-12 items-center justify-center rounded-full text-[15px] font-bold tracking-wide text-white shadow-inner ring-1 ring-black/5"
      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
    >
      <User className="h-6 w-6 text-white/90 drop-shadow-sm" strokeWidth={1.5} />
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
    <div className="pf-blend relative z-40 rounded-t-[2rem] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf8_100%)] shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] max-md:-mt-16 sm:rounded-t-[3rem] md:-mt-[100vh]">
      <PinnedRecede
        overlapFrom="xl"
        className="pf-seam flex flex-col items-center justify-center py-10 sm:py-14"
      >
        {/* Previously both the heading and the cards were scrubbed to scroll
            position from one shared handler, which tied all twelve cards to the
            grid's single offset — so they drifted in together rather than each
            arriving. <Reveal>/<Stagger> give every card its own one-shot
            entrance the moment it reaches the viewport. */}
        <Reveal className="w-full">
          {/* 36px at lg, not 48px. The heading's em box is 67.3pt on the 1920
              frame; em boxes overstate visual size by ~35%, so the cap-corrected
              figure is ~36px at a 1440 viewport. Colour is #18181b. */}
          <h2 className="font-heading px-6 text-center text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[2.25rem]">
            People are saying about us
          </h2>
        </Reveal>

        {/* masonry grid — 1→2→3→4 columns; break-inside-avoid keeps cards whole.
            The cards are the direct children of this column container, so the
            default ":scope > *" selector targets them without a data attribute. */}
        {/* Column geometry measured off the HOME5.pdf render by detecting the
            white card rectangles (QA #10, "cards sizes doesn't match with
            design"). On the 1920 frame:
              8 cards, 4 columns × 2 rows, each card 379px wide
              column gaps 33–35px, vertical gaps 29–37px
              grid spans x152→1768 = 1617px (84.2% of the frame), margins 152/151
            At a 1440 viewport that is 284px cards, ~26px gaps, 1213px of grid.

            It is a true MASONRY: row-1 tops all align at y=270 but their heights
            differ (311/279/249/285), and each column's row-2 top follows its own
            row-1 height (618/584/552/584) rather than a shared row line — which
            is what the CSS columns + break-inside-avoid reproduces.

            No lg:pr-32 here: that padded only this element, pulling the grid off
            the heading's centre axis (the same bug the Gallery had). */}
        <Stagger
          className="mx-auto mt-6 w-full max-w-[1213px] gap-8 px-6 [column-fill:balance] sm:mt-8 sm:columns-2 lg:columns-3 xl:columns-4"
          step={45}
        >
          {/* mb-8 (32px) gives the vertical rhythm closer to the design's 29–37px column gaps */}
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="mb-8 break-inside-avoid">
              {/* rounded-xl (12px), down from rounded-2xl (16px) — QA #16.
                  Padding from the design: the avatar sits 26px in from the card's
                  left edge on the 1920 frame → ~20px at 1440, so p-5 not p-4. */}
              <article className="pf-card group flex flex-col rounded-[4px] border border-black/10 bg-white p-6">
                {/* header: avatar + name/handle + twitter icon */}
                <div className="flex items-start gap-2">
                  <Avatar t={t} i={i} />
                  <div className="min-w-0 flex-1">
                    <p className="font-heading truncate text-[15px] font-bold text-black">
                      {t.name}
                    </p>
                    <p className="font-body truncate text-[13px] text-[#71717a]">
                      {t.handle}
                    </p>
                  </div>
                  <TwitterBird className="pf-pop h-4 w-4 flex-none text-[#0ea5e9]" />
                </div>

                <p className="font-body mt-4 text-[15px] leading-[1.6] text-[#3f3f46]">
                  {t.body}
                </p>

                <p className="font-body mt-2 flex flex-wrap gap-x-2 text-[13px] font-medium text-[#0ea5e9]">
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
