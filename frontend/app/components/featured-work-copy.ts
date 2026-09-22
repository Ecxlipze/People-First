/* Editorial content for /home's Featured Work section.

   Only the words, numbers, and media assets live here. The section's measured
   geometry and scroll-pinning stay in FeaturedWork.tsx and MediaShowcase.tsx:
   the mockup specifies a bespoke two-block composition, not a repeating card
   list, so the layout is not data.

   Both blocks are backed by /api/featured-work/ records (order=0 for Block 1:
   Cinematic Podcast Stage, order=1 for Block 2: Tech Events Management).
   These values are the fallback and the design's original copy. */

export type FeaturedWorkBlock = {
  /* A newline is a deliberate line break in the heading — e.g. "Tech Events\nManagement."
     or "Podcast: market\nstrategy". */
  title: string;
  description: string;
  /* the red percentage beside the heading / copy */
  metricValue: string;
  metricLabel: string;
  /* the teal card overhanging the photo */
  secondaryMetricValue: string;
  secondaryMetricLabel: string;
  /* the two-column checklist under the copy (used on Block 2) */
  bullets: string[];
  /* photo thumbnail URL */
  thumbnail?: string;
  /* optional video link */
  videoUrl?: string;
};

export type FeaturedWorkData = {
  podcast: FeaturedWorkBlock;
  events: FeaturedWorkBlock;
};

export const DEFAULT_PODCAST_BLOCK: FeaturedWorkBlock = {
  title: "Podcast: market\nstrategy",
  description:
    "We are strategy consultants who work with startup strategies and help promote and sell your products, including helping marketing.",
  metricValue: "80%",
  metricLabel: "Increased\nPerformance Rate",
  secondaryMetricValue: "27%",
  secondaryMetricLabel: "have knowledge about market strategies.",
  bullets: [],
  thumbnail: "/images/featured/feature1.webp",
  videoUrl: "https://www.youtube.com/watch?v=QM_mLwuP8vs",
};

export const DEFAULT_EVENTS_BLOCK: FeaturedWorkBlock = {
  title: "Tech Events\nManagement.",
  description:
    "We are strategy consultants who work with startup strategies and help promote and sell your products, including helping marketing.",
  metricValue: "30%",
  metricLabel: "management skills",
  /* home2.pdf reads "45% / Productivity events all over Pakistan" — the site
     had "5% / activity events all Pakistan"; the photo simply occludes the
     start of the string in the mockup, the text layer carries it in full. */
  secondaryMetricValue: "45%",
  secondaryMetricLabel: "Productivity events all over Pakistan",
  bullets: [
    "Seminars",
    "Round Talks",
    "Table Talks",
    "Conferences",
    "Tech Talks",
  ],
  thumbnail: "/images/featured/feature2.webp",
  videoUrl: "",
};

export const FEATURED_WORK_COPY: FeaturedWorkData = {
  podcast: DEFAULT_PODCAST_BLOCK,
  events: DEFAULT_EVENTS_BLOCK,
};

/* Backward-compatibility alias */
export type FeaturedWorkCopy = FeaturedWorkData;
