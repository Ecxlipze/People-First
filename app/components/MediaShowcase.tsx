"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MediaFrame, StatCard } from "@/app/components/media";

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
// remap a slice of overall progress [from,to] to 0..1
const slice = (p: number, from: number, to: number) =>
  clamp01((p - from) / (to - from));

/* An Apple-style pinned scroll stage: the section holds in the middle of the
   viewport for a beat while, driven purely by scroll position, the media frame
   scales up, then the text and stat card fade/slide in as it settles. Releases
   into the next section once the track is scrolled through. */
export default function MediaShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const media = mediaRef.current;
    const text = textRef.current;
    const stat = statRef.current;
    if (!track || !media || !text || !stat) return;

    // The pinned scale/fade stage runs from `md` (768px) up; below that
    // (phones) it flows normally so nothing is clipped above the fold.
    const desktop = window.matchMedia("(min-width: 768px)");

    const disable = () => {
      // No pinning: collapse the track and show everything in place.
      track.style.height = "auto";
      if (stageRef.current) stageRef.current.style.height = "auto";
      media.style.transform = "none";
      text.style.opacity = "1";
      text.style.transform = "none";
      stat.style.opacity = "1";
      stat.style.transform = "none";
    };

    let raf = 0;
    let attached = false;
    const update = () => {
      const r = track.getBoundingClientRect();
      const distance = r.height - window.innerHeight; // scroll travelled while pinned
      const p = distance > 0 ? clamp01(-r.top / distance) : 0;

      // media scales up through the first ~60% of the pin, then holds.
      const grow = slice(p, 0, 0.6);
      media.style.transform = `scale(${lerp(0.62, 1, grow)})`;

      // text fades + rises in over the middle stretch.
      const t = slice(p, 0.2, 0.55);
      text.style.opacity = String(t);
      text.style.transform = `translateY(${lerp(40, 0, t)}px)`;

      // stat card slides in last.
      const s = slice(p, 0.55, 0.85);
      stat.style.opacity = String(s);
      stat.style.transform = `translateY(${lerp(28, 0, s)}px) scale(${lerp(
        0.9,
        1,
        s,
      )})`;

      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const apply = () => {
      const on = desktop.matches && !prefersReduced();
      if (on) {
        track.style.height = "";
        if (stageRef.current) stageRef.current.style.height = "";
        if (!attached) {
          window.addEventListener("scroll", onScroll, { passive: true });
          attached = true;
        }
        update();
      } else {
        if (attached) {
          window.removeEventListener("scroll", onScroll);
          attached = false;
        }
        disable();
      }
    };

    apply();
    desktop.addEventListener("change", apply);
    window.addEventListener("resize", onScroll);
    return () => {
      desktop.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={trackRef} className="relative h-[260vh] max-md:!h-auto">
      <div
        ref={stageRef}
        className="flex overflow-hidden md:sticky md:top-0 md:h-screen md:items-center"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 sm:px-10 md:grid-cols-2 md:gap-16 lg:pr-32">
          {/* text — fades/rises in */}
          <div
            ref={textRef}
            className="order-2 md:order-1"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          >
            <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
              Podcast: market strategy
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-500">
              We are strategy consultants who work with startup strategies and
              help promote and sell your products, including helping marketing.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span className="text-4xl font-extrabold text-[#e0325a] sm:text-5xl">
                80%
              </span>
              <span className="text-sm font-medium leading-tight text-zinc-500">
                Increased
                <br />
                Performance Rate
              </span>
            </div>
          </div>

          {/* media — scales through the pin */}
          <div className="relative order-1 md:order-2">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_70%_60%,rgba(226,124,203,0.45)_0%,rgba(226,124,203,0)_65%)]"
            />
            <Image
              src="/images/pattern.png"
              alt=""
              aria-hidden
              width={1923}
              height={462}
              className="pointer-events-none absolute -right-4 -top-10 hidden h-16 w-auto rotate-[8deg] select-none object-contain object-left opacity-90 sm:block"
            />
            <div ref={mediaRef} style={{ willChange: "transform" }}>
              <MediaFrame
                src="/images/featured/feature1.webp"
                alt="A man working on a laptop during a late-evening podcast recording session"
              />
            </div>
            <div
              ref={statRef}
              className="absolute -bottom-6 -left-4 sm:-left-8"
              style={{ opacity: 0, willChange: "transform, opacity" }}
            >
              <StatCard value="27%">
                have knowledge about market strategies.
              </StatCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
