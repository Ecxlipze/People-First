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
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-xs font-semibold leading-tight text-white">
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
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    /* Card 1 in the home2.pdf render spans x 755–1016, y 684–890 → 262×207 on
       the 1920pt frame, i.e. ~196×155 at a 1440 viewport. Both cards sample to
       #60aaaa (card 2 only looks purple where the pink bloom passes over it).
       Unlike the photo frames these ARE rounded, cutting in over ~12px.

       Type size here must be derived from LINE SPACING, not from the reported
       glyph boxes. pdftotext gives the three body lines boxes of 37.8pt each,
       but their yMins are only 25pt apart (773.4 / 798.4 / 824.4) — the boxes
       overlap by 12.8pt because each is the font's full em box, not the visual
       size. 25pt of leading → ~18–19pt type → ~14px at 1440, i.e. text-sm.
       Likewise "27%" reports 77.2pt but four lines share a 207pt-tall card, so
       it lands near 42px, not the 58px the raw box implies. */
    <div
      className={`w-[168px] rounded-xl bg-[#60aaaa] p-4 text-white shadow-xl sm:w-[196px] ${className}`}
    >
      {/* The figure counts up the first time the card scrolls into view.
          CountUp renders the finished string on the server, so the value is
          correct before hydration and for reduced-motion users. */}
      <CountUp
        value={value}
        className="block text-3xl font-extrabold leading-none sm:text-[2.6rem]"
      />
      <p className="mt-2 text-sm font-bold leading-snug">{children}</p>
    </div>
  );
}
