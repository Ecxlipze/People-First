import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Reveal } from "@/app/components/ScrollFx";
import { STAGES, type Stage } from "@/app/what-we-do/stages";
import ContactTrigger from "@/app/contact/ContactTrigger";

/* What We Do → "The People First Ecosystem" (SECTION 2).

   The covering half of the swipe-over pattern: opaque background, rounded top,
   upward shadow, higher z-index and a small negative top margin, so it rises up
   over the pinned pain-points section.

   Three stage columns sit side by side on desktop and stack on mobile. Each has
   a coloured header with a numbered pill, an intro paragraph, then its
   ventures. THE MIND STAGE is the exception: instead of a venture list it has a
   single feature card, which is why `feature` exists on the Stage type.

   Note this is unrelated to /app/components/EcosystemShowcase.tsx — that is the
   homepage's radial orbit diagram, a different design entirely. */

/* faint contour lines drifting across the lower half, as in the mockup */
function Contours() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] w-full select-none text-zinc-300"
    >
      {[0, 26, 52, 78, 104].map((dy, i) => (
        <path
          key={dy}
          d={`M-40 ${250 + dy} C 300 ${170 + dy}, 560 ${330 + dy}, 860 ${
            268 + dy
          } C 1120 ${214 + dy}, 1280 ${120 + dy}, 1500 ${168 + dy}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.5 - i * 0.07}
        />
      ))}
    </svg>
  );
}

function VentureCard({ name, blurb }: { name: string; blurb: string }) {
  return (
    <li className="rounded-md border border-zinc-200 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <p className="text-[0.88rem] font-bold leading-tight text-[#1a1a2e]">
        {name}
      </p>
      <p className="mt-1.5 text-[0.74rem] leading-snug text-zinc-500">
        {blurb}
      </p>
    </li>
  );
}

function StageColumn({ stage }: { stage: Stage }) {
  return (
    /* h-full + flex-col so all three columns match height on desktop even
       though the middle one holds a single card rather than a list */
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white/70 shadow-[0_10px_30px_-18px_rgba(60,50,110,0.4)] backdrop-blur-sm">
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ backgroundColor: stage.headerBg }}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/95 text-[0.8rem] font-bold text-[#1a1a2e]">
          {stage.number}
        </span>
        <h3 className="text-[0.9rem] font-bold tracking-wide text-white">
          {stage.title}
        </h3>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-6 pt-4">
        <p className="text-center text-[0.76rem] leading-relaxed text-zinc-500">
          {stage.intro}
        </p>

        {stage.feature ? (
          /* THE MIND STAGE — one feature card, centred in the column */
          <div
            className="mt-5 rounded-lg border bg-white px-5 py-6 text-center"
            style={{ borderColor: `${stage.accent}55` }}
          >
            <GraduationCap
              className="mx-auto h-7 w-7"
              style={{ color: stage.accent }}
              strokeWidth={2}
              aria-hidden
            />
            <p
              className="mt-3 text-[0.82rem] font-bold leading-tight"
              style={{ color: stage.accent }}
            >
              {stage.feature.name}
            </p>
            <p className="mt-3 text-[0.72rem] leading-relaxed text-zinc-500">
              {stage.feature.blurb}
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {stage.ventures.map((v) => (
              <VentureCard key={v.name} name={v.name} blurb={v.blurb} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function EcosystemStages() {
  return (
    <section className="relative z-10 -mt-6 overflow-hidden rounded-t-[2rem] bg-[linear-gradient(160deg,#fdfbff_0%,#fbf8fe_55%,#f7f3fc_100%)] pb-24 pt-16 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:-mt-8 sm:rounded-t-[3rem] sm:pb-28 sm:pt-20">
      <Contours />

      {/* cyan wash, upper-left — carries the tint through from section 1 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(120,215,230,0.22)_0%,rgba(120,215,230,0)_70%)]"
      />

      {/* ── decorative crystals + planes, along the bottom ──
          hidden below sm: at narrow widths there is no side margin to hold
          them and they would collide with the stacked columns */}
      <Image
        src="/images/what-we-do/crystal-purple.webp"
        alt=""
        aria-hidden
        width={260}
        height={302}
        className="animate-floaty pointer-events-none absolute bottom-[16%] left-[14%] hidden h-7 w-auto select-none sm:block"
      />
      <Image
        src="/images/what-we-do/plane-blue.webp"
        alt=""
        aria-hidden
        width={420}
        height={831}
        className="animate-floaty pointer-events-none absolute bottom-[6%] left-[31%] hidden h-28 w-auto select-none sm:block"
      />
      <Image
        src="/images/what-we-do/crystal-red.webp"
        alt=""
        aria-hidden
        width={260}
        height={302}
        className="animate-floaty pointer-events-none absolute bottom-[7%] left-[45%] hidden h-6 w-auto select-none sm:block"
      />
      {/* kept left of the CTA row: the buttons occupy the right half of this
          band, and the plane is tall enough to cross them from anywhere nearer */}
      <Image
        src="/images/what-we-do/plane-teal.webp"
        alt=""
        aria-hidden
        width={420}
        height={831}
        className="animate-floaty pointer-events-none absolute bottom-[3%] left-[41%] hidden h-28 w-auto select-none sm:block"
      />

      {/* No right padding on the container: it would shrink the content box
          from the right and pull the centred heading off the page's true
          centre. Only the grid and CTAs need to clear the icon rail, so they
          reserve that space themselves. max-w-7xl so the columns run wide. */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal className="text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-[#1a1a2e] sm:text-2xl lg:text-[1.75rem]">
            THE PEOPLE FIRST ECOSYSTEM
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-[0.8rem] leading-relaxed text-zinc-600 sm:text-[0.85rem]">
            The People First Evolution Model sequences human potential across
            Physical, Mind, and Market circles, deploying synchronized ventures
            and strategic JVs for rapid, self-sustaining growth.
          </p>
        </Reveal>

        {/* the grid and the CTAs below reserve just enough room for the icon
            rail, whose labels start around 1164px at a 1440 viewport */}
        <Reveal className="mt-12 grid items-stretch gap-6 md:grid-cols-3 md:gap-5 lg:pr-[11rem]">
          {STAGES.map((s) => (
            <StageColumn key={s.title} stage={s} />
          ))}
        </Reveal>

        {/* ── CTAs + say-hello glyph, bottom-right as in the mockup ──
            Same right reservation as the grid above, so the buttons line up
            with the right edge of THE MARKET STAGE column rather than floating
            somewhere between it and the icon rail. z-20 keeps them above the
            decorative planes, which drift through this band. */}
        <Reveal className="relative z-20 mt-10 flex flex-wrap items-center justify-center gap-3 md:justify-end lg:pr-[11rem]">
          <ContactTrigger
            href="/partner"
            role="Training Partner"
            className="rounded-md bg-[#a02f52] px-7 py-3 text-[0.9rem] font-medium text-white transition-colors hover:bg-[#8c2946]"
          >
            Partner with Us
          </ContactTrigger>
          <ContactTrigger
            href="/training"
            role="Student"
            className="rounded-md bg-zinc-200 px-7 py-3 text-[0.9rem] font-medium text-zinc-700 transition-colors hover:bg-zinc-300"
          >
            Join Training Program
          </ContactTrigger>
          <ContactTrigger
            href="/contact"
            aria-label="Say hello"
            className="transition-transform duration-300 hover:-translate-y-1 hover:scale-110"
          >
            <Image
              src="/images/icons/messages.png"
              alt=""
              width={40}
              height={40}
              className="h-9 w-9 select-none"
            />
          </ContactTrigger>
        </Reveal>
      </div>
    </section>
  );
}
