"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { type Venture } from "@/app/components/ventures";
import Link from "next/link";
import { SECTORS } from "@/app/components/ecosystem";
import PinnedRecede from "@/app/components/PinnedRecede";
import { Reveal, Stagger } from "@/app/components/ScrollFx";

// Match venture brands and legacy names to the shared ecosystem labels.
const SECTOR_ALIASES: Record<string, string> = {
  merchanity: "e-commerce",
  ecommerce: "e-commerce",
  insights: "media & marketing",
  "sme & consumer": "smes",
  "health care": "health & wellness",
  "abaad.pk": "real estate",
  "kissan veer": "agriculture",
  knowledge: "knowledge capital",
};

// Explicit line breaks keep the complete copy on two balanced lines.
const LIVE_TAGLINES: Record<string, [string, string]> = {
  agriculture: ["Helping farmers", "grow and thrive."],
  "real estate": ["Discover property.", "Find your place."],
  "e-commerce": ["Connecting buyers", "and businesses."],
  "media & marketing": ["Watch our channel", "on YouTube."],
};

const COMING_SOON_TAGLINES: Record<string, [string, string]> = {
  "health & wellness": ["Better wellbeing", "is on the way."],
  "renewable energy": ["Cleaner energy", "is coming soon."],
  "knowledge capital": ["People First Socio", "Economic Empowerment"],
  technology: ["New solutions", "are taking shape."],
  smes: ["Business support", "is coming soon."],
};

function sectorIndex(venture: Venture) {
  const name = venture.name.trim().toLowerCase();
  const label = SECTOR_ALIASES[name] ?? name;
  const index = SECTORS.findIndex((sector) => sector.label.toLowerCase() === label);
  return index < 0 ? SECTORS.length : index;
}

/* Ventures swipe over Story, then pin so Featured Work can overlap them.
   Heading and cards reveal as the block rises. */
export default function VenturesShowcase({
  ventures,
}: {
  ventures: Venture[];
}) {
  // Copy before sorting so API data stays untouched; unmatched cards follow the ecosystem.
  const orderedVentures = [...ventures].sort((a, b) => sectorIndex(a) - sectorIndex(b));
  return (
    /* Outer track: negative margin + rounded opaque bg → swipes up over Featured
       Work. PinnedRecede inside gives Ventures its own pin so Gallery can later
       swipe over it. */
    <div className="pf-blend relative z-30 rounded-t-[2rem] bg-[#f2f8f8] shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] max-md:-mt-16 sm:rounded-t-[3rem] md:-mt-[100vh]">
      <PinnedRecede
        pinTallContent
        // Content determines the panel height so card rows never overlap the heading.
        className="pf-seam relative flex flex-col items-center py-12 sm:py-16 xl:py-20 xl:pr-24"
      >
        {/* decorative paper-plane pairs, flanking the heading in the top corners
            (matches the mockup). Purely aesthetic. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Keep the decorative planes outside the centered heading. */}
          <Image
            src="/images/icons/left-plane.png"
            alt=""
            width={392}
            height={353}
            className="absolute left-2 top-8 hidden w-[10vw] select-none xl:block"
          />
          <Image
            src="/images/icons/right-plane.png"
            alt=""
            width={256}
            height={227}
            className="absolute right-24 top-8 hidden w-[9vw] select-none xl:block"
          />
        </div>

        {/* Heading and cards stay in normal flow as copy wraps across breakpoints. */}
        <Reveal className="relative mx-auto w-full max-w-4xl px-6 text-center">
          <h2 className="font-heading text-xl font-light leading-snug tracking-tight text-[#118d89] sm:text-2xl lg:text-3xl xl:text-4xl">
            We shape <strong className="font-black">capable</strong>,{" "}
            <strong className="font-black">confident</strong>, and{" "}
            <strong className="font-black">market-ready</strong> individuals
            through comprehensive personal and professional growth. Through our
            core, joint, affiliate, and genesis ventures
          </h2>
        </Reveal>

        {/* Equal gaps and automatic heights keep every row aligned. At xl the
            second row is centered; smaller screens use two or three columns. */}
        <Stagger
          className="relative mx-auto mt-8 grid w-full max-w-7xl auto-rows-fr grid-cols-1 gap-4 min-[360px]:grid-cols-2 px-4 sm:mt-10 sm:gap-5 sm:px-6 lg:grid-cols-3 lg:px-8 xl:mt-12 xl:flex xl:flex-wrap xl:justify-center"
          step={55}
        >
          {orderedVentures.map((v) => {
            // Cards without a website stay inert and show a Coming Soon CTA.
            const name = v.name.trim().toLowerCase();
            const sectorName = SECTOR_ALIASES[name] ?? name;
            const sector = SECTORS.find((s) => s.label.toLowerCase() === sectorName);
            const isYoutube = sectorName === "media & marketing";
            const href = isYoutube ? "https://www.youtube.com/@TheMindsBehindOfficial" : v.href;
            const live = href !== "#" && href !== "";
            const external = /^https?:\/\//.test(href);
            const title = sectorName === "knowledge capital"
              ? "PFSEE"
              : isYoutube ? "The Minds Behind" : live ? v.name : "Coming Soon";
            const cardClass =
              "flex h-full flex-col overflow-hidden rounded-[calc(0.75rem-1px)] bg-white";
            const body = (
              <>
              {/* Reuse the ecosystem's white line artwork and teal heading
                  treatment rather than introducing a second illustration style. */}
              <div className="flex min-h-28 items-center gap-2 px-4 py-5 sm:gap-4 sm:px-5">
                {sector && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#118d89] p-2.5 sm:h-12 sm:w-12 sm:p-3">
                    <Image
                      src={sector.iconSrc}
                      alt=""
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                    />
                  </span>
                )}
                <span className="font-heading min-w-0 text-xs font-semibold leading-snug text-[#118d89] sm:text-sm">
                  {sector?.label ?? v.name}
                </span>
              </div>

              <div className="flex flex-1 flex-col px-4 pb-4 sm:px-5 sm:pb-5">
                <h3 className="font-heading text-[15px] font-bold leading-snug tracking-tight text-[#118d89] sm:text-lg">
                  {title}
                </h3>
                <p className={`font-body mb-5 mt-2 min-h-[2lh] leading-relaxed text-black/75 ${sectorName === "knowledge capital" ? "text-[10px] sm:text-xs" : "text-[13px] sm:text-sm"}`}>
                  {(live ? LIVE_TAGLINES[sectorName] : COMING_SOON_TAGLINES[sectorName] ?? undefined)?.map((line) => (
                    <span key={line} className="block whitespace-nowrap">{line}</span>
                  )) ?? <><span className="block">New possibilities</span><span className="block">are on the way.</span></>}
                </p>
                <div className="font-body mt-auto flex min-h-11 items-center whitespace-nowrap rounded-md border border-[#118d89]/30 px-2.5 text-[10px] font-medium text-[#118d89] sm:px-3 sm:text-xs">
                  <span className={`flex w-full items-center gap-1 sm:gap-2 ${live ? "justify-between" : "justify-center"}`}>
                    {isYoutube ? "Watch on YouTube" : live ? "Explore Website" : "Coming Soon"}
                    {live && (
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none sm:h-4 sm:w-4" />
                    )}
                  </span>
                </div>
              </div>
              </>
            );
            return (
            <div
              key={v.name}
              className="min-w-0 xl:w-[calc((100%-5rem)/5)] xl:shrink-0"
            >
            <div
              className={`group relative flex h-full min-h-[250px] flex-col rounded-xl border border-black/10 sm:min-h-[270px] ${live ? "pf-card hover:border-[#118d89]/40" : ""}`}
            >
              {live && !external ? (
                <Link href={href} className={cardClass}>{body}</Link>
              ) : live ? (
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={cardClass}
                >
                  {body}
                </a>
              ) : (
                <div className={cardClass}>{body}</div>
              )}
            </div>
            </div>
            );
          })}
        </Stagger>
      </PinnedRecede>
    </div>
  );
}
