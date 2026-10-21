/* Shared paging for the CMS list screens. The content APIs return plain arrays
   (only inquiries are paginated server-side), so those screens slice here. */

export const CMS_PER_PAGE = 25;

/* `?page=` from the URL: anything that is not a positive integer is page 1. */
export function parsePage(raw?: string): number {
  return Math.max(1, Number.parseInt(raw ?? "1", 10) || 1);
}

export type Paged<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  /* Index of items[0] within the full list, so ordinals ("#7") and first/last
     checks on reorder buttons stay correct on every page. */
  offset: number;
};

/* A requested page past the end clamps to the last one rather than showing an
   empty list (e.g. after deleting the final item on the last page). */
export function paginate<T>(all: T[], requested: number, perPage = CMS_PER_PAGE): Paged<T> {
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const page = Math.min(requested, totalPages);
  const offset = (page - 1) * perPage;
  return { items: all.slice(offset, offset + perPage), page, totalPages, total: all.length, perPage, offset };
}
