import { absoluteSiteUrl, createPageMetadata, serializeJsonLd } from "@/app/lib/seo";
import type { Metadata } from "next";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import Hero from "@/app/podcasts/sections/Hero";
import StudioSound from "@/app/podcasts/sections/StudioSound";
import Analytics from "@/app/podcasts/sections/Analytics";
import OurPodcasts from "@/app/podcasts/sections/OurPodcasts";
import { getEpisodes } from "@/app/lib/content";

export const metadata: Metadata = createPageMetadata({
  title: "Podcasts & Conversations",
  description: "Watch and listen to People First podcasts featuring conversations, ideas, insights, and perspectives on learning and growth.",
  path: "/podcasts",
});

/* Podcasts — a single scrollable, top-to-bottom composition, structured like
   /about and /grow-with-us: the shared right-hand icon rail (SideNav) and
   shared footer bookend the page's own sections. The footer's built-in
   "Let's Get in Touch" band is the CTA the design calls for. */
export default async function PodcastsPage() {
  const episodes = await getEpisodes();

  const videoEpisodes = episodes.filter((ep) => ep.videoUrl);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteSiteUrl("/podcasts#episodes"),
    url: absoluteSiteUrl("/podcasts"),
    name: "Our Podcasts",
    numberOfItems: videoEpisodes.length,
    itemListElement: videoEpisodes.map((ep, i) => {
      // A watch page is not a video file; only known YouTube players get embedUrl.
      const embedUrl = youtubeEmbedUrl(ep.videoUrl!);
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "VideoObject",
          name: ep.title,
          description: ep.description || ep.title,
          ...(ep.thumb ? { thumbnailUrl: [absoluteSiteUrl(ep.thumb)] } : {}),
          url: ep.videoUrl,
          ...(embedUrl ? { embedUrl } : {}),
          ...(ep.publishedAt ? { uploadDate: ep.publishedAt } : {}),
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      {/* right vertical icon navbar — fixed z-[100], must be outside overflow-x-clip */}
      <SideNav />

      <div className="relative overflow-x-clip bg-white">
        <Hero />
        <StudioSound />
        <Analytics />
        <OurPodcasts episodes={episodes} />
        <SiteFooter />
      </div>
    </>
  );
}

function youtubeEmbedUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return;
    const host = url.hostname.replace(/^www\./, "");
    let id: string | null | undefined;
    if (host === "youtu.be") {
      id = url.pathname.split("/")[1];
    } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      id = url.pathname === "/watch"
        ? url.searchParams.get("v")
        : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)\/?$/)?.[1];
    }
    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
      return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    // An incomplete CMS URL must not break the page's structured data.
  }
}
