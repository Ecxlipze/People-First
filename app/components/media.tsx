import { Play } from "lucide-react";
import SmartImage from "@/app/components/SmartImage";
import { CountUp } from "@/app/components/ScrollFx";

/* A photo/video frame placeholder with a decorative play motif.
   Drop a real thumbnail in by passing `src` once the asset exists. */
export function MediaFrame({
  src,
  alt = "",
  caption,
  className = "",
  aspect = "aspect-[0.7/1]",
  sizes = "(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 45vw, 520px",
}: {
  src?: string;
  alt?: string;
  caption?: React.ReactNode;
  className?: string;
  aspect?: string;
  sizes?: string;
}) {
  return (
    /* `group` so the play button and image can respond to a hover anywhere on
       the frame, which is a much larger target than the button alone. */
    /* Geometry measured off the home2.pdf render, NOT off the embedded bitmap
       dimensions — the 1736×1704 source JPEGs are cropped by their placement
       box, so their own aspect says nothing about the rendered frame. Scanning
       for the sharp photo edges in the 1920pt render gives:
         podcast frame  x 956–1351, y 325–891 → 395×566, aspect 0.698
         tech-events    x 397–781,  y 1180–1660 → 384×480, aspect 0.800
       So the frames are PORTRAIT and the two differ — hence the `aspect` prop
       rather than one shared ratio. Corners stay square: probing the edges
       finds the photo running straight into its corner with no rounding
       (QA: "no border-radius in design"). */
    <div
      className={`group relative ${aspect} w-full overflow-hidden bg-[linear-gradient(135deg,#3a3f52_0%,#242838_100%)] shadow-xl ring-1 ring-black/5 ${className}`}
    >
      {src ? (
        /* SmartImage fades the photo up once decoded (and shimmers until then)
           instead of snapping in. The slow zoom on hover is a separate,
           longer transition so it reads as ambient rather than twitchy. */
        <SmartImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          skeleton
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_55%)]"
        />
      )}

      {/* Decorative play motif. No media URL or player exists for these frames,
          so this must not be exposed as a nonfunctional button. */}
      <span
        aria-hidden
        className="pf-interactive absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-lg ring-0 ring-white/40 hover:scale-110 hover:ring-8"
      >
        <Play className="ml-0.5 h-6 w-6 fill-current" strokeWidth={0} />
      </span>

      {/* Optional caption — a SINGLE compact block pinned to the bottom-left.
          `right-24` keeps it clear of any overhanging stat card, and the fixed
          line-height stops multi-line captions from colliding. Only pass this
          for photos that do NOT already have their caption burned into the
          bitmap (see FeaturedWork's tech-events frame, which does). */}
      {caption && (
        <div className="pointer-events-none absolute bottom-3 left-3 right-24 max-w-[16rem] text-[11px] font-medium leading-[1.25] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          {caption}
        </div>
      )}
    </div>
  );
}

/* A stat card that overlaps the media frame (the teal callout). */
export function StatCard({
  value,
  children,
  className = "",
  variant = "default",
  /* Opt out of the variant's built-in width when a caller needs an exact
     measured size. The variant widths carry a `sm:` breakpoint, which outranks
     a plain `w-[...]` passed via className at ≥640px, so overriding through
     className alone silently fails — hence this flag rather than a cascade
     fight. The caller then supplies its own responsive width. */
  fluidWidth = false,
  /* Keeps the big stat prominent but drops the supporting line to a small,
     tighter-leading face. The default variant's `text-sm font-bold` body
     competes with the number and forces long copy onto one stretched line;
     the mockup's card runs ~12px text on ~19.5px leading beneath it. */
  compactBody = false,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "compact";
  fluidWidth?: boolean;
  compactBody?: boolean;
}) {
  const isCompact = variant === "compact";
  const width = fluidWidth
    ? ""
    : isCompact
      ? "w-[125px] sm:w-[140px]"
      : "w-[168px] sm:w-[196px]";
  return (
    <div
      className={`${width} ${
        isCompact
          ? "rounded-lg bg-[#60aaaa] p-3 shadow-xl"
          : compactBody
            ? "rounded-xl bg-[#60aaaa] px-4 py-3.5 shadow-xl"
            : "rounded-xl bg-[#60aaaa] p-4 shadow-xl"
      } text-white ${className}`}
    >
      <CountUp
        value={value}
        className={`block font-bold leading-none ${
          isCompact
            ? "text-[1.75rem] sm:text-[2rem]"
            : compactBody
              ? "text-[1.9rem] font-extrabold sm:text-[2.1rem]"
              : "text-3xl font-extrabold sm:text-[2.6rem]"
        }`}
      />
      <p
        className={`font-semibold ${
          compactBody
            ? "mt-1.5 text-[11.5px] leading-[1.35]"
            : isCompact
              ? "mt-1 text-[11px] leading-snug sm:text-[12px]"
              : "mt-2 text-sm font-bold leading-snug"
        }`}
      >
        {children}
      </p>
    </div>
  );
}
