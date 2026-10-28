/* Data-cache tags for API content, one per endpoint family:
   "/api/podcasts/" and "/api/podcasts/<slug>/" both carry "content:podcasts",
   so a list and its detail page are invalidated together and cannot disagree.
   Shared by the loaders and by /api/revalidate. */
export function contentTag(path: string): string {
  return `content:${path.split("/")[2] ?? "all"}`;
}

/* The tags the Django admin may ask to refresh. Anything else is refused. */
export const CONTENT_TAGS = [
  "content:blog-posts",
  "content:blog-categories",
  "content:podcasts",
  "content:gallery",
  "content:testimonials",
  "content:featured-work",
] as const;
