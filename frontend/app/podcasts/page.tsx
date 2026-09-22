import type { Metadata } from "next";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import Hero from "@/app/podcasts/sections/Hero";
import StudioSound from "@/app/podcasts/sections/StudioSound";
import Analytics from "@/app/podcasts/sections/Analytics";
import OurPodcasts from "@/app/podcasts/sections/OurPodcasts";
import { getEpisodes } from "@/app/lib/content";

export const metadata: Metadata = {
  title: "Podcasts",
  description:
    "Listen to People First podcasts, conversations, insights, and growth content.",
  alternates: {
    canonical: "/podcasts",
  },
};

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
    itemListElement: videoEpisodes.map((ep, i) => {
      const match = ep.videoUrl?.match(
        /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      const embedUrl = match
        ? `https://www.youtube.com/embed/${match[1]}`
        : ep.videoUrl;
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "VideoObject",
          name: ep.title,
          description: ep.description || ep.title,
          thumbnailUrl: ep.thumb
            ? [ep.thumb.startsWith("http") ? ep.thumb : `https://peoplefirst.com${ep.thumb}`]
            : [],
          contentUrl: ep.videoUrl,
          embedUrl: embedUrl,
          uploadDate: "2024-01-01T00:00:00Z",
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
