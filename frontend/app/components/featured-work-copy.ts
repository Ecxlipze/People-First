/* Editorial content for /home's Featured Work section.

   Only the words and numbers live here. The section's imagery, measured
   geometry and scroll-pinning stay in FeaturedWork.tsx: the mockup specifies
   one bespoke two-block composition, not a repeating card list, so the layout
   is not data.

   The matching API row is the first /api/featured-work/ record by `order`;
   see app/lib/content/index.ts. These values are the fallback and the design's
   original copy. */

export type FeaturedWorkCopy = {
  /* A newline is a deliberate line break in the heading — the design sets
     "Tech Events" and "Management." on two lines. */
  title: string;
  description: string;
  /* the red percentage beside the heading */
  metricValue: string;
  metricLabel: string;
  /* the teal card overhanging the photo's bottom-right corner */
  secondaryMetricValue: string;
  secondaryMetricLabel: string;
  /* the two-column checklist under the copy */
  bullets: string[];
};

export const FEATURED_WORK_COPY: FeaturedWorkCopy = {
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
};
