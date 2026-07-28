import type { Metadata } from "next";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import Hero from "@/app/about/sections/Hero";
import JourneyPaths from "@/app/about/sections/JourneyPaths";
import KeyStats from "@/app/about/sections/KeyStats";
import VisionMission from "@/app/about/sections/VisionMission";
import CTABanner from "@/app/about/sections/CTABanner";

export const metadata: Metadata = {
  title: "About — People First",
  description:
    "Every movement begins with a question. The People First story, our journey paths, key stats, and our vision & mission.",
};

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
        <CTABanner />
        {/* CTABanner above already provides the "Let's Get in Touch" band, so the
            shared footer renders without its own duplicate band. */}
        <SiteFooter showCta={false} />
      </div>
    </>
  );
}
