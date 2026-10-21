import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import InsightsBoard from "@/app/media-events/sections/InsightsBoard";
import BlogSidebar from "@/app/media-events/BlogSidebar";
import FeaturedPodcast from "@/app/media-events/sections/FeaturedPodcast";
import { getEpisodes, getInsights } from "@/app/lib/content";

export const metadata: Metadata = {
  title: "Media / Events",
  description: "Featured media, events, and studio content from People First.",
  alternates: {
    canonical: "/media-events",
  },
};

/* Media / Events (formerly "Insights by People First", /insights) — built from public/images/Studio.pdf.

   A single flowing page rather than the swipe-over stack /home and /what-we-do
   use: the mockup is one continuous field with the logo, a filter toolbar, the
   article rows and a closing podcast card, with no pinned hero to hand off
   from. Adding a swipe-over here would invent a structure the design does not
   have.

   The page tint is the mockup's own very pale lavender wash (#fcf8ff sampled
   from the artwork), which the sections sit directly on. */
export default async function InsightsPage() {
  const [insights, episodes] = await Promise.all([getInsights(), getEpisodes()]);
  /* Up to 3 featured episodes; if none or fewer are marked featured, fall back to top episodes. */
  const explicitFeatured = episodes.filter((ep) => ep.isFeatured);
  const featuredEpisodes =
    explicitFeatured.length > 0
      ? explicitFeatured.slice(0, 3)
      : episodes.slice(0, 3);

  return (
    <>
      {/* right vertical icon navbar — fixed z-[100], must be outside overflow-x-clip */}
      <SideNav />

      <div className="relative overflow-x-clip bg-[linear-gradient(150deg,#f2fbfb_0%,#fbf8ff_45%,#fcf8ff_100%)]">
        {/* logo, top-left — links back to the landing page, matching how the
            About and What We Do pages orient the reader */}
        <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 lg:pt-12 xl:px-28 xl:pt-14 [@media(max-height:500px)]:pt-4">
          <Link
            href="/"
            aria-label="People First — landing"
            className="group inline-flex min-h-11 items-center"
          >
            <Image
              src="/images/logo.png"
              alt="People First"
              width={1000}
              height={252}
              priority
              className="h-10 w-auto sm:h-12 lg:h-[52px] [@media(max-height:500px)]:h-9"
            />
          </Link>
        </header>

        <main>
          <InsightsBoard
            insights={insights}
            sidebar={
              <BlogSidebar
                posts={insights.map((i) => ({
                  slug: i.slug,
                  title: i.title,
                  image: i.thumb,
                  imageAlt: i.thumbAlt,
                  publishedAt: i.publishedAt,
                }))}
              />
            }
          />
          {/* Featured podcasts section (up to 3 episodes) */}
          {featuredEpisodes.length > 0 && (
            <FeaturedPodcast episodes={featuredEpisodes} />
          )}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
