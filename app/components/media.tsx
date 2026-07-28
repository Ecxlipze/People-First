import Image from "next/image";
import { Play } from "lucide-react";

/* A photo/video frame placeholder with a play button.
   Drop a real thumbnail in by passing `src` once the asset exists. */
export function MediaFrame({
  src,
  alt = "",
  caption,
  className = "",
}: {
  src?: string;
  alt?: string;
  caption?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[linear-gradient(135deg,#3a3f52_0%,#242838_100%)] shadow-xl ring-1 ring-black/5 ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_55%)]"
        />
      )}

      {/* play button */}
      <button
        type="button"
        aria-label="Play video"
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-lg transition-transform duration-300 hover:scale-110"
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
      <span className="text-2xl font-extrabold sm:text-3xl">{value}</span>
      <p className="mt-1 text-sm font-semibold leading-tight">{children}</p>
    </div>
  );
}
