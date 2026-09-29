import SmartImage from "@/app/components/SmartImage";
import type { GalleryItem } from "@/app/lib/content/types";

export default function GalleryView({ photos }: { photos: GalleryItem[] }) {
  return (
    <div className="w-full">
      {/* ── Photo count bar ── */}
      <div className="mb-8 flex items-center justify-between border-b border-black/5 pb-4">
        <p className="text-sm font-medium text-zinc-500">
          Showing <span className="font-bold text-zinc-900">{photos.length}</span>{" "}
          visual moments
        </p>
        <span className="inline-flex items-center rounded-full bg-[#150065]/5 px-3 py-1 text-xs font-semibold text-[#150065]">
          People First Ecosystem
        </span>
      </div>

      {/* ── Responsive Gallery Grid ── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
        {photos.map((photo, i) => (
          <article
            key={photo.id || i}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_8px_24px_-8px_rgba(20,20,50,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(20,20,60,0.15)]"
          >
            {/* Image Box (0.7 portrait aspect matching MediaFrame) */}
            <div className="relative aspect-[0.7/1] w-full overflow-hidden bg-[linear-gradient(135deg,#3a3f52_0%,#242838_100%)]">
              <SmartImage
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                skeleton
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
            </div>

            {/* Content info */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-heading text-lg font-bold text-zinc-900 transition-colors duration-200 group-hover:text-[#150065]">
                {photo.title}
              </h3>
              {photo.caption && (
                <p className="mt-2 text-sm leading-relaxed text-[#5b5b6b]">
                  {photo.caption}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
