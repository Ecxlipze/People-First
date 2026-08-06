import Image from "next/image";
import { CountUp } from "@/app/components/ScrollFx";
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
    <section className="relative z-10 max-md:-mt-8 rounded-t-[2rem] bg-[linear-gradient(135deg,#eef1fb_0%,#f4f1fc_50%,#f8f6fd_100%)] pb-24 pt-16 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] sm:pt-24 md:-mt-[100vh]">

      {/* ── Block 1: pinned cinematic stage (media scales through the pin) ── */}
      <MediaShowcase />

      {/* ── Block 2: media left, text right ──
          Pinned full-viewport and recedes as Section 3 rises over it — same
          swipe-over mechanism as the hero (Section 1 → 2). */}
      <PinnedRecede className="mx-auto max-w-[56rem] px-6 sm:px-10 lg:pr-32 xl:pr-40">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* media */}
          <div className="relative order-1 mx-auto w-full max-w-[260px] md:max-w-none lg:pr-4">
            {/* Diffused cyan, purple, and pink glow behind the media frame. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-16 -z-10 bg-[radial-gradient(ellipse_at_50%_50%,rgba(100,200,230,0.35)_0%,rgba(180,130,240,0.25)_35%,rgba(230,130,180,0.15)_65%,transparent_80%)] opacity-90 blur-2xl"
            />
            <Image
              src="/images/icons/left-plane.png"
              alt=""
              aria-hidden
              width={379}
              height={340}
              className="animate-floaty pointer-events-none absolute -left-12 -top-12 z-20 hidden h-24 w-auto select-none object-contain sm:block"
            />
            <div className="relative">
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
              variant="compact"
              value="45%"
              className="absolute -bottom-4 -right-4 z-20 md:-bottom-6 md:-right-8"
            >
              Productivity events all over Pakistan
            </StatCard>
            </div>
          </div>

          {/* text */}
          <div className="order-2 lg:pl-4">
            <h3 className="text-3xl font-bold leading-[1.15] tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.2rem]">
              Tech Events<br />Management.
            </h3>
            <p className="mt-4 max-w-[18rem] text-[14px] leading-relaxed text-[#4e648c]">
              We are strategy consultants who work with startup strategies and
              help promote and sell your products, including helping marketing.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <CountUp
                value="30%"
                className="text-4xl font-bold text-[#d73042] sm:text-4xl"
              />
              <span className="text-[12px] font-semibold leading-tight text-zinc-500">
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
