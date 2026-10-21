"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import SmartImage from "@/app/components/SmartImage";
import HeroCTA from "@/app/components/HeroCTA";
import { Reveal, Stagger } from "@/app/components/ScrollFx";
import { formatPostDate } from "@/app/media-events/ArticleChrome";
import { formatViews } from "@/app/lib/format";
import {
  ALL_CATEGORY,
  categoryOptions,
  type Insight,
} from "@/app/media-events/insights";

/* Media / Events — the blog index.

   A news-portal style listing: breadcrumb, heading, category chips, a two-column
   grid of uniform cards with pagination, and a sidebar rail beside it. Posts come from the blog CMS (Admin -> Blog); the local INSIGHTS
   fallback has no slugs, so those cards render without a link rather than
   pointing at a page that does not exist.

   Client component only because the category chips and pagination are state. */

const PAGE_SIZE = 8;
/* Up to this many options render as chips; beyond it they would wrap onto
   several rows and push the posts down, so a dropdown takes over. */
const MAX_CHIPS = 6;

function Meta({ insight }: { insight: Insight }) {
  const parts = [
    insight.publishedAt ? (
      <time key="d" dateTime={insight.publishedAt}>
        {formatPostDate(insight.publishedAt)}
      </time>
    ) : null,
    insight.readingMinutes ? (
      <span key="r">{insight.readingMinutes} min read</span>
    ) : null,
    insight.author ? <span key="a">By {insight.author}</span> : null,
    formatViews(insight.viewCount) ? <span key="v">{formatViews(insight.viewCount)}</span> : null,
  ].filter(Boolean);

  if (parts.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
      {parts}
    </div>
  );
}

function Cover({
  insight,
  sizes,
  className,
}: {
  insight: Insight;
  sizes: string;
  className: string;
}) {
  /* A post can exist before its image is uploaded; the plate stands in rather
     than next/image being pointed at nothing. */
  return (
    <div className={`relative w-full overflow-hidden bg-zinc-200 ${className}`}>
      {insight.thumb && (
        <SmartImage
          src={insight.thumb}
          alt={insight.thumbAlt}
          fill
          sizes={sizes}
          skeleton
          style={{ objectPosition: insight.thumbPosition ?? "center" }}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      )}
    </div>
  );
}

function CategoryTag({ insight }: { insight: Insight }) {
  if (!insight.category) return null;
  return (
    <span className="font-display text-xs font-extrabold uppercase tracking-wider text-[#a02f52]">
      {insight.category}
    </span>
  );
}

/* Wraps a card in a link only when the post has an article page. */
function CardLink({
  insight,
  className,
  children,
}: {
  insight: Insight;
  className: string;
  children: React.ReactNode;
}) {
  if (!insight.slug) return <div className={className}>{children}</div>;
  return (
    <Link href={`/media-events/${insight.slug}`} className={className}>
      {children}
    </Link>
  );
}

function PostCard({ insight }: { insight: Insight }) {
  return (
    <CardLink insight={insight} className="group flex h-full flex-col">
      <Cover
        insight={insight}
        sizes="(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 28rem"
        className="aspect-[4/3] rounded-md"
      />
      <div className="mt-4 flex min-w-0 flex-1 flex-col gap-2">
        <CategoryTag insight={insight} />
        <h2 className="break-words font-display text-xl font-extrabold leading-snug tracking-tight text-[#171922] transition-colors duration-200 group-hover:text-[#c64047] sm:text-[1.4rem]">
          {insight.title}
        </h2>
        <Meta insight={insight} />
        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-500">
          {insight.blurb}
        </p>
        {insight.slug && (
          <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-1 font-display text-sm font-bold text-[#a02f52] group-hover:text-[#c64047]">
            Read article
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
    </CardLink>
  );
}

const pageBtn =
  "pf-interactive grid h-11 min-w-11 place-items-center rounded-md border px-3 font-display text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c64047] disabled:pointer-events-none disabled:opacity-40";

export default function InsightsBoard({
  insights,
  sidebar,
}: {
  insights: Insight[];
  sidebar?: React.ReactNode;
}) {
  const [category, setCategory] = useState<string>(ALL_CATEGORY);
  const [page, setPage] = useState(1);
  const selectId = useId();

  /* Options follow whatever is actually published, so the filter can never
     offer a category with nothing behind it. */
  const options = useMemo(() => categoryOptions(insights), [insights]);

  const filtered = useMemo(
    () =>
      category === ALL_CATEGORY
        ? insights
        : insights.filter((i) => i.category === category),
    [category, insights],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const choose = (option: string) => {
    setCategory(option);
    setPage(1);
  };

  const goTo = (next: number) => {
    setPage(next);
    document.getElementById("posts")?.scrollIntoView({ block: "start" });
  };

  return (
    <section className="relative z-10 px-6 pb-20 pt-8 sm:px-10 sm:pb-24 lg:pl-16 lg:pr-24 xl:pl-24">
      <div className="mx-auto max-w-[80rem]">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center hover:text-[#c64047]">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-semibold text-zinc-700">
              Media / Events
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-[#171922] sm:text-5xl">
              Media / Events
            </h1>
            <p className="mt-3 text-base leading-relaxed text-zinc-500 sm:text-lg">
              Stories, ideas and highlights from the People First studio and
              the events we run.
            </p>
          </div>
          <HeroCTA className="justify-start lg:justify-end" />
        </div>

        {options.length > 2 && options.length <= MAX_CHIPS && (
          <div
            role="group"
            aria-label="Filter posts by category"
            className="mt-8 flex flex-wrap gap-2"
          >
            {options.map((option) => {
              const active = option === category;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose(option)}
                  className={`pf-interactive min-h-11 rounded-md border px-5 font-display text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c64047] ${
                    active
                      ? "border-[#a02f52] bg-[#a02f52] text-white"
                      : "border-zinc-300 bg-white/70 text-zinc-700 hover:border-[#a02f52]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {options.length > MAX_CHIPS && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <label htmlFor={selectId} className="sr-only">
              Filter posts by category
            </label>
            <div className="relative">
              <select
                id={selectId}
                value={category}
                onChange={(e) => choose(e.target.value)}
                className="pf-interactive min-h-11 w-full min-w-56 cursor-pointer appearance-none rounded-md border border-zinc-300 bg-white py-2 pl-4 pr-10 font-display text-sm font-bold text-[#171922] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c64047]"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600"
              />
            </div>
            <span className="text-sm text-zinc-500" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "post" : "posts"}
            </span>
          </div>
        )}

        <div
          id="posts"
          className="mt-10 grid scroll-mt-6 gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]"
        >
          <div className="min-w-0">
            {visible.length > 0 ? (
              /* key remounts on filter/page change so the entrance motion replays */
              <Stagger
                key={`${category}-${page}`}
                className="grid gap-x-8 gap-y-12 sm:grid-cols-2"
                step={60}
              >
                {visible.map((insight) => (
                  <PostCard key={insight.slug ?? insight.title} insight={insight} />
                ))}
              </Stagger>
            ) : (
              <Reveal className="py-16 text-center">
                <p className="text-sm text-zinc-500">No posts in this category yet.</p>
              </Reveal>
            )}

            {pageCount > 1 && (
              <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => goTo(page - 1)}
                  aria-label="Previous page"
                  className={`${pageBtn} border-zinc-300 bg-white text-zinc-700 hover:border-[#a02f52]`}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goTo(n)}
                    aria-label={`Page ${n}`}
                    aria-current={n === page ? "page" : undefined}
                    className={`${pageBtn} ${
                      n === page
                        ? "border-[#a02f52] bg-[#a02f52] text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-[#a02f52]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === pageCount}
                  onClick={() => goTo(page + 1)}
                  aria-label="Next page"
                  className={`${pageBtn} border-zinc-300 bg-white text-zinc-700 hover:border-[#a02f52]`}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </nav>
            )}
          </div>

          {sidebar}
        </div>
      </div>
    </section>
  );
}
