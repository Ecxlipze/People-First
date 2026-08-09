import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Reveal, Stagger } from "@/app/components/ScrollFx";
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
      viewBox="0 0 1920 320"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] w-full select-none text-zinc-300 xl:h-[26%] xl:text-[#e5ebe5]"
    >
      {[0, 45, 90, 135].map((dy, i) => (
        <path
          key={dy}
          d={`M-80 ${40 + dy} C 260 ${170 + dy}, 620 ${-20 + dy}, 980 ${
            100 + dy
          } C 1320 ${215 + dy}, 1550 ${180 + dy}, 2000 ${-20 + dy}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.62 - i * 0.1}
        />
      ))}
    </svg>
  );
}

function VentureCard({ name, blurb }: { name: string; blurb: string }) {
  return (
    <li className="pf-card rounded-md border border-[#60aaaa] bg-white/40 backdrop-blur-sm px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] xl:rounded-[0.93vh] xl:px-[1.3vw] xl:py-[1.05vh]">
      <p className="text-[0.88rem] font-display font-bold leading-tight text-[#1a1a2e] xl:text-[1.163vh]">
        {name}
      </p>
      <p className="mt-1.5 text-[0.74rem] leading-snug text-zinc-500 xl:mt-[0.35vh] xl:text-[0.93vh] xl:leading-[1.25]">
        {blurb}
      </p>
    </li>
  );
}

function StageColumn({ stage }: { stage: Stage }) {
  return (
    /* h-full + flex-col so all three columns match height on desktop even
       though the middle one holds a single card rather than a list */
    /* pf-card is safe here: <Reveal> writes its entrance transform to the grid
       wrapper above, not to these columns, so hover stays independent. */
    <div
      className="pf-card flex h-full flex-col overflow-hidden rounded-lg border bg-white/70 shadow-[0_10px_30px_-18px_rgba(60,50,110,0.4)] backdrop-blur-sm xl:h-[45.75vh] xl:rounded-[1.24vh] xl:bg-white/20 xl:shadow-none xl:backdrop-blur-sm"
      style={{ borderColor: stage.accent }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 xl:h-[6.36vh] xl:gap-[0.73vw] xl:px-[3.28vw] xl:py-0"
        style={{ backgroundColor: stage.headerBg }}
      >
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/95 text-[0.8rem] font-display font-bold xl:h-[4.5vh] xl:w-[4.5vh] xl:text-[1.705vh]"
          style={{ color: stage.accent }}
        >
          {stage.number}
        </span>
        <h3 className="whitespace-nowrap text-[0.9rem] font-display font-bold tracking-wide text-white xl:text-[1.705vh] xl:tracking-normal">
          {stage.title}
        </h3>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-6 pt-4 xl:px-[1.56vw] xl:pb-[1.4vh] xl:pt-[1.15vh]">
        <p className="text-center text-[0.76rem] leading-relaxed text-zinc-500 xl:mx-auto xl:max-w-[18.75vw] xl:text-[1.085vh] xl:leading-[1.22]">
          {stage.intro}
        </p>

        {stage.feature ? (
          /* THE MIND STAGE — one feature card, centred in the column */
          <div
            className="mt-5 rounded-lg border bg-white/40 backdrop-blur-sm px-5 py-6 text-center xl:mt-[2.5vh] xl:flex xl:h-[19.2vh] xl:flex-col xl:items-center xl:justify-center xl:rounded-[0.93vh] xl:bg-white/40 xl:px-[2vw] xl:py-[1.2vh]"
            style={{ borderColor: `${stage.accent}55` }}
          >
            <GraduationCap
              className="mx-auto h-7 w-7 xl:h-[3.26vh] xl:w-[3.26vh]"
              style={{ color: stage.accent }}
              strokeWidth={2}
              aria-hidden
            />
            <p
              className="mt-3 text-[0.82rem] font-display font-bold leading-tight xl:mt-[1.2vh] xl:max-w-[15vw] xl:-translate-y-[0.5vh] xl:text-[1.163vh]"
              style={{ color: stage.accent }}
            >
              {stage.feature.name}
            </p>
            <p className="mt-3 text-[0.72rem] leading-relaxed text-zinc-500 xl:mt-[1.7vh] xl:max-w-[18.33vw] xl:-translate-y-[1.1vh] xl:text-[1.163vh] xl:leading-[1.35]">
              {stage.feature.blurb}
            </p>
          </div>
        ) : (
          <ul
            className={`mt-4 space-y-2.5 xl:space-y-[0.55vh] ${
              stage.title === "THE MARKET STAGE"
                ? "xl:mt-[5.1vh]"
                : "xl:mt-[1.1vh]"
            }`}
          >
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
    <section className="relative z-10 overflow-hidden rounded-t-[2rem] bg-[linear-gradient(160deg,#fdfbff_0%,#fbf8fe_55%,#f7f3fc_100%)] pb-24 pt-16 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] sm:pb-28 sm:pt-20 xl:min-h-[100svh] xl:rounded-none xl:bg-[#fbf4ff] xl:p-0 xl:shadow-none">
      <Contours />

      {/* cyan wash, upper-left — carries the tint through from section 1 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(120,215,230,0.22)_0%,rgba(120,215,230,0)_70%)] xl:-left-[13vw] xl:top-[12vh] xl:h-[44vw] xl:w-[44vw]"
      />

      {/* The source composition identifies the section with a large logo in
          the upper-left. Smaller layouts keep the compact stacked treatment. */}
      <Image
        src="/images/logo.svg"
        alt="People First"
        width={398}
        height={100}
        sizes="(min-width: 1280px) 19.2vw, 0px"
        className="absolute left-[7.45vw] top-[6.51vh] hidden h-auto w-[19.2vw] max-w-[23rem] xl:block"
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
        className="animate-floaty pointer-events-none absolute bottom-[16%] left-[14%] hidden h-7 w-auto select-none sm:block xl:bottom-[15%] xl:left-[18.4%] xl:h-[4.75vh]"
      />
      <Image
        src="/images/what-we-do/plane-blue.webp"
        alt=""
        aria-hidden
        width={420}
        height={831}
        className="animate-floaty pointer-events-none absolute bottom-[6%] left-[31%] hidden h-28 w-auto select-none sm:block xl:bottom-[4.9%] xl:left-[34.2%] xl:h-[19vh]"
      />
      <Image
        src="/images/what-we-do/crystal-red.webp"
        alt=""
        aria-hidden
        width={260}
        height={302}
        className="animate-floaty pointer-events-none absolute bottom-[7%] left-[45%] hidden h-6 w-auto select-none sm:block xl:bottom-[4.9%] xl:left-[62.1%] xl:h-[4.8vh]"
      />
      {/* kept left of the CTA row: the buttons occupy the right half of this
          band, and the plane is tall enough to cross them from anywhere nearer */}
      <Image
        src="/images/what-we-do/plane-teal.webp"
        alt=""
        aria-hidden
        width={420}
        height={831}
        className="animate-floaty pointer-events-none absolute bottom-[3%] left-[41%] hidden h-28 w-auto select-none sm:block xl:bottom-[5.2%] xl:left-[69.5%] xl:h-[21.2vh]"
      />

      {/* No right padding on the container: it would shrink the content box
          from the right and pull the centred heading off the page's true
          centre. Only the grid and CTAs need to clear the icon rail, so they
          reserve that space themselves. max-w-7xl so the columns run wide. */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 xl:h-[100svh] xl:max-w-none xl:px-0">
        <Reveal className="text-center xl:pt-[17.67vh]">
          <h2 className="text-xl font-display font-extrabold tracking-tight text-[#1a1a2e] sm:text-2xl lg:text-[1.75rem] xl:text-[3.1vh] xl:leading-none xl:text-black">
            <span className="inline-block xl:scale-x-[1.07]">
              THE PEOPLE FIRST ECOSYSTEM
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-[0.8rem] leading-relaxed text-zinc-600 sm:text-[0.85rem] xl:mt-[1.7vh] xl:max-w-[50vw] xl:text-[1.705vh] xl:leading-[1.23] xl:text-black">
            The People First Evolution Model sequences human potential across
            Physical, Mind, and Market circles, deploying synchronized ventures
            and strategic JVs for rapid, self-sustaining growth.
          </p>
        </Reveal>

        {/* the grid and the CTAs below reserve just enough room for the icon
            rail, whose labels start around 1164px at a 1440 viewport */}
        <Stagger
          className="mt-12 grid items-stretch gap-6 md:grid-cols-3 md:gap-5 lg:pr-[11rem] xl:absolute xl:left-[8.33vw] xl:top-[33.49vh] xl:mt-0 xl:w-[70.83vw] xl:grid-cols-3 xl:gap-[1.08vw] xl:pr-0"
          step={90}
        >
          {STAGES.map((s) => (
            <StageColumn key={s.title} stage={s} />
          ))}
        </Stagger>

        {/* ── CTAs + say-hello glyph, bottom-right as in the mockup ──
            Same right reservation as the grid above, so the buttons line up
            with the right edge of THE MARKET STAGE column rather than floating
            somewhere between it and the icon rail. z-20 keeps them above the
            decorative planes, which drift through this band. */}
        <div className="relative z-20 mt-10 flex w-full animate-fade-in-up flex-col items-stretch gap-3 min-[500px]:flex-row min-[500px]:flex-wrap min-[500px]:items-center min-[500px]:justify-center md:w-auto md:justify-end lg:pr-[11rem] xl:absolute xl:bottom-[6.4vh] xl:left-[60vw] xl:mt-0 xl:flex-nowrap xl:gap-3 xl:pr-0">
          <ContactTrigger
            href="/partner"
            role="Training Partner"
            className="flex w-full items-center justify-center rounded-md bg-[#9f4163] px-5 py-2 text-[0.8rem] font-display font-medium text-white transition-colors hover:bg-[#8e3a59] min-[500px]:inline-flex min-[500px]:w-auto xl:whitespace-nowrap"
          >
            Partner with Us
          </ContactTrigger>
          <ContactTrigger
            href="/training"
            role="Student"
            className="flex w-full items-center justify-center rounded-md bg-[#dbdbdb] px-5 py-2 text-[0.8rem] font-display font-medium text-zinc-700 transition-colors hover:bg-[#cecece] min-[500px]:inline-flex min-[500px]:w-auto xl:whitespace-nowrap"
          >
            Join Training Program
          </ContactTrigger>
          <ContactTrigger
            href="/contact"
            aria-label="Say hello"
            className="hidden sm:block mx-auto mt-2 transition-transform duration-300 hover:-translate-y-1 hover:scale-110 min-[500px]:mx-0 min-[500px]:mt-0"
          >
            <Image
              src="/images/icons/messages.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 select-none xl:h-8 xl:w-8"
            />
          </ContactTrigger>
        </div>
      </div>
    </section>
  );
}
