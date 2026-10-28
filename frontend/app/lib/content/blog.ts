/* Blog loaders (the CMS behind Media / Events, formerly Insights). Only
   published posts are ever returned by the API. getInsights() in ./index adds
   the local fallback for the listing; the detail loader has none. */

import { ApiError, ApiNotConfiguredError, apiFetch } from "@/app/lib/api";
import { contentTag } from "./tags";
import type { ApiBlogCategory, ApiBlogPost } from "./types";

const REVALIDATE_SECONDS: number | false = (() => {
  if (process.env.NODE_ENV === "development") return false;
  const parsed = Number(process.env.CONTENT_REVALIDATE_SECONDS);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 30;
})();

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /* Sanitised HTML; present on the detail loader only. */
  content?: string;
  image?: string;
  imageAlt: string;
  category?: { name: string; slug: string };
  author?: string;
  metric: string;
  metricLabel: string;
  cardValue: string;
  cardLabel: string;
  studioImage?: string;
  studioImageAlt?: string;
  videoUrl?: string;
  publishedAt?: string;
  updatedAt: string;
  readingMinutes: number;
  viewCount: number;
  metaTitle: string;
  metaDescription: string;
};

export type BlogCategory = { name: string; slug: string };

function mapPost(row: ApiBlogPost): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.featured_image ?? undefined,
    imageAlt: row.featured_image_alt || row.title,
    category:
      row.category_name && row.category_slug
        ? { name: row.category_name, slug: row.category_slug }
        : undefined,
    author: row.author_name || undefined,
    metric: row.metric,
    metricLabel: row.metric_label,
    cardValue: row.card_value,
    cardLabel: row.card_label,
    studioImage: row.studio_image ?? undefined,
    studioImageAlt: row.studio_image_alt || undefined,
    videoUrl: row.video_url || undefined,
    publishedAt: row.published_at ?? undefined,
    updatedAt: row.updated_at,
    readingMinutes: row.reading_minutes,
    viewCount: row.view_count ?? 0,
    metaTitle: row.meta_title || row.title,
    metaDescription: row.meta_description || row.excerpt,
  };
}

async function read<T>(path: string): Promise<T | null> {
  try {
    return await apiFetch<T>(path, { revalidate: REVALIDATE_SECONDS, tags: [contentTag(path)] });
  } catch (error) {
    if (error instanceof ApiNotConfiguredError) return null;
    if (error instanceof ApiError && error.status === 404) return null;
    console.error(`[blog] ${path} unavailable`, error);
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await read<ApiBlogPost[]>("/api/blog-posts/");
  return Array.isArray(rows) ? rows.map(mapPost) : [];
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const rows = await read<ApiBlogCategory[]>("/api/blog-categories/");
  return Array.isArray(rows) ? rows.map((c) => ({ name: c.name, slug: c.slug })) : [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const row = await read<ApiBlogPost>(`/api/blog-posts/${encodeURIComponent(slug)}/`);
  return row ? mapPost(row) : null;
}
