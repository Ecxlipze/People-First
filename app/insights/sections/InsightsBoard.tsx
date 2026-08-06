"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import SmartImage from "@/app/components/SmartImage";
import ContactTrigger from "@/app/contact/ContactTrigger";
import { CountUp, Reveal, Stagger } from "@/app/components/ScrollFx";
import {
  ALL_CATEGORY,
  CATEGORY_OPTIONS,
  INSIGHTS,
  type Insight,
} from "@/app/insights/insights";

/* Insights by People First — the filterable article index.

   Mirrors the mockup (public/images/Studio.pdf) top to bottom:
     · a toolbar: "All Category" dropdown left, Partner / Join CTAs and a chat
       icon right
     · one editorial feature, copy left / media right
     · its media block: a rainbow glow, a tall still, a paper-plane accent,
       and a teal card clipping its lower-left corner

   Client component because the dropdown filters the list. The filtering is the
   only state; everything below it is presentational.

   The media/copy composition deliberately matches Ideas Lab's
   RecommendedArticles — the mockups specify the same treatment, and a second
   divergent implementation of it would be the thing that looks wrong. */

/* The multi-hued wash behind each thumbnail. Four offset radial gradients read
   as one soft rainbow bloom, matching the mockup without needing a raster. */
function RainbowGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-8 -z-10 select-none blur-3xl sm:-inset-10"
      style={{
        background: `
          radial-gradient(circle at 20% 28%, rgba(90,205,180,0.95) 0%, rgba(90,205,180,0) 50%),
          radial-gradient(circle at 80% 20%, rgba(130,140,245,0.9) 0%, rgba(130,140,245,0) 50%),
          radial-gradient(circle at 26% 84%, rgba(245,105,195,0.95) 0%, rgba(245,105,195,0) 50%),
          radial-gradient(circle at 72% 80%, rgba(255,175,90,0.9) 0%, rgba(255,175,90,0) 50%),
          radial-gradient(circle at 52% 55%, rgba(190,120,240,0.7) 0%, rgba(190,120,240,0) 55%)
        `,
      }}
    />
  );
}

function Media({
  insight,
  plane,
}: {
  insight: Insight;
  plane: "left" | "right";
}) {
  const thumb = insight.studioThumb ?? insight.thumb;
  const thumbAlt = insight.studioThumbAlt ?? insight.thumbAlt;

  return (
    <div className="relative mx-auto w-full max-w-[38.75rem]">
      <RainbowGlow />

      {/* paper plane accent — sits above the frame, opposite the copy */}
      <Image
        src={
          plane === "right"
            ? "/images/ideas-lab/plane-teal.webp"
            : "/images/ideas-lab/plane-blue.webp"
        }
        alt=""
        aria-hidden
        width={253}
        height={500}
        className={`animate-floaty pointer-events-none absolute -top-16 z-20 hidden h-24 w-auto select-none sm:block xl:-top-20 xl:h-32 ${
          plane === "right" ? "-right-4" : "-left-4"
        }`}
      />

      {/* Tall editorial crop from Studio.pdf. This is an article image, not a
          video, so it intentionally has no play control. */}
      <div className="relative ml-auto aspect-[1.03/1] w-[87%] overflow-hidden rounded-sm bg-zinc-800 shadow-[0_20px_50px_-24px_rgba(40,40,80,0.6)] transition-shadow duration-300 group-hover:shadow-[0_30px_60px_-22px_rgba(40,40,80,0.75)]">
        <SmartImage
          src={thumb}
          alt={thumbAlt}
          fill
          sizes="(max-width: 768px) 87vw, (max-width: 1280px) 42vw, 34rem"
          skeleton
          style={{ objectPosition: insight.thumbPosition ?? "center" }}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      {/* Teal card straddling the still's LEFT edge, roughly centred on it and
          clear of the frame's bottom — the mockup's placement. Sitting it
          outside the frame rather than inside is deliberate: the stills are
          photographs of people, and a card within the frame covers faces. */}
      <div className="absolute left-0 top-[58%] z-10 w-[9rem] -translate-y-1/2 rounded-md rounded-tl-none bg-[#68a9a8] px-5 py-5 text-white shadow-[0_14px_30px_-14px_rgba(40,80,70,0.7)] sm:w-[11rem] sm:px-6 sm:py-7 lg:w-[13rem] lg:px-7 lg:py-8 xl:-left-12 xl:w-[15rem] xl:px-8 xl:py-10">
        <CountUp
          value={insight.cardValue}
          className="font-heading block text-2xl font-extrabold leading-none sm:text-[1.75rem] lg:text-[2.5rem] xl:text-[3rem]"
        />
        {/* The mockup treats this overlapping tile as a compact display label. */}
        <p className="mt-2 whitespace-pre-line text-[0.7rem] font-bold uppercase leading-tight sm:text-[0.8rem] lg:text-base">
          {insight.cardLabel}
        </p>
      </div>
    </div>
  );
}

function Copy({ insight }: { insight: Insight }) {
  return (
    <div className="mx-auto w-full max-w-[29rem]">
      {/* Pencil-cup icon above the headline, as in the mockup. Extracted from
          Studio.pdf and background-keyed to transparency — the PDF renders it on
          a flat near-white lavender, which would otherwise show as a grey box
          against this section. */}
      <Image
        src="/images/insights/pencil-cup.webp"
        alt=""
        aria-hidden
        width={320}
        height={300}
        className="pf-pop mb-6 h-16 w-auto select-none sm:h-20"
      />
      <h3 className="text-2xl font-extrabold leading-[1.12] tracking-tight text-[#171922] transition-colors duration-200 group-hover:text-[#c64047] sm:text-3xl lg:text-[2.15rem] xl:text-[2.375rem]">
        {insight.title}
      </h3>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500 lg:text-base">
        {insight.blurb}
      </p>
      <div className="mt-10 flex items-center gap-4 lg:mt-14">
        <CountUp
          value={insight.metric}
          className="text-3xl font-extrabold text-[#d72f40] sm:text-[2.25rem] lg:text-[2.65rem]"
        />
        <span className="whitespace-pre-line text-xs font-medium leading-tight text-zinc-500 lg:text-sm">
          {insight.metricLabel}
        </span>
      </div>
    </div>
  );
}

export default function InsightsBoard() {
  const [category, setCategory] = useState<string>(ALL_CATEGORY);
  const selectId = useId();

  const visible = useMemo(
    () =>
      category === ALL_CATEGORY
        ? INSIGHTS.slice(0, 1)
        : INSIGHTS.filter((i) => i.category === category),
    [category],
  );

  return (
    <section className="relative z-10 px-6 pb-24 pt-20 sm:px-10 sm:pb-28 sm:pt-24 lg:px-20 lg:pt-28 xl:px-28 xl:pb-40 xl:pt-32">
      <div className="mx-auto max-w-[80rem]">
        {/* ── toolbar ── */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-between">
          {/* The dropdown is a real <select> with a visually-hidden label, so it
              is keyboard- and screen-reader-native and gets the platform's own
              option list on mobile. The chevron is decorative; `appearance-none`
              hides the browser's so the mockup's boxed one shows instead. */}
          <div className="relative inline-flex items-center gap-3">
            <label htmlFor={selectId} className="sr-only">
              Filter insights by category
            </label>
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 grid h-6 w-6 place-items-center rounded border border-zinc-400 text-zinc-600"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </span>
            <select
              id={selectId}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pf-interactive cursor-pointer appearance-none rounded bg-transparent py-1.5 pl-9 pr-2 text-xl font-medium text-[#171922] hover:text-[#c64047] sm:text-2xl"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:w-auto sm:justify-end">
            <ContactTrigger
              href="/partner"
              role="Training Partner"
              className="pf-interactive inline-flex min-h-11 items-center rounded bg-[#a84666] px-6 text-sm font-medium text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#8f3856] sm:px-7 sm:text-base"
            >
              Partner with Us
            </ContactTrigger>
            <ContactTrigger
              href="/training"
              role="Student"
              className="pf-interactive inline-flex min-h-11 items-center rounded bg-[#dedede] px-6 text-sm font-medium text-[#171922] shadow-sm hover:-translate-y-0.5 hover:bg-[#cbcbcb] sm:px-7 sm:text-base"
            >
              Join Training Program
            </ContactTrigger>
            {/* The mockup's chat mark. It opens the same contact panel the CTAs
                do, so it is a real control rather than decoration. */}
            <ContactTrigger
              href="/contact"
              className="pf-interactive grid h-11 w-11 place-items-center rounded-full hover:-translate-y-0.5"
              aria-label="Contact People First"
            >
              <Image
                src="/images/icons/messages.png"
                alt=""
                width={46}
                height={46}
                className="h-8 w-8 object-contain"
              />
            </ContactTrigger>
          </div>
        </div>

        {/* ── editorial feature ──
            `key={category}` remounts the list when the filter changes, which
            replays the entrance animation for the new feature. Without it the
            already-revealed article would swap content in place with no motion,
            making the filter feel like nothing happened. */}
        <Stagger
          key={category}
          className="mt-28 sm:mt-32 lg:mt-40 xl:mt-44"
          step={80}
        >
          {visible.map((insight) => (
            <div key={insight.title}>
              <article className="group grid items-center gap-14 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:gap-16 lg:gap-20 xl:grid-cols-[minmax(440px,0.76fr)_minmax(620px,1.24fr)] xl:gap-24">
                <Copy insight={insight} />
                <Media insight={insight} plane="right" />
              </article>
            </div>
          ))}
        </Stagger>

        {/* Every category currently has at least one article, so this is a
            safeguard for future data rather than a state the mockup shows —
            but a filter that can silently yield a blank page is worse than one
            that says so. */}
        {visible.length === 0 && (
          <Reveal className="mt-20 text-center">
            <p className="text-sm text-zinc-500">
              No insights in this category yet.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
