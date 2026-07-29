import Image from "next/image";
import {
  BookOpen,
  TrendingUp,
  Users,
  Trophy,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/app/components/ScrollFx";

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
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:px-10 sm:py-32 lg:px-24 xl:px-28">
      {/* Decorative ribbon and faceted paper-plane accents from the mockup. */}
      <Image
        src="/images/about-page/blob.png"
        alt=""
        aria-hidden
        width={410}
        height={291}
        className="pointer-events-none absolute left-0 top-0 w-72 -translate-x-[12%] select-none opacity-85 sm:w-[360px] lg:w-[410px]"
      />
      <Image
        src="/images/about-page/left-plane.png"
        alt=""
        aria-hidden
        width={246}
        height={262}
        className="pointer-events-none absolute bottom-20 left-[10%] w-20 select-none sm:w-32"
      />
      <Image
        src="/images/about-page/right-plane.png"
        alt=""
        aria-hidden
        width={212}
        height={214}
        className="pointer-events-none absolute right-[11%] top-24 w-20 select-none sm:w-28"
      />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <Reveal className="mx-auto flex max-w-4xl items-center justify-center gap-6 text-center">
          <span
            aria-hidden
            className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-[#6f8bcf] sm:block"
          />
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl">
              VISION &amp; MISSION
            </h2>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.06em] text-zinc-700 sm:text-sm">
              Our Purpose. Our Promise. Our Path Forward.
            </p>
          </div>
          <span
            aria-hidden
            className="hidden h-px flex-1 bg-gradient-to-r from-[#6f8bcf] to-transparent sm:block"
          />
        </Reveal>

        <Reveal className="mt-20 grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_370px]">
          {/* ── vision + mission rows ── */}
          <div className="space-y-12">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
              {/* target/maze icon — note the provided file is named mission.png
                  but its art is the VISION target (filenames are swapped). */}
              <Image
                src="/images/about-page/mission.png"
                alt=""
                aria-hidden
                width={261}
                height={261}
                className="h-44 w-44 flex-none select-none object-contain sm:h-52 sm:w-52"
              />
              <div className="max-w-[750px] text-center sm:text-left">
                <h3 className="border-b border-pf-purple/25 pb-2 text-2xl font-bold text-pf-purple sm:text-3xl">
                  OUR VISION
                </h3>
                <p className="mt-6 text-base leading-relaxed text-zinc-950 sm:text-xl">
                  A compounding global ecosystem{" "}
                  <strong className="font-bold text-pf-purple">
                    launching 100 market-ready brands
                  </strong>{" "}
                  by the end of 2028 to{" "}
                  <strong className="font-bold text-pf-purple">
                    eliminate
                  </strong>{" "}
                  economic isolation and drive{" "}
                  <strong className="font-bold text-pf-purple">
                    decentralized community leadership.
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
              {/* mountain/flag icon — the provided file is named vision.png but
                  its art is the MISSION mountain (filenames are swapped). */}
              <Image
                src="/images/about-page/vision.png"
                alt=""
                aria-hidden
                width={261}
                height={261}
                className="h-44 w-44 flex-none select-none object-contain sm:h-52 sm:w-52"
              />
              <div className="max-w-[750px] text-center sm:text-left">
                <h3 className="border-b border-pf-purple/25 pb-2 text-2xl font-bold text-pf-purple sm:text-3xl">
                  OUR MISSION
                </h3>
                <p className="mt-6 text-base leading-relaxed text-zinc-950 sm:text-xl">
                  We{" "}
                  <strong className="font-bold text-pf-purple">
                    replace isolation with collective growth.
                  </strong>{" "}
                  By uniting different sectors into one venture-building engine,
                  we empower people to{" "}
                  <strong className="font-bold text-pf-purple">
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
        </Reveal>

        {/* ── Learn × Grow × Lead × Transform step row ── */}
        <Reveal className="mx-auto mt-16 max-w-2xl rounded-2xl bg-[#d9cff7] px-4 py-6 shadow-[0_18px_30px_-18px_rgba(50,30,80,0.6)] sm:px-8 sm:py-8">
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4 sm:flex-1">
                <div className="flex flex-1 flex-col items-center text-center">
                  <s.icon className="h-7 w-7 text-pf-lead" strokeWidth={1.75} />
                  <span className="mt-2 text-sm font-extrabold tracking-[0.12em] text-pf-purple">
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
