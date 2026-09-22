/* Insights by People First — article index data.

   The mockup (public/images/Studio.pdf) specifies one article in full: the
   "Reasons Pakistani Manufacturers..." hero, its 80% metric and the teal
   "2025 MARKETING TIPS" card. That article also already appears as row 1 of the
   Ideas Lab list, where it links here — so this page is its home, and the
   remaining rows extend the same shape using the other stills that were
   extracted from the mockups into /public/images/insights/.

   `category` exists because the mockup's toolbar has an "All Category"
   dropdown. The options below are derived from these values rather than being a
   second hardcoded list, so a new article can never introduce a category the
   filter doesn't offer (or vice versa). */

export type InsightCategory =
  | "Digital Commerce"
  | "Business Growth"
  | "Skills & Training";

export type Insight = {
  title: string;
  blurb: string;
  category: InsightCategory;
  /* the red percentage under the blurb */
  metric: string;
  metricLabel: string;
  /* the teal card overlapping the thumbnail's lower-left */
  cardValue: string;
  cardLabel: string;
  thumb: string;
  thumbAlt: string;
  /* Studio.pdf uses a different editorial still for the Insights feature than
     Ideas Lab uses for the same article. Keep both so matching one mockup does
     not silently change the other page. */
  studioThumb?: string;
  studioThumbAlt?: string;
  /* object-position for the still. The source frames have differing aspect
     ratios but share one frame here, so this picks which end survives the
     crop. Omit for a centred crop. */
  thumbPosition?: string;
};

export const INSIGHTS: Insight[] = [
  {
    title: "Reasons Pakistani Manufacturers Should Start Selling Online",
    blurb:
      "The strategy is the key to grow your business through online marketing",
    category: "Digital Commerce",
    metric: "80%",
    metricLabel: "Beneficial\nMarketing tips",
    cardValue: "2025",
    cardLabel: "MARKETING\nTIPS",
    thumb: "/images/insights/article-1.webp",
    thumbAlt:
      "Audience at a People First industry session on selling online",
    studioThumb: "/images/insights/studio-audience.webp",
    studioThumbAlt:
      "Audience attending a People First business and industry conference",
  },
  {
    title: "How to Digitize Your Business Without a Big Budget",
    blurb:
      "We are strategy consultants who work with startup strategies and help promote and sell your products, including helping marketing.",
    category: "Business Growth",
    metric: "80%",
    metricLabel: "Increased\nPerformance Rate",
    cardValue: "27%",
    cardLabel: "Productivity increase\non average",
    thumb: "/images/insights/article-2.webp",
    thumbAlt:
      "Panel interview with the Punjab Information Technology Board",
    thumbPosition: "center",
  },
  {
    title: "Building Market-Ready Skills That Employers Actually Hire For",
    blurb:
      "Practical, income-generating training built around what the market needs right now — not what it needed five years ago.",
    category: "Skills & Training",
    metric: "80%",
    metricLabel: "Beneficial\nMarketing tips",
    cardValue: "2025",
    cardLabel: "MARKETING\nTIPS",
    thumb: "/images/insights/article-3.webp",
    thumbAlt: "Group photo at the Lahore Chamber of Commerce & Industry",
    /* anchor top so the venue sign above the group stays in frame — a centred
       crop cuts it and keeps empty floor instead */
    thumbPosition: "top",
  },
];

/* The dropdown's options: "All Category" (the mockup's own default label)
   followed by each category that actually occurs, in first-appearance order.
   Derived rather than hardcoded so the two can't drift apart. */
export const ALL_CATEGORY = "All Category" as const;

export const CATEGORY_OPTIONS: readonly [typeof ALL_CATEGORY, ...string[]] = [
  ALL_CATEGORY,
  ...Array.from(new Set(INSIGHTS.map((i) => i.category))),
];
