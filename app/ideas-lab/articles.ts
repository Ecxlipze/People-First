export type Article = {
  title: string;
  blurb: string;
  /* the red percentage under the blurb */
  metric: string;
  metricLabel: string;
  /* the teal card overlapping the thumbnail */
  cardValue: string;
  cardLabel: string;
  thumb: string;
  thumbAlt: string;
  /* object-position for the still. The three source frames have different
     aspect ratios (1.58 / 1.21 / 1.19) but share one 16:10 frame, so the two
     taller ones lose ~25% of their height to the crop — this picks which end
     survives. Omit for a centred crop. */
  thumbPosition?: string;
  href: string;
};

/* The three "Recommended Article" rows. Thumbnails live in
   /public/images/insights/, extracted from the `insights 4.pdf` mockup. */
export const ARTICLES: Article[] = [
  {
    title: "Reasons Pakistani Manufacturers Should Start Selling Online",
    blurb:
      "The strategy is the key to grow your business through online marketing",
    metric: "80%",
    metricLabel: "Beneficial\nMarketing tips",
    cardValue: "2025",
    cardLabel: "MARKETING\nTIPS",
    thumb: "/images/insights/article-1.webp",
    thumbAlt: "Tech Insights interview with Salahuddin Ahmad on selling online",
    href: "/insights",
  },
  {
    title: "How to Digitize Your Business Without a Big Budget",
    blurb:
      "We are strategy consultants who work with startup strategies and help promote and sell your products, including helping marketing.",
    metric: "80%",
    metricLabel: "Increased\nPerformance Rate",
    cardValue: "27%",
    cardLabel: "Productivity increase\non average",
    thumb: "/images/insights/article-2.webp",
    thumbAlt:
      "Panel interview with the Punjab Information Technology Board, part three",
    /* centre keeps both the three speakers and the caption bar in frame */
    thumbPosition: "center",
    href: "/insights",
  },
  {
    title: "Reasons Pakistani Manufacturers Should Start Selling Online",
    blurb:
      "The strategy is the key to grow your business through online marketing",
    metric: "80%",
    metricLabel: "Beneficial\nMarketing tips",
    cardValue: "2025",
    cardLabel: "MARKETING\nTIPS",
    thumb: "/images/insights/article-3.webp",
    thumbAlt: "Group photo at the Lahore Chamber of Commerce & Industry",
    /* anchor top so the "Lahore Chamber of Commerce & Industry" sign above the
       group stays in frame — a centred crop cuts it and keeps empty floor */
    thumbPosition: "top",
    href: "/insights",
  },
];
