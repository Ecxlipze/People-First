import { INSIGHTS, type Insight } from "@/app/insights/insights";

/* Ideas Lab → the "Recommended Article" rows.

   These are the same articles /insights publishes, so they are DERIVED from
   INSIGHTS rather than restated. Both mockups (`insights 4.pdf` for this page,
   `Studio.pdf` for /insights) specify the same first two articles down to the
   metric labels and the teal card values; keeping two hand-maintained copies
   meant every edit had to be made twice, and the copy on whichever page was
   forgotten would quietly go stale.

   Ideas Lab adds one thing /insights has no need for: each row links somewhere.
   That is what `href` is for, and it is the only field added here. */

export type Article = Insight & {
  href: string;
};

/* Every row links to /insights, where the article itself lives. When individual
   articles get their own routes this becomes a per-article slug — one place to
   change, because the rest of the record comes from INSIGHTS. */
export const ARTICLES: Article[] = INSIGHTS.map((insight) => ({
  ...insight,
  href: "/insights",
}));
