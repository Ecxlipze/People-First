"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ChevronRight } from "lucide-react";
import { EPISODES, TOTAL_PAGES } from "@/app/podcasts/episodes";
import { Reveal } from "@/app/components/ScrollFx";

/* Podcasts → "Our Podcasts". Deep-purple band holding one wide white card per
   episode: thumbnail with a play overlay and a coloured corner badge on the
   left, title and two stat columns on the right. A numbered pager and a
   "View All" link close the section.

   Client component: the pager is interactive. Only page 1 has content in the
   design, so other pages show an empty-state note rather than pretending. */
export default function OurPodcasts() {
  const [page, setPage] = useState(1);

  return (
    <section className="bg-[#2d064b] px-6 py-24 sm:px-10 sm:py-28 lg:px-24 xl:px-28">
      <div className="mx-auto max-w-[1440px]">
        <Reveal y={28} scale={0.98}>
          <h2 className="text-center text-2xl font-extrabold uppercase tracking-tight text-white sm:text-[2rem]">
            Our Podcasts
          </h2>
        </Reveal>

        <div
          key={page}
          className="animate-fade-in-up mt-20 flex flex-col gap-14 sm:mt-24 sm:gap-20 lg:ml-20"
        >
          {page === 1 ? (
            EPISODES.map((ep) => (
              <article
                key={ep.title}
                /* pf-card supplies the lift + timing; the explicit hover shadow
                   overrides pf-card's default purple bloom, which would read as
                   grey haze against this deep-purple band. */
                className="group pf-card grid w-full min-w-0 gap-8 rounded-sm bg-white p-5 shadow-[0_18px_44px_-20px_rgba(0,0,0,0.5)] hover:shadow-[0_28px_60px_-22px_rgba(0,0,0,0.65)] md:grid-cols-[minmax(0,22rem)_1fr] md:items-center md:p-8 lg:min-h-[360px] lg:grid-cols-[minmax(0,28rem)_1fr] lg:gap-12 lg:p-10"
              >
                {/* thumbnail + play overlay + corner badge */}
                <div className="relative aspect-[590/443] w-full min-w-0 md:-ml-12 md:self-center lg:-ml-20">
                  <div className="absolute inset-0 overflow-hidden rounded-sm bg-zinc-900">
                    <Image
                      src={ep.thumb}
                      alt={ep.thumbAlt}
                      fill
                      sizes="(max-width: 768px) 90vw, (max-width: 1024px) 22rem, 28rem"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <button
                      type="button"
                      aria-label={`Play: ${ep.title}`}
                      className="absolute inset-0 grid place-items-center"
                    >
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110 lg:h-20 lg:w-20">
                        <Play
                          className="ml-1 h-7 w-7 text-[#2d0b4e] lg:h-9 lg:w-9"
                          fill="currentColor"
                        />
                      </span>
                    </button>
                  </div>
                  <span
                    className={`absolute bottom-0 left-0 max-w-[14rem] px-5 py-4 text-sm font-bold leading-tight text-white lg:-left-12 lg:max-w-[18rem] lg:px-8 lg:py-6 lg:text-xl ${ep.badgeBg}`}
                  >
                    {ep.badge}
                  </span>
                </div>

                {/* title + the two stat columns */}
                <div className="min-w-0 md:py-3">
                  <h3 className="max-w-[42rem] break-words text-lg font-extrabold leading-snug text-zinc-950 sm:text-xl lg:text-[2rem]">
                    {ep.title}
                  </h3>
                  <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:mt-12 lg:gap-12">
                    {ep.stats.map((s) => (
                      <div key={s.label}>
                        <p className="text-sm font-extrabold text-zinc-950 lg:text-xl">
                          {s.label}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-500 lg:text-sm">
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
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 lg:ml-20">
          <nav aria-label="Podcast pages" className="flex items-center gap-2">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`pf-interactive h-11 w-11 rounded border text-xs font-semibold ${
                  n === page
                    ? "border-zinc-100 bg-white text-[#2d0b4e]"
                    : "border-zinc-200 bg-zinc-100 text-zinc-800 hover:bg-white"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={page === TOTAL_PAGES}
              className="pf-interactive ml-1 inline-flex min-h-11 items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-4 text-xs font-semibold text-zinc-800 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </nav>

          <Link
            href="/insights"
            className="pf-interactive inline-flex min-h-11 items-center rounded border border-zinc-200 bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-800 hover:bg-white"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
