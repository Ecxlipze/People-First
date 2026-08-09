/**
 * Returns the normalized base URL for the site.
 * Throws an error in production if NEXT_PUBLIC_SITE_URL is not set.
 */
export function getBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_SITE_URL;

  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_SITE_URL is required in production environments.");
    }
    url = "http://localhost:3000";
  }

  // Normalize trailing slash to prevent double-slash URLs (e.g., https://example.com//path)
  return url.endsWith("/") ? url.slice(0, -1) : url;
}
