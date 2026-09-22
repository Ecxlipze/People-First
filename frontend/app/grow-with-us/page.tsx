import type { Metadata } from "next";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import Hero from "@/app/grow-with-us/sections/Hero";
import ProgramAreas from "@/app/grow-with-us/sections/ProgramAreas";
import WhoCanJoin from "@/app/grow-with-us/sections/WhoCanJoin";
import ProgramOutcomes from "@/app/grow-with-us/sections/ProgramOutcomes";

export const metadata: Metadata = {
  title: "Grow with Us",
  description:
    "Explore training programs, career paths, and business growth opportunities with People First.",
  alternates: {
    canonical: "/grow-with-us",
  },
};

/* Grow With Us — a single scrollable, top-to-bottom composition, structured
   like /about: the shared right-hand icon rail (SideNav) and shared footer
   bookend the page's own sections. The footer's built-in "Let's Get in Touch"
   band is the CTA the design calls for, so it renders with showCta left on. */
export default function GrowWithUsPage() {
  return (
    <>
      {/* right vertical icon navbar — fixed z-[100], must be outside overflow-x-clip */}
      <SideNav />

      <div className="relative overflow-x-clip bg-white">
        <Hero />
        <ProgramAreas />
        <WhoCanJoin />
        <ProgramOutcomes />
        <SiteFooter />
      </div>
    </>
  );
}
