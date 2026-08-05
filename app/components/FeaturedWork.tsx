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
    <section className="relative z-10 -mt-[100svh] rounded-t-[2rem] bg-[linear-gradient(135deg,#eef1fb_0%,#f4f1fc_50%,#f8f6fd_100%)] pb-24 pt-32 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] sm:pt-44 md:-mt-[100vh]">
      {/* heading */}
      {/* Type scale from home2.pdf (1920pt frame → ×0.75 for a 1440 viewport):
          "Featured Work" box height 96.8 → ~72px, and the subtitle 60.5 → ~45px.
          The subtitle was `sm:text-2xl` (24px), roughly half the design size —
          that is QA's "font size not matched for head and para". Both are also
          near-black in the design rather than zinc-500. */}
      <Reveal className="px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-[4.5rem] lg:leading-[1.05]">
          Featured Work
        </h2>
        <p className="mt-4 text-lg text-zinc-700 sm:text-2xl lg:text-[2.8rem] lg:leading-tight">
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
            {/* Soft halo bleeding out from the photo. home2.pdf has a lavender
                bloom here — sampling outward from the photo's right edge gives
                #f0e7fd at +2pt fading to the page bg by ~100pt — where this was
                a green-teal (150,200,190) glow. QA read the mismatch as "in img
                background there is no gradient shadow". */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(196,168,246,0.42)_0%,rgba(196,168,246,0)_68%)]"
            />
            {/* crystal accent, top-left */}
            <Image
              src="/images/pattern.png"
              alt=""
              aria-hidden
              width={1923}
              height={462}
              /* Floats gently — it is a decorative crystal sitting in open
                 space, which is exactly the kind of element that looks pasted-on
                 when static. */
              className="animate-floaty pointer-events-none absolute -left-4 -top-12 hidden h-16 w-auto -rotate-[8deg] select-none object-contain object-left opacity-90 sm:block"
            />
            <MediaFrame
              src="/images/featured/feature2.webp"
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
                the site had "5% / activity events all Pakistan". */}
            <StatCard
              value="45%"
              className="absolute -bottom-6 -right-4 sm:-right-8"
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
