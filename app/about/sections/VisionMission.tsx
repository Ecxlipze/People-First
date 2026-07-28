import Image from "next/image";
import {
  BookOpen,
  TrendingUp,
  Users,
  Trophy,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    <section className="relative overflow-hidden bg-white px-6 py-20 sm:px-10 sm:py-24">
      {/* decorative accents — purple ribbon blobs in the top-left & bottom-left
          corners, with the faceted paper-plane pairs flanking the top corners
          (matches the mockup). Purely aesthetic. */}
      <Image
        src="/images/about-page/blob.png"
        alt=""
        aria-hidden
        width={410}
        height={291}
        className="pointer-events-none absolute -left-8 -top-8 w-48 select-none sm:w-64"
      />
      <Image
        src="/images/about-page/blob.png"
        alt=""
        aria-hidden
        width={410}
        height={291}
        className="pointer-events-none absolute -bottom-8 -left-8 w-40 -scale-y-100 select-none sm:w-56"
      />
      <Image
        src="/images/about-page/left-plane.png"
        alt=""
        aria-hidden
        width={246}
        height={262}
        className="pointer-events-none absolute left-4 top-8 w-16 select-none sm:left-10 sm:w-20"
      />
      <Image
        src="/images/about-page/right-plane.png"
        alt=""
        aria-hidden
        width={212}
        height={214}
        className="pointer-events-none absolute right-6 top-8 w-16 select-none sm:right-12 sm:w-20"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            VISION &amp; MISSION
          </h2>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">
            Our Purpose. Our Promise. Our Path Forward.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          {/* ── vision + mission rows ── */}
          <div className="space-y-10">
            <div className="flex items-start gap-5">
              {/* target/maze icon — note the provided file is named mission.png
                  but its art is the VISION target (filenames are swapped). */}
              <Image
                src="/images/about-page/mission.png"
                alt=""
                aria-hidden
                width={261}
                height={261}
                className="h-16 w-16 flex-none select-none object-contain"
              />
              <div>
                <h3 className="text-xl font-bold text-pf-purple">OUR VISION</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-600">
                  A compounding global ecosystem{" "}
                  <strong className="font-bold text-zinc-900">
                    launching 100 market-ready brands
                  </strong>{" "}
                  by the end of 2028 to{" "}
                  <strong className="font-bold text-zinc-900">eliminate</strong>{" "}
                  economic isolation and drive{" "}
                  <strong className="font-bold text-zinc-900">
                    decentralized community leadership.
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              {/* mountain/flag icon — the provided file is named vision.png but
                  its art is the MISSION mountain (filenames are swapped). */}
              <Image
                src="/images/about-page/vision.png"
                alt=""
                aria-hidden
                width={261}
                height={261}
                className="h-16 w-16 flex-none select-none object-contain"
              />
              <div>
                <h3 className="text-xl font-bold text-pf-purple">
                  OUR MISSION
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-600">
                  We{" "}
                  <strong className="font-bold text-zinc-900">
                    replace isolation with collective growth.
                  </strong>{" "}
                  By uniting different sectors into one venture-building engine,
                  we empower people to Learn × Grow × Lead × Transform,
                  transforming raw talent into world-class market leaders.
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
              className="mx-auto w-full max-w-[16rem] select-none lg:max-w-sm"
            />
          </div>
        </div>

        {/* ── Learn × Grow × Lead × Transform step row ── */}
        <div className="mt-16 rounded-2xl bg-pf-lavender px-4 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4 sm:flex-1">
                <div className="flex flex-1 flex-col items-center text-center">
                  <s.icon className="h-6 w-6 text-pf-lead" strokeWidth={1.75} />
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
        </div>
      </div>
    </section>
  );
}
