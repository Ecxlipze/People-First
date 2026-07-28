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
  sizes = "(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 45vw, 520px",
}: {
  src?: string;
  alt?: string;
  caption?: React.ReactNode;
  className?: string;
  sizes?: string;
}) {
  return (
    /* `group` so the play button and image can respond to a hover anywhere on
       the frame, which is a much larger target than the button alone. */
    <div
      className={`group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[linear-gradient(135deg,#3a3f52_0%,#242838_100%)] shadow-xl ring-1 ring-black/5 ${className}`}
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
    <div
      className={`w-40 rounded-lg bg-[#5a9e95] p-4 text-white shadow-xl sm:w-44 sm:p-5 ${className}`}
    >
      {/* The figure counts up the first time the card scrolls into view.
          CountUp renders the finished string on the server, so the value is
          correct before hydration and for reduced-motion users. */}
      <CountUp
        value={value}
        className="block text-2xl font-extrabold sm:text-3xl"
      />
      <p className="mt-1 text-sm font-semibold leading-tight">{children}</p>
    </div>
  );
}
