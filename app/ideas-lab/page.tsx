import type { Metadata } from "next";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import Hero from "@/app/ideas-lab/sections/Hero";
import RecommendedArticles from "@/app/ideas-lab/sections/RecommendedArticles";

export const metadata: Metadata = {
  title: "Ideas Lab — People First",
  description:
    "Insights to help you grow in the ecosystem. Practical articles, guides, and perspectives on human transformation, economic gateways, startup growth, and skills development.",
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
            Opaque rounded block with a negative top margin → swipes over the
            pinned hero. */}
        <RecommendedArticles />

        {/* Footer sits in normal flow below section 2, as on every other page.
            Section 2 already ends the page's own content, so the footer keeps its
            "Let's Get in Touch" band. */}
        <SiteFooter />
      </div>
    </>
  );
}
