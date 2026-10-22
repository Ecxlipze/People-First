import { createPageMetadata } from "@/app/lib/seo";
import type { Metadata } from "next";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import Hero from "@/app/about/sections/Hero";
import JourneyPaths from "@/app/about/sections/JourneyPaths";
import KeyStats from "@/app/about/sections/KeyStats";
import VisionMission from "@/app/about/sections/VisionMission";

export const metadata: Metadata = createPageMetadata({
  title: "Our Story, Vision & Mission",
  description: "Meet People First and founder Rai Salahuddin Ahmad. Discover the story, vision, and mission behind an ecosystem built around people and opportunity.",
  path: "/about",
});

/* About page — a single scrollable, top-to-bottom composition. The right-hand
   icon rail (SideNav) and the footer (SiteFooter) are shared with /home so the
   page stays consistent with the rest of the site. */
export default function AboutPage() {
  return (
    <>
      {/* right vertical icon navbar — fixed z-[100], must be outside overflow-x-clip */}
      <SideNav />

      <div className="relative overflow-x-clip bg-white">
        <Hero />
        <JourneyPaths />
        <KeyStats />
        <VisionMission />
        <SiteFooter />
      </div>
    </>
  );
}
