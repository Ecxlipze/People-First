"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, ExternalLink, Share2, Check } from "lucide-react";
import { TOTAL_PAGES, type Episode } from "@/app/podcasts/episodes";
import { Reveal, Stagger } from "@/app/components/ScrollFx";
import VideoModal from "@/app/components/VideoModal";

/* Podcasts → "Our Podcasts". Deep-purple band holding one wide white card per
   episode: thumbnail with a play motif and a coloured corner badge on the
   left, title and two stat columns on the right. A numbered pager and a
   "View All" link close the section. */

const EPISODES_PER_PAGE = 3;

/* Returns a windowed array of page numbers and ellipsis markers, e.g. [1, 2, 3, 4, 5, '...', 34] */
function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

/* Client component: the pager is interactive. Paginates dynamic episodes
   at 3 per page; pages with no content show an empty-state note. */
export default function OurPodcasts({
  episodes,
}: {
  episodes: Episode[];
}) {
  const [page, setPage] = useState(1);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const totalPages = Math.max(TOTAL_PAGES, Math.ceil(episodes.length / EPISODES_PER_PAGE));
  const startIndex = (page - 1) * EPISODES_PER_PAGE;
  const currentEpisodes = episodes.slice(startIndex, startIndex + EPISODES_PER_PAGE);

  const handleShare = (slugOrId: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/podcasts#${slugOrId}`;
      navigator.clipboard.writeText(url);
      setCopiedSlug(slugOrId);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  return (
    <section className="bg-[#2d064b] px-6 py-24 sm:px-10 sm:py-28 lg:px-24 lg:pr-36 xl:px-28 xl:pr-36">
      <div className="mx-auto max-w-[1440px]">
        <Reveal y={28} scale={0.98}>
          <h2 className="text-center font-display text-2xl font-extrabold uppercase tracking-tight text-white sm:text-[2rem]">
            Our Podcasts
          </h2>
        </Reveal>

        <Stagger
          key={page}
          className="mt-20 flex flex-col gap-14 sm:mt-24 sm:gap-20 lg:ml-20"
          step={90}
        >
          {currentEpisodes.length > 0 ? (
            currentEpisodes.map((ep, idx) => {
              const episodeNum = (page - 1) * EPISODES_PER_PAGE + idx + 1;
              const isLatest = page === 1 && idx === 0;
              const shareId = ep.slug || `episode-${ep.id || episodeNum}`;

              return (
                <article
                  key={ep.id ?? ep.title}
                  id={shareId}
                  /* pf-card supplies the lift + timing; the explicit hover shadow
                     overrides pf-card's default purple bloom, which would read as
                     grey haze against this deep-purple band. */
                  className="group pf-card grid w-full min-w-0 gap-8 rounded-2xl bg-white p-5 shadow-[0_18px_44px_-20px_rgba(0,0,0,0.5)] hover:shadow-[0_28px_60px_-22px_rgba(0,0,0,0.65)] md:grid-cols-[minmax(0,22rem)_1fr] md:items-center md:p-8 lg:min-h-[360px] lg:grid-cols-[minmax(0,28rem)_1fr] lg:gap-12 lg:p-10"
                >
                  {/* thumbnail + decorative play motif (no badge) */}
                  <div className="relative aspect-video w-full min-w-0 md:-ml-12 md:self-center lg:-ml-16">
                    <div className="absolute inset-0 overflow-hidden rounded-xl bg-zinc-900 shadow-md">
                      {/* An episode added in the admin may not have a still
                          yet; the dark plate and play motif stand on their own. */}
                      {ep.thumb && (
                        <Image
                          src={ep.thumb}
                          alt={ep.thumbAlt}
                          fill
                          sizes="(max-width: 768px) 90vw, (max-width: 1024px) 22rem, 28rem"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      )}
                      {ep.videoUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveVideo({ url: ep.videoUrl!, title: ep.title })
                          }
                          aria-label={`Watch ${ep.title}`}
                          className="pf-interactive absolute inset-0 grid place-items-center focus-visible:outline-none"
                        >
                          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110 lg:h-20 lg:w-20">
                            <Play
                              className="ml-1 h-7 w-7 text-[#2d0b4e] lg:h-9 lg:w-9"
                              fill="currentColor"
                            />
                          </span>
                        </button>
                      ) : (
                        <span
                          aria-hidden
                          className="absolute inset-0 grid place-items-center opacity-60"
                        >
                          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/80 shadow-lg lg:h-20 lg:w-20">
                            <Play
                              className="ml-1 h-7 w-7 text-[#2d0b4e]/70 lg:h-9 lg:w-9"
                              fill="currentColor"
                            />
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content: Numbering/Latest -> Title -> Description -> Video Metrics -> Actions */}
                  <div className="min-w-0 md:py-2 lg:pr-6">
                    <div className="mb-2.5 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-zinc-100 px-2.5 py-0.5 font-display text-[11px] font-extrabold uppercase tracking-wider text-zinc-600">
                        Episode #{String(episodeNum).padStart(2, "0")}
                      </span>
                      {isLatest && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#a02f52]/10 px-2.5 py-0.5 font-display text-[11px] font-extrabold uppercase tracking-wider text-[#a02f52]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#a02f52] animate-pulse" />
                          Latest
                        </span>
                      )}
                    </div>

                    <h3 className="max-w-[42rem] break-words font-display text-xl font-extrabold leading-snug text-zinc-950 sm:text-2xl lg:text-[1.85rem]">
                      {ep.videoUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveVideo({ url: ep.videoUrl!, title: ep.title })
                          }
                          className="text-left font-display font-extrabold text-inherit transition-colors hover:text-[#c64047] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a02f52]"
                        >
                          {ep.title}
                        </button>
                      ) : (
                        ep.title
                      )}
                    </h3>

                    {ep.description && (
                      <p className="mt-3.5 max-w-[42rem] text-sm leading-relaxed text-zinc-600 sm:text-base line-clamp-3">
                        {ep.description}
                      </p>
                    )}

                    {ep.stats.length > 0 && (
                      <div className="mt-5 border-t border-zinc-100 pt-5 grid gap-6 sm:grid-cols-2">
                        {ep.stats.map((s) => (
                          <div key={s.label} className="min-w-0">
                            <p className="font-display text-lg font-extrabold text-zinc-950 lg:text-xl">
                              {s.label}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                              {s.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {ep.videoUrl && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveVideo({ url: ep.videoUrl!, title: ep.title })
                            }
                            className="pf-interactive inline-flex items-center gap-2 rounded-lg bg-[#a02f52] px-5 py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-[#8c2946]"
                          >
                            <Play className="h-4 w-4" fill="currentColor" />
                            Watch Episode
                          </button>
                          <a
                            href={ep.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pf-interactive inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 font-display text-xs font-bold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
                          >
                            Watch on YouTube
                            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                          </a>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleShare(shareId)}
                        aria-label={`Share ${ep.title}`}
                        className="relative pf-interactive inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
                        title="Copy episode link"
                      >
                        {copiedSlug === shareId ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Share2 className="h-4 w-4" />
                        )}
                        {copiedSlug === shareId && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                            Link Copied!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="rounded-lg bg-white/10 px-6 py-14 text-center text-sm text-white/70">
              More episodes are on the way.
            </p>
          )}
        </Stagger>

        {/* ── pager ── */}
        <Reveal className="mt-14 flex justify-center lg:ml-20" y={28} scale={0.98}>
          <nav aria-label="Podcast pages" className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="pf-interactive mr-1 inline-flex min-h-11 items-center gap-1 rounded-lg border border-white/20 bg-transparent px-4 font-display text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>

            {getPageNumbers(page, totalPages).map((n, idx) =>
              n === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="grid h-11 w-8 place-items-center font-display text-sm font-bold text-white/40"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`pf-interactive h-11 w-11 rounded-lg border font-display text-sm font-bold transition-colors ${
                    n === page
                      ? "border-transparent bg-pf-magenta text-white"
                      : "border-white/20 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="pf-interactive ml-1 inline-flex min-h-11 items-center gap-1 rounded-lg border border-white/20 bg-transparent px-4 font-display text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </nav>
        </Reveal>
      </div>

      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </section>
  );
}
