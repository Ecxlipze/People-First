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
   here and the pager below picks them up automatically. */
export const EPISODES: Episode[] = [
  {
    title: "Reasons Pakistani Manufacturers Should Start Selling Online",
    thumb: "/images/podcast/ep-5g.webp",
    thumbAlt:
      "Episode still — Pakistan Raises $507 Million in Major 5G Spectrum Auction",
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
    thumb: "/images/podcast/ep-itcn.webp",
    thumbAlt: "Episode still — the People First team on stage at ITCN Asia",
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
