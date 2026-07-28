import type { Metadata } from "next";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import Hero from "@/app/podcasts/sections/Hero";
import StudioSound from "@/app/podcasts/sections/StudioSound";
import Analytics from "@/app/podcasts/sections/Analytics";
import OurPodcasts from "@/app/podcasts/sections/OurPodcasts";

export const metadata: Metadata = {
  title: "Podcasts — People First",
  description:
    "Real conversations, real insights, real growth. Entrepreneurs, industry leaders, and innovators on building successful businesses in Pakistan.",
};

/* Podcasts — a single scrollable, top-to-bottom composition, structured like
   /about and /grow-with-us: the shared right-hand icon rail (SideNav) and
   shared footer bookend the page's own sections. The footer's built-in
   "Let's Get in Touch" band is the CTA the design calls for. */
export default function PodcastsPage() {
  return (
    <>
      {/* right vertical icon navbar — fixed z-[100], must be outside overflow-x-clip */}
      <SideNav />

      <div className="relative overflow-x-clip bg-white">
        <Hero />
        <StudioSound />
        <Analytics />
        <OurPodcasts />
        <SiteFooter />
      </div>
    </>
  );
}
