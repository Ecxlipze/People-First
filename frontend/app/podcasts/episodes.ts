export type Episode = {
  /* `title` doubles as the React key, so keep it unique */
  title: string;
  thumb: string;
  thumbAlt: string;
  /* the coloured badge pinned to the thumbnail's bottom-left corner */
  badge: string;
  badgeBg: string;
  stats: { label: string; body: string }[];
};

/* The mockup shows three episodes across four pages of pagination. Only the
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
    badgeBg: "bg-pf-teal",
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
    badgeBg: "bg-[#d92d5e]",
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
    badgeBg: "bg-[#3f2a6b]",
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
