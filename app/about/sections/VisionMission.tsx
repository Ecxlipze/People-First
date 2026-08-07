import Image from "next/image";
import {
  BookOpen,
  TrendingUp,
  Users,
  Trophy,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, Stagger } from "@/app/components/ScrollFx";

/* About → Vision & Mission. Two rows (Vision / Mission), each a circular icon +
   heading + rich copy, with a dotted world-map illustration flanking them. Below
   sits the Learn × Grow × Lead × Transform step row inside a lavender container.
   Origami paper-plane accents in the corners echo the mockup. */

const STEPS: { label: string; sub: string; icon: LucideIcon }[] = [
  { label: "LEARN", sub: "Build Knowledge. Sharpen Skills.", icon: BookOpen },
  { label: "GROW", sub: "Fuel Growth. Create Impact.", icon: TrendingUp },
  { label: "LEAD", sub: "Inspire Others. Drive Change.", icon: Users },
  {
    label: "TRANSFORM",
    sub: "Build World Class Market Leaders.",
    icon: Trophy,
  },
];

export default function VisionMission() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-12 pt-16 sm:px-10 sm:pb-16 sm:pt-24 lg:px-24 xl:px-28">
      {/* Decorative ribbon and faceted paper-plane accents from the mockup. */}
      <Image
        src="/images/about-page/blob.png"
        alt=""
        aria-hidden
        width={410}
        height={291}
        className="pointer-events-none absolute left-0 top-0 w-72 -translate-x-[12%] select-none opacity-85 sm:w-[360px] lg:w-[410px]"
      />
      {/* The two paper planes drift gently — they are the one element in this
          section that reads as "in flight", so leaving them frozen is what makes
          the panel feel like a screenshot. Offset delays keep them independent. */}
      <Image
        src="/images/about-page/left-plane.png"
        alt=""
        aria-hidden
        width={246}
        height={262}
        className="animate-floaty pointer-events-none absolute bottom-20 left-[10%] w-28 -scale-x-100 select-none sm:w-40 lg:w-48"
      />
      <Image
        src="/images/about-page/right-plane.png"
        alt=""
        aria-hidden
        width={212}
        height={214}
        style={{ animationDelay: "-3s" }}
        className="animate-floaty pointer-events-none absolute right-[11%] top-24 w-20 select-none sm:w-28"
      />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <Reveal className="mx-auto flex max-w-4xl items-center justify-center gap-6 text-center">
          <span
            aria-hidden
            className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-[#6f8bcf] sm:block"
          />
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl">
              VISION &amp; MISSION
            </h2>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.06em] text-zinc-700 sm:text-sm">
              Our Purpose. Our Promise. Our Path Forward.
            </p>
          </div>
          <span
            aria-hidden
            className="hidden h-px flex-1 bg-gradient-to-r from-[#6f8bcf] to-transparent sm:block"
          />
        </Reveal>

        <Stagger
          className="mt-16 grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_370px]"
          step={120}
        >
          {/* ── vision + mission rows ── */}
          <div className="space-y-12 lg:space-y-16">
            <div className="group flex flex-col items-center gap-8 sm:flex-row sm:items-start lg:gap-12">
              {/* target/maze icon — note the provided file is named mission.png
                  but its art is the VISION target (filenames are swapped). */}
              <Image
                src="/images/about-page/mission.png"
                alt=""
                aria-hidden
                width={261}
                height={261}
                className="pf-pop h-44 w-44 flex-none select-none object-contain sm:h-52 sm:w-52"
              />
              <div className="max-w-[750px] text-center sm:text-left sm:pt-4">
                <h3 className="font-display text-2xl font-bold uppercase text-[#491557] sm:text-3xl">
                  OUR VISION
                </h3>
                <p className="mt-4 text-sm font-normal leading-[1.7] text-zinc-800 sm:text-base sm:leading-[1.8] lg:text-lg lg:leading-[1.7]">
                  A compounding global ecosystem{" "}
                  <strong className="font-bold text-[#491557]">
                    launching 100 market-ready brands
                  </strong>{" "}
                  by the end of 2028 to{" "}
                  <strong className="font-bold text-[#491557]">
                    eliminate
                  </strong>{" "}
                  economic isolation and drive{" "}
                  <strong className="font-bold text-[#491557]">
                    decentralized community leadership.
                  </strong>
                </p>
              </div>
            </div>

            <div className="group flex flex-col items-center gap-8 sm:flex-row sm:items-start lg:gap-12">
              {/* mountain/flag icon — the provided file is named vision.png but
                  its art is the MISSION mountain (filenames are swapped). */}
              <Image
                src="/images/about-page/vision.png"
                alt=""
                aria-hidden
                width={261}
                height={261}
                className="pf-pop h-44 w-44 flex-none select-none object-contain sm:h-52 sm:w-52"
              />
              <div className="max-w-[750px] text-center sm:text-left sm:pt-4">
                <h3 className="font-display text-2xl font-bold uppercase text-[#491557] sm:text-3xl">
                  OUR MISSION
                </h3>
                <p className="mt-4 text-sm font-normal leading-[1.7] text-zinc-800 sm:text-base sm:leading-[1.8] lg:text-lg lg:leading-[1.7]">
                  We{" "}
                  <strong className="font-bold text-[#491557]">
                    replace isolation with collective growth.
                  </strong>{" "}
                  By uniting different sectors into one venture-building engine,
                  we empower people to{" "}
                  <strong className="font-bold text-[#491557]">
                    Learn × Grow × Lead × Transform
                  </strong>{" "}
                  raw talent into world-class market leaders.
                </p>
              </div>
            </div>
          </div>

          {/* ── world map — the real dotted map with connection points ── */}
          <div className="relative mx-auto w-full max-w-md">
            <Image
              src="/images/about-page/globe.png"
              alt=""
              aria-hidden
              width={370}
              height={596}
              className="mx-auto w-full max-w-[16rem] select-none lg:max-w-[370px]"
            />
          </div>
        </Stagger>

        {/* ── Learn × Grow × Lead × Transform step row ── */}
        <Reveal className="mx-auto mt-16 max-w-2xl rounded-2xl bg-[#d9cff7] px-4 py-6 shadow-[0_18px_30px_-18px_rgba(50,30,80,0.6)] sm:px-8 sm:py-8">
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4 sm:flex-1">
                {/* Each step is its own hover group: the icon pops and the whole
                    step lifts slightly, so the four stages of the model read as
                    individually explorable rather than as a printed diagram. */}
                <div className="group flex flex-1 flex-col items-center rounded-lg px-2 py-1 text-center transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-soft)] hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm sm:h-14 sm:w-14">
                    <s.icon
                      className="pf-pop h-6 w-6 text-pf-purple sm:h-7 sm:w-7"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-pf-purple">
                    {s.label}
                  </span>
                  <span className="mt-1 max-w-[9rem] text-[11px] leading-tight text-zinc-500">
                    {s.sub}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight
                    aria-hidden
                    className="hidden h-5 w-5 flex-none text-pf-lead/60 sm:block"
                  />
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
