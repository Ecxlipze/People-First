"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ChevronRight } from "lucide-react";
import { EPISODES, TOTAL_PAGES } from "@/app/podcasts/episodes";

/* Podcasts → "Our Podcasts". Deep-purple band holding one wide white card per
   episode: thumbnail with a play overlay and a coloured corner badge on the
   left, title and two stat columns on the right. A numbered pager and a
   "View All" link close the section.

   Client component: the pager is interactive. Only page 1 has content in the
   design, so other pages show an empty-state note rather than pretending. */
export default function OurPodcasts() {
  const [page, setPage] = useState(1);

  return (
    <section className="bg-[#2d0b4e] px-6 py-20 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-5xl lg:pr-16">
        <h2 className="text-center text-xl font-extrabold uppercase tracking-tight text-white sm:text-[1.75rem]">
          Our Podcasts
        </h2>

        <div
          key={page}
          className="animate-fade-in-up mt-14 flex flex-col gap-10 sm:gap-12"
        >
          {page === 1 ? (
            EPISODES.map((ep) => (
              <article
                key={ep.title}
                /* pf-card supplies the lift + timing; the explicit hover shadow
                   overrides pf-card's default purple bloom, which would read as
                   grey haze against this deep-purple band. */
                className="group pf-card grid gap-6 rounded-lg bg-white p-5 shadow-[0_18px_44px_-20px_rgba(0,0,0,0.5)] hover:shadow-[0_28px_60px_-22px_rgba(0,0,0,0.65)] sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8 sm:p-6"
              >
                {/* thumbnail + play overlay + corner badge */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-zinc-900 sm:-ml-9 sm:self-center">
                  <Image
                    src={ep.thumb}
                    alt={ep.thumbAlt}
                    fill
                    sizes="(max-width: 640px) 90vw, 15rem"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <button
                    type="button"
                    aria-label={`Play: ${ep.title}`}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/85 shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play
                        className="ml-0.5 h-5 w-5 text-[#2d0b4e]"
                        fill="currentColor"
                      />
                    </span>
                  </button>
                  <span
                    className={`absolute bottom-0 left-0 max-w-[9rem] px-3 py-2 text-[0.6rem] font-bold leading-tight text-white ${ep.badgeBg}`}
                  >
                    {ep.badge}
                  </span>
                </div>

                {/* title + the two stat columns */}
                <div className="sm:py-2">
                  <h3 className="text-base font-extrabold leading-snug text-[#1a1a2e] sm:text-lg">
                    {ep.title}
                  </h3>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2 sm:gap-8">
                    {ep.stats.map((s) => (
                      <div key={s.label}>
                        <p className="text-[0.8rem] font-bold text-[#1a1a2e]">
                          {s.label}
                        </p>
                        <p className="mt-1.5 text-[0.6rem] leading-relaxed text-zinc-500">
                          {s.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-lg bg-white/10 px-6 py-14 text-center text-sm text-white/70">
              More episodes are on the way.
            </p>
          )}
        </div>

        {/* ── pager + View All ── */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Podcast pages" className="flex items-center gap-2">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`pf-interactive h-11 w-11 rounded border text-xs font-semibold ${
                  n === page
                    ? "border-white bg-white text-[#2d0b4e]"
                    : "border-white/30 text-white/70 hover:border-white/60 hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={page === TOTAL_PAGES}
              className="pf-interactive ml-1 inline-flex min-h-11 items-center gap-1 rounded border border-white/30 px-3 text-xs font-semibold text-white/70 hover:border-white/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </nav>

          <Link
            href="/insights"
            className="pf-interactive inline-flex min-h-11 items-center rounded border border-white/30 px-4 py-2 text-xs font-semibold text-white/80 hover:border-white/60 hover:text-white"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
