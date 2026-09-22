export type Episode = {
  /* `title` doubles as the React key, so keep it unique */
  title: string;
  /* Undefined for an API row whose thumbnail has not been uploaded yet; the
     card then shows its dark placeholder rather than a broken image. */
  thumb?: string;
  thumbAlt: string;
  /* the coloured badge pinned to the thumbnail's bottom-left corner */
  badge: string;
  /* A hex value rather than a Tailwind class: the colour is editable per
     episode in the admin, and a class name in a database row would not survive
     Tailwind's build-time scan of the source. Applied as an inline style. */
  badgeColour: string;
  stats: { label: string; body: string }[];
};

/* The design runs teal → pink → purple down the page. An episode with no
   badge colour set in the admin keeps that rhythm by position. */
export const BADGE_PALETTE = ["#2dbe9e", "#d92d5e", "#3f2a6b"] as const;

/* Fallback used when the podcasts API is empty or unreachable.

   The mockup shows three episodes across four pages of pagination. Only the
   first page's content is specified, so that is what ships; add further pages
   here and the pager below picks them up automatically.

   EPISODES[0] is also what /insights renders as its featured podcast card — the
   Studio.pdf mockup specifies that card with this episode's title, still and
   teal badge. It is imported there rather than restated, so the two pages cannot
   drift apart. */
export const EPISODES: Episode[] = [
  {
    /* The Studio.pdf mockup titles this one "Podcast 1 : …", numbering it in the
       same series as the two below, which the Podcast.pdf mockup left as
       "Reasons Pakistani Manufacturers…" — a headline that belongs to the
       article on /insights, not to an episode. The mockup's own wording wins. */
    title:
      "Podcast 1 : world will know about the magic of digital world & its achievements.",
    thumb: "/images/podcast/ep-itcn.webp",
    thumbAlt: "Episode still — the People First team on stage at ITCN Asia",
    badge: "Largest digital marketing conference",
    badgeColour: BADGE_PALETTE[0],
    stats: [
      {
        label: "50+ clients",
        body: "Search Digital Agency New York, Information from Trusted Internet. Explore the Best Info Now.",
      },
      {
        label: "Concept",
        body: "For more than 50 years, global stage for innovation. And the all-digital CES 2022 continued to be.",
      },
    ],
  },
  {
    title:
      "Podcast 2 : world will know about the magic of digital world & its achievements.",
    thumb: "/images/podcast/ep-press.webp",
    thumbAlt: "Episode still — press conference at a technology launch",
    badge: "Largest digital marketing conference",
    badgeColour: BADGE_PALETTE[1],
    stats: [
      {
        label: "50+ clients",
        body: "Search Digital Agency New York, Information from Trusted Internet. Explore the Best Info Now.",
      },
      {
        label: "Concept",
        body: "For more than 50 years, global stage for innovation. And the all-digital CES 2022 continued to be.",
      },
    ],
  },
  {
    title:
      "Podcast 3: world will know about the magic of digital world & its achievements.",
    /* Uses the 5G still that episode 1 previously carried — the ITCN frame moved
       up to episode 1 to match the Studio.pdf mockup, and two episodes sharing
       one still would read as a rendering bug. */
    thumb: "/images/podcast/ep-5g.webp",
    thumbAlt:
      "Episode still — Pakistan Raises $507 Million in Major 5G Spectrum Auction",
    badge: "Largest digital marketing conference",
    badgeColour: BADGE_PALETTE[2],
    stats: [
      {
        label: "50+ clients",
        body: "Search Digital Agency New York, Information from Trusted Internet. Explore the Best Info Now.",
      },
      {
        label: "Concept",
        body: "For more than 50 years, global stage for innovation. And the all-digital CES 2022 continued to be.",
      },
    ],
  },
];

/* Pages shown in the pager. The mockup shows four; only page 1 has content. */
export const TOTAL_PAGES = 4;
