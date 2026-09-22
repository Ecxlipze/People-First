import type { Metadata } from "next";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import Hero from "@/app/ideas-lab/sections/Hero";
import RecommendedArticles from "@/app/ideas-lab/sections/RecommendedArticles";
import TallSwipePanel from "@/app/components/TallSwipePanel";

export const metadata: Metadata = {
  title: "Ideas Lab",
  description:
    "Discover insights, articles, and growth resources from the People First Ideas Lab.",
  alternates: {
    canonical: "/ideas-lab",
  },
};

/* Ideas Lab — built on the /home swipe-over pattern: SECTION 1 pins itself
   (`sticky top-0 h-screen`) and SECTION 2 rises up and over it, carrying the
   covering-block styling (opaque bg, rounded top, upward shadow, higher
   z-index, small negative top margin) the way FeaturedWork does on /home. */
export default function IdeasLabPage() {
  return (
    <>
      {/* right vertical icon navbar — fixed z-[100], must be outside overflow-x-clip */}
      <SideNav />

      <div className="relative overflow-x-clip bg-[linear-gradient(120deg,#ffffff_0%,#fdfdff_55%,#f7f4fd_100%)]">
        {/* ── SECTION 1: HERO ── pinned; SECTION 2 swipes up over it */}
        <Hero />

        {/* ── SECTION 2: RECOMMENDED ARTICLES ──
            Starts fully below the initial viewport, then swipes over the
            pinned hero once scrolling begins. */}
        <TallSwipePanel holdForNext={false}>
          <RecommendedArticles />
          {/* Footer belongs to section 2 and continues in the same white panel;
              it is not a separate swipe-over section. */}
          <SiteFooter />
        </TallSwipePanel>
      </div>
    </>
  );
}
