import Image from "next/image";
import { CountUp, Reveal } from "@/app/components/ScrollFx";
import { MediaFrame, StatCard } from "@/app/components/media";
import MediaShowcase from "@/app/components/MediaShowcase";
import PinnedRecede from "@/app/components/PinnedRecede";

const SKILLS = [
  "Seminars",
  "Round Talks",
  "Table Talks",
  "Conferences",
  "Tech Talks",
];

export default function FeaturedWork() {
  return (
    <section className="relative z-10 max-md:-mt-8 rounded-t-[2rem] bg-[linear-gradient(135deg,#eef1fb_0%,#f4f1fc_50%,#f8f6fd_100%)] pb-24 pt-32 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] sm:pt-44 md:-mt-[100vh]">
      {/* heading */}
      {/* Type scale from home2.pdf (1920pt frame → ×0.75 for a 1440 viewport).
          Sizes come from CAP HEIGHT, not from the boxes pdftotext reports: those
          boxes are the font's full em square (ascent+descent+line gap), which
          runs ~35% larger than the glyphs actually look. Trusting them directly
          is what made this heading render oversized.
            "Featured Work"  box 96.8 → cap ~64 → ~48px  (not the 72px box implies)
            subtitle         box 60.5 → cap ~40 → ~30px  (not 45px)
          Both are near-black in the design rather than zinc-500. */}
      <Reveal className="px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-[3rem] lg:leading-[1.1]">
          Featured Work
        </h2>
        <p className="mt-4 text-lg text-zinc-700 sm:text-xl lg:text-[1.875rem] lg:leading-snug">
          Let&rsquo;s give you exceptional reasons to choose us.
        </p>
      </Reveal>

      {/* ── Block 1: pinned cinematic stage (media scales through the pin) ── */}
      <MediaShowcase />

      {/* ── Block 2: media left, text right ──
          Pinned full-viewport and recedes as Section 3 rises over it — same
          swipe-over mechanism as the hero (Section 1 → 2). */}
      <PinnedRecede className="mx-auto max-w-6xl px-6 sm:px-10 lg:pr-32">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* media */}
          <div className="relative order-1">
            {/* Soft pink bloom behind the photo (QA: "in img background there is
                no gradient shadow"), sampled from home2.pdf — probing outward
                from the photo edge picks up #dfbade / #ffeaff, with #8b64d1 in
                the band above. An earlier pass read this as lavender-blue
                (rgba(196,168,246)); that is the cool violet at the outer edge of
                the falloff, not the bloom itself. Teal in this design comes from
                the paper planes and stat card, never the glow.

                The bloom must stay INSIDE this box: PinnedRecede's sticky stage
                is `overflow-hidden`, so a large negative inset is clipped rather
                than bleeding outward — that is what made an earlier -inset-24
                disappear entirely. Keep the box modest and get the wide falloff
                from the gradient's own stops instead.

                -z-10 is correct here: it puts the bloom behind the photo and
                stat card, and the section's opaque background is a distant
                ANCESTOR, which always paints below its descendants regardless of
                their z-index. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(226,124,203,0.45)_0%,rgba(226,124,203,0.22)_45%,rgba(226,124,203,0)_78%)]"
            />
            {/* Paper-plane accent, top-left. home2.pdf uses the DIAGONAL pair
                here (planes pointing down-right) against the upright pair beside
                the podcast photo — the two assets already exist as
                left-plane/right-plane. This was cropping pattern.png, a
                different shape. Floats gently, since a decorative element
                sitting in open space reads as pasted-on when static. */}
            <Image
              src="/images/icons/left-plane.png"
              alt=""
              aria-hidden
              width={379}
              height={340}
              className="animate-floaty pointer-events-none absolute -left-16 -top-16 hidden h-28 w-auto select-none object-contain sm:block"
            />
            {/* 0.8 aspect (384×480 in the render), against the podcast frame's
                0.698 — the two frames are deliberately different shapes. */}
            <MediaFrame
              src="/images/featured/feature2.webp"
              aspect="aspect-[0.8/1]"
              alt="Rai Salahuddin Ahmad in conversation with Khuram Schezad, Advisor to the Finance Minister, at a conference"
              caption={
                <>
                  Khuram Schezad — Advisor to Finance Minister
                  <br />
                  Salahuddin Ahmad
                </>
              }
            />
            {/* home2.pdf reads "45% / Productivity events all over Pakistan" —
                the site had "5% / activity events all Pakistan"; the photo
                simply occludes the start of the string in the mockup, the text
                layer carries it in full.

                Mirrors the podcast card: bottom edge flush with the photo, the
                card overhanging the photo's RIGHT edge (card x 755–959 against
                photo x 397–781, so only ~26px of it sits over the photo). */}
            {/* Overhang has to fit in the GRID GAP, which is the only free space
                to the right of this photo. The gap is gap-12 (48px) below md and
                gap-16 (64px) from md up, so an overhang equal to the gap leaves
                zero clearance and the card touches the "Tech Events Management"
                copy — that was the bug. Half the gap keeps the design's
                overhanging look with real air on both sides:
                  <md   gap 48 → -right-4 (16px)
                  md+   gap 64 → -right-8 (32px), 32px still clear
                The design's literal ~77%-of-card-width overhang is not
                reproducible here: the mockup's photo has the whole page margin to
                bleed into, where this one has a text column beside it. */}
            <StatCard
              value="45%"
              className="absolute bottom-0 -right-4 md:-right-8"
            >
              Productivity events all over Pakistan
            </StatCard>
          </div>

          {/* text */}
          <div className="order-2">
            <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-[3.4rem] lg:leading-[1.1]">
              Tech Events Management&nbsp;.
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-500">
              We are strategy consultants who work with startup strategies and
              help promote and sell your products, including helping marketing.
            </p>
            <div className="mt-8 flex items-center gap-3">
              {/* The figure counts up when it scrolls into view, matching the
                  treatment the About page's Key Stats already use. */}
              <CountUp
                value="30%"
                className="text-4xl font-extrabold text-[#d73042] sm:text-5xl"
              />
              <span className="text-sm font-medium leading-tight text-zinc-500">
                management skills
              </span>
            </div>

            <ul className="mt-8 grid max-w-md grid-cols-2 gap-x-8 gap-y-4">
              {SKILLS.map((skill) => (
                /* Each row nudges right on hover, so the list reads as content
                   rather than as a static caption block. */
                <li
                  key={skill}
                  className="group flex items-center gap-2.5 text-base font-semibold text-zinc-700 transition-[transform,color] duration-[var(--dur-base)] ease-[var(--ease-out-soft)] hover:translate-x-1 hover:text-zinc-950"
                >
                  <Image
                    src="/images/icons/task-icon.png"
                    alt=""
                    aria-hidden
                    width={26}
                    height={30}
                    className="pf-pop h-5 w-auto shrink-0 select-none"
                  />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PinnedRecede>
    </section>
  );
}
