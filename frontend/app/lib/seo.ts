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

/** Resolve local assets against the site while preserving uploaded media hosts. */
export function absoluteSiteUrl(path: string): string {
  return new URL(path, `${getBaseUrl()}/`).href;
}

/** Escape script delimiters without changing the text when JSON is parsed. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** Explicit social fields prevent nested metadata from inheriting generic copy. */
export function createPageMetadata({
  title,
  description,
  path,
  canonical = path,
  noIndex = false,
  image,
}: {
  title: string;
  description: string;
  path: string;
  canonical?: string;
  noIndex?: boolean;
  image?: { url: string; alt: string };
}): import("next").Metadata {
  const socialTitle = `${title} | People First`;
  const images = image
    ? [image]
    : [{ url: "/images/og/people-first.png", width: 1200, height: 630, alt: "People First" }];

  return {
    title: { absolute: socialTitle },
    description,
    alternates: { canonical },
    ...(noIndex ? { robots: { index: false } } : {}),
    openGraph: {
      type: "website",
      siteName: "People First",
      locale: "en_US",
      url: path,
      title: socialTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images,
    },
  };
}
