import type { NextConfig } from "next";

/* The Django API serialises ImageFields as ABSOLUTE urls (DRF builds them from
   the request), so every uploaded logo, avatar, still and thumbnail arrives as
   e.g. https://api.example.com/media/gallery/photo.jpg. next/image refuses a
   remote host that is not allow-listed, so the allow-list is derived from
   API_BASE_URL rather than hardcoded — one env var, and dev/staging/production
   each get the right host with no config edit.

   An unset or unparseable API_BASE_URL yields no patterns, which is correct:
   there is no API to load media from, and the site renders its local content. */
function mediaPatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const raw = process.env.API_BASE_URL?.trim();
  if (!raw) return [];

  try {
    const { protocol, hostname, port } = new URL(raw);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: "/media/**",
      },
    ];
  } catch {
    console.warn(`[next.config] API_BASE_URL is not a valid URL: ${raw}`);
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: mediaPatterns(),
  },
  async redirects() {
    return [
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
