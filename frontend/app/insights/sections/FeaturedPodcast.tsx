import Image from "next/image";
import Link from "next/link";
import { Play, ChevronRight } from "lucide-react";
import { Reveal } from "@/app/components/ScrollFx";
import type { Episode } from "@/app/podcasts/episodes";

/* Insights → the featured podcast section that closes the insights page.
   Displays up to 3 featured podcasts from the backend.
   Each card links to /podcasts to listen or explore the full catalogue. */

export default function FeaturedPodcast({
  episodes,
}: {
  episodes: Episode[];
}) {
  if (!episodes || episodes.length === 0) return null;

  return (
    <section className="px-6 pb-28 sm:px-10 sm:pb-32 lg:px-20 xl:px-28 xl:pb-44">
      <div className="mx-auto max-w-[70rem]">
        <Reveal y={24} className="mb-10 text-center sm:mb-14">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-zinc-950 sm:text-[2rem]">
            Featured Podcasts
          </h2>
        </Reveal>

        <div className="flex flex-col gap-10 sm:gap-14">
          {episodes.map((ep, idx) => (
            <Reveal key={ep.id ?? ep.title} y={32}>
              <Link
                href={ep.slug ? `/podcasts#${ep.slug}` : "/podcasts"}
                className="group pf-card grid w-full min-w-0 gap-8 bg-white p-5 shadow-[0_18px_44px_-22px_rgba(80,80,120,0.3)] hover:shadow-[0_28px_60px_-22px_rgba(80,80,120,0.45)] md:grid-cols-[minmax(0,22rem)_1fr] md:items-center md:p-8 lg:min-h-[22rem] lg:grid-cols-[minmax(0,27rem)_1fr] lg:gap-16 lg:px-14 lg:py-12"
              >
                {/* thumbnail + play overlay (no badge) */}
                <div className="relative aspect-video w-full min-w-0 md:-ml-12 md:self-center lg:-ml-20">
                  <div className="absolute inset-0 overflow-hidden rounded-xl bg-zinc-900 shadow-md">
                    {ep.thumb && (
                      <Image
                        src={ep.thumb}
                        alt={ep.thumbAlt}
                        fill
                        sizes="(max-width: 768px) 90vw, (max-width: 1024px) 22rem, 27rem"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    )}
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white lg:h-20 lg:w-20">
                        <Play
                          className="ml-1 h-7 w-7 text-[#2d0b4e] lg:h-9 lg:w-9"
                          fill="currentColor"
                        />
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content: Badges -> Title -> Description -> Video Metrics -> Action */}
                <div className="min-w-0 md:py-2">
                  <div className="mb-2.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-zinc-100 px-2.5 py-0.5 font-display text-[11px] font-extrabold uppercase tracking-wider text-zinc-600">
                      Featured
                    </span>
                    {idx === 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#a02f52]/10 px-2.5 py-0.5 font-display text-[11px] font-extrabold uppercase tracking-wider text-[#a02f52]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#a02f52] animate-pulse" />
                        Latest
                      </span>
                    )}
                  </div>

                  <h3 className="max-w-[36rem] break-words font-display text-xl font-extrabold leading-snug text-[#171922] transition-colors duration-200 group-hover:text-[#c64047] sm:text-2xl lg:text-[1.85rem]">
                    {ep.title}
                  </h3>

                  {ep.description && (
                    <p className="mt-3.5 max-w-[36rem] text-sm leading-relaxed text-zinc-600 sm:text-base line-clamp-3">
                      {ep.description}
                    </p>
                  )}

                  {ep.stats.length > 0 && (
                    <div className="mt-5 border-t border-zinc-100 pt-5 grid gap-6 sm:grid-cols-2">
                      {ep.stats.map((s) => (
                        <div key={s.label} className="min-w-0">
                          <p className="font-display text-lg font-extrabold text-[#171922] lg:text-xl">
                            {s.label}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                            {s.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 font-display text-sm font-bold text-[#a02f52] transition-colors group-hover:text-[#8c2946]">
                      Watch Episode
                      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center sm:mt-16">
          <Link
            href="/podcasts"
            className="pf-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#a02f52] px-6 py-3 text-center text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#8c2946] hover:shadow-lg"
          >
            <span>View All Podcasts</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
