import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Stagger } from "@/app/components/ScrollFx";
import { SOCIALS } from "@/app/components/SiteFooter";
import { formatPostDate } from "@/app/media-events/ArticleChrome";
import { formatViews } from "@/app/lib/format";
import type { Episode } from "@/app/podcasts/episodes";

/* Featured podcasts — the section that closes the Media / Events page.

   Styled to match the blog index above it: the same underlined section heading,
   uniform cards (media on top, tag, title, meta, excerpt) and the same page
   gutters, so the two read as one page. Up to three episodes from the backend;
   every card links to /podcasts to listen or browse the full catalogue. */

/* The channel the episodes are published on; the link and glyph come from the
   footer's social list so there is a single source for the channel address. */
const YOUTUBE = SOCIALS.find((s) => s.label === "YouTube");

function isYouTube(url?: string): boolean {
  return !!url && /(?:youtube\.com|youtu\.be)\//i.test(url);
}

function Card({ ep, latest }: { ep: Episode; latest: boolean }) {
  return (
    <Link
      href={ep.slug ? `/podcasts#${ep.slug}` : "/podcasts"}
      className="group flex h-full flex-col"
    >
      {/* Episode art is 16:9 video; a thumbnail can be missing on a row created
          in the admin before its file is uploaded, so the plate stands in. */}
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-zinc-900">
        {ep.thumb && (
          <Image
            src={ep.thumb}
            alt={ep.thumbAlt}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 26rem"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <span aria-hidden className="absolute inset-0 grid place-items-center bg-black/10 transition-colors group-hover:bg-black/25">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 h-6 w-6 text-[#2d0b4e]" fill="currentColor" />
          </span>
        </span>
        {YOUTUBE && isYouTube(ep.videoUrl) && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-sm bg-black/70 px-2 py-1 font-display text-[11px] font-bold text-white backdrop-blur-sm">
            <YOUTUBE.icon className="h-3.5 w-3.5 text-[#ff0000]" />
            YouTube
          </span>
        )}
        {latest && (
          <span className="absolute left-3 top-3 rounded-sm bg-[#a02f52] px-2.5 py-1 font-display text-[11px] font-extrabold uppercase tracking-wider text-white">
            Latest
          </span>
        )}
      </div>

      <div className="mt-4 flex min-w-0 flex-1 flex-col gap-2">
        <span className="font-display text-xs font-extrabold uppercase tracking-wider text-[#a02f52]">
          Podcast
        </span>
        <h3 className="break-words font-display text-xl font-extrabold leading-snug tracking-tight text-[#171922] transition-colors duration-200 group-hover:text-[#c64047]">
          {ep.title}
        </h3>
        {(ep.publishedAt || formatViews(ep.viewCount)) && (
          <p className="flex flex-wrap items-center gap-x-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
            {ep.publishedAt && (
              <time dateTime={ep.publishedAt}>{formatPostDate(ep.publishedAt)}</time>
            )}
            {formatViews(ep.viewCount) && <span>{formatViews(ep.viewCount)}</span>}
          </p>
        )}
        {ep.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-zinc-500">
            {ep.description}
          </p>
        )}
        <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-1 font-display text-sm font-bold text-[#a02f52] group-hover:text-[#c64047]">
          Watch episode
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export default function FeaturedPodcast({ episodes }: { episodes: Episode[] }) {
  if (!episodes || episodes.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-podcasts"
      className="px-6 pb-20 sm:px-10 sm:pb-24 lg:pl-16 lg:pr-24 xl:pl-24 xl:pb-32"
    >
      <div className="mx-auto max-w-[80rem]">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-zinc-200 pb-3">
          <h2
            id="featured-podcasts"
            className="font-display text-2xl font-extrabold tracking-tight text-[#171922] after:mt-3 after:block after:h-0.5 after:w-14 after:bg-[#a02f52] sm:text-3xl"
          >
            Featured Podcasts
          </h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/podcasts"
              className="pf-interactive inline-flex min-h-11 items-center gap-2 font-display text-sm font-bold text-[#a02f52] hover:text-[#c64047]"
            >
              View all podcasts
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            {YOUTUBE && (
              <a
                href={`${YOUTUBE.href}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="pf-interactive inline-flex min-h-11 items-center gap-2 rounded-md bg-[#a02f52] px-4 font-display text-sm font-bold text-white transition-colors hover:bg-[#8c2946] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a02f52]"
              >
                <YOUTUBE.icon className="h-4 w-4" />
                Subscribe on YouTube
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        <Stagger className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" step={80}>
          {episodes.map((ep, idx) => (
            <Card key={ep.id ?? ep.title} ep={ep} latest={idx === 0} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
