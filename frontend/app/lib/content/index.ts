/* Content loaders: Django API first, local modules as the fallback.

   Every loader returns the same shape the presentation components already
   consume, so the components stay unaware of where a row came from.

   FALLBACK RULE — a loader falls back to the local module when the API is
   unreachable, unconfigured, errors, or returns an EMPTY list. The content
   database starts empty, so a strict "API only" read would blank the homepage,
   /insights and /podcasts the moment this deploys. The local modules are
   therefore still the source of truth for anything not yet entered in the
   admin, and each section switches over on its own as rows are added.

   Loaders are async and run on the server. Pages that use them stay Server
   Components and pass plain data down to the "use client" showcases. */

import { ApiNotConfiguredError, apiFetch } from "@/app/lib/api";
import type {
  ApiFeaturedWork,
  ApiGalleryItem,
  ApiInsight,
  ApiInsightCategory,
  ApiPodcast,
  ApiTestimonial,
  ApiVenture,
} from "./types";

import { GALLERY, repeatForCoverflow, type GalleryPhoto } from "@/app/components/gallery";
import { TESTIMONIALS, type Testimonial } from "@/app/components/testimonials";
import {
  DEFAULT_VENTURE_ACCENT,
  DEFAULT_VENTURE_GRADIENT,
  VENTURES,
  type Venture,
} from "@/app/components/ventures";
import {
  BADGE_PALETTE,
  EPISODES,
  type Episode,
} from "@/app/podcasts/episodes";
import { INSIGHTS, type Insight } from "@/app/insights/insights";
import type { Article } from "@/app/ideas-lab/articles";
import {
  DEFAULT_EVENTS_BLOCK,
  DEFAULT_PODCAST_BLOCK,
  FEATURED_WORK_COPY,
  type FeaturedWorkBlock,
  type FeaturedWorkData,
} from "@/app/components/featured-work-copy";

/* Content changes through the admin, not through a deploy, so pages are cached
   and refreshed on a timer rather than rebuilt. Five minutes in production keeps
   an editor's change visible quickly without hammering the API on every request.
   In development, caching is disabled (false) so admin edits appear immediately. */
const REVALIDATE_SECONDS: number | false =
  process.env.NODE_ENV === "development" ? false : 300;

/* Returns null — distinct from [] — when the API could not answer at all. Both
   end up falling back, but only a genuine failure is worth logging. */
async function list<T>(path: string): Promise<T[] | null> {
  try {
    const rows = await apiFetch<T[]>(path, { revalidate: REVALIDATE_SECONDS });
    return Array.isArray(rows) ? rows : null;
  } catch (error) {
    if (error instanceof ApiNotConfiguredError) {
      // Expected in a checkout with no .env.local; the local content renders.
      return null;
    }
    console.error(`[content] ${path} unavailable, using local content`, error);
    return null;
  }
}

/* `rows?.length ? … : fallback` in one place, so no loader can forget it. */
function withFallback<Row, Out>(
  rows: Row[] | null,
  map: (rows: Row[]) => Out[],
  fallback: Out[],
): Out[] {
  return rows && rows.length > 0 ? map(rows) : fallback;
}

export async function getGallery(): Promise<GalleryPhoto[]> {
  const rows = await list<ApiGalleryItem>("/api/gallery/");
  return withFallback(
    rows,
    (items) =>
      repeatForCoverflow(
        items
          /* A GalleryItem with no file would render as a broken image. */
          .filter((item) => item.image)
          .map((item) => ({
            src: item.image ?? undefined,
            hasImage: true,
            /* alt_text is the accessible description; title and caption are
               the next-best things an editor is likely to have filled in. */
            alt: item.alt_text || item.title || item.caption || "",
          })),
      ),
    GALLERY,
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await list<ApiTestimonial>("/api/testimonials/");
  return withFallback(
    rows,
    (items) =>
      items.map((item) => ({
        name: item.name,
        handle: item.handle ?? "",
        body: item.body,
        tags: Array.isArray(item.tags) ? item.tags : [],
        avatar: item.avatar ?? undefined,
        /* Avatar draws an initials monogram when this is false, which is the
           correct rendering for a testimonial with no uploaded photo. */
        hasAvatar: Boolean(item.avatar),
      })),
    TESTIMONIALS,
  );
}

export async function getVentures(): Promise<Venture[]> {
  const rows = await list<ApiVenture>("/api/ventures/");
  return withFallback(
    rows,
    (items) =>
      items.map((item) => ({
        name: item.name,
        tagline: item.subtitle ?? "",
        logo: item.logo ?? undefined,
        hasLogo: Boolean(item.logo),
        /* A venture with no site keeps the mockup's inert card. */
        href: item.website_url || "#",
        accent: item.accent || DEFAULT_VENTURE_ACCENT,
        borderGradient: item.border_gradient || DEFAULT_VENTURE_GRADIENT,
      })),
    VENTURES,
  );
}

export async function getEpisodes(): Promise<Episode[]> {
  const rows = await list<ApiPodcast>("/api/podcasts/");
  return withFallback(
    rows,
    (items) =>
      items.map((item, i) => ({
        title: item.title,
        thumb: item.thumbnail ?? undefined,
        thumbAlt: item.title,
        badge: item.badge || item.description,
        /* The design cycles teal → pink → purple down the page; an episode
           with no explicit colour keeps that rhythm by position. */
        badgeColour: item.badge_colour || BADGE_PALETTE[i % BADGE_PALETTE.length],
        /* The model carries two label/body pairs: the headline metric and a
           supporting block. Either may be blank, so only filled pairs render
           and the stat grid collapses to one column instead of showing a gap. */
        stats: [
          { label: item.metric_value ?? "", body: item.metric_label ?? "" },
          { label: item.supporting_title ?? "", body: item.supporting_content ?? "" },
        ].filter((s) => s.label || s.body),
      })),
    EPISODES,
  );
}

export async function getInsights(): Promise<Insight[]> {
  /* Two calls because Insight.category serialises as a bare foreign-key id.
     Both are cached on the same timer, so this is one extra request per
     revalidation window, not per visitor. */
  const [rows, categories] = await Promise.all([
    list<ApiInsight>("/api/insights/"),
    list<ApiInsightCategory>("/api/insight-categories/"),
  ]);

  const categoryName = new Map((categories ?? []).map((c) => [c.id, c.name]));

  return withFallback(
    rows,
    (items) =>
      items.map((item) => ({
        title: item.title,
        blurb: item.summary,
        category:
          (item.category !== null ? categoryName.get(item.category) : undefined) ?? "",
        metric: item.metric ?? "",
        metricLabel: item.metric_label ?? "",
        cardValue: item.card_value ?? "",
        cardLabel: item.card_label ?? "",
        thumb: item.thumbnail ?? undefined,
        thumbAlt: item.thumbnail_alt ?? item.title,
        studioThumb: item.studio_thumbnail ?? undefined,
        studioThumbAlt: item.studio_thumbnail_alt ?? undefined,
        /* No backend column: object-position was tuned per supplied still and
           there is no way to know an uploaded image's framing. Centred crop. */
        thumbPosition: undefined,
      })),
    INSIGHTS,
  );
}

/* Ideas Lab rows are the insights plus a link, exactly as before — derived so
   the two pages cannot drift apart. */
export async function getArticles(): Promise<Article[]> {
  const insights = await getInsights();
  return insights.map((insight) => ({ ...insight, href: "/insights" }));
}

/* /home's Featured Work section consists of two blocks:
   - Block 1 (order=0): Cinematic Podcast Stage
   - Block 2 (order=1): Tech Events Management
   Both blocks are fetched from /api/featured-work/ and mapped into FeaturedWorkData,
   falling back to the design's copy and stills if unconfigured or empty. */
export async function getFeaturedWorkCopy(): Promise<FeaturedWorkData> {
  const rows = await list<ApiFeaturedWork>("/api/featured-work/");
  if (!rows || rows.length === 0) return FEATURED_WORK_COPY;

  const podcastRow = rows.find((r) => r.order === 0) ?? rows[0];
  const eventsRow = rows.find((r) => r.order === 1) ?? rows[1];

  const mapRowToBlock = (
    row: ApiFeaturedWork | undefined,
    fallback: FeaturedWorkBlock,
  ): FeaturedWorkBlock => {
    if (!row) return fallback;
    return {
      title: row.title || fallback.title,
      description: row.description || fallback.description,
      metricValue: row.metric_value || fallback.metricValue,
      metricLabel: row.metric_label || fallback.metricLabel,
      secondaryMetricValue:
        row.secondary_metric_value || fallback.secondaryMetricValue,
      secondaryMetricLabel:
        row.secondary_metric_label || fallback.secondaryMetricLabel,
      bullets: row.bullets?.length ? row.bullets : fallback.bullets,
      thumbnail: row.thumbnail || fallback.thumbnail,
      videoUrl: row.video_url || fallback.videoUrl,
    };
  };

  return {
    podcast: mapRowToBlock(podcastRow, DEFAULT_PODCAST_BLOCK),
    events: mapRowToBlock(eventsRow, DEFAULT_EVENTS_BLOCK),
  };
}
