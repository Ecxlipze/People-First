import { Play } from "lucide-react";
import SmartImage from "@/app/components/SmartImage";
import { CountUp } from "@/app/components/ScrollFx";

/* A photo/video frame placeholder with a play button.
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

      {/* play button — the -translate-x/y-1/2 centring uses `translate`, so the
          hover/press feedback uses `scale` only and the two never collide.
          A soft ring blooms outward on hover to make the target feel live. */}
      <button
        type="button"
        aria-label="Play video"
        className="pf-interactive absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-lg ring-0 ring-white/40 hover:scale-110 hover:ring-8"
      >
        <Play className="ml-0.5 h-6 w-6 fill-current" strokeWidth={0} />
      </button>

      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-3 pr-36 pt-12 text-[10px] sm:text-[11.5px] font-medium leading-snug text-white/90 drop-shadow-md">
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
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "compact";
}) {
  const isCompact = variant === "compact";
  return (
    <div
      className={`${
        isCompact
          ? "w-[125px] rounded-lg bg-[#60aaaa] p-3 shadow-xl sm:w-[140px]"
          : "w-[168px] rounded-xl bg-[#60aaaa] p-4 shadow-xl sm:w-[196px]"
      } text-white ${className}`}
    >
      <CountUp
        value={value}
        className={`block font-bold leading-none ${
          isCompact ? "text-[1.75rem] sm:text-[2rem]" : "text-3xl font-extrabold sm:text-[2.6rem]"
        }`}
      />
      <p className={`font-semibold leading-snug ${isCompact ? "mt-1 text-[11px] sm:text-[12px]" : "mt-2 text-sm font-bold"}`}>
        {children}
      </p>
    </div>
  );
}
