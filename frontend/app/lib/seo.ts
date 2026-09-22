/**
 * Returns the normalized base URL for the site.
 * Throws an error in production if NEXT_PUBLIC_SITE_URL is not set.
 */
export function getBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_SITE_URL is required in production environments.");
    }
    url = "http://localhost:3000";
  }

  // Normalize all trailing slashes to prevent malformed absolute metadata URLs.
  return url.replace(/\/+$/, "");
}
