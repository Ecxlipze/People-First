export type Episode = {
  id?: number;
  slug?: string;
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
  videoUrl?: string;
  isFeatured?: boolean;
  description?: string;
};

/* The design runs teal → pink → purple down the page. An episode with no
   badge colour set in the admin keeps that rhythm by position. */
export const BADGE_PALETTE = ["#2dbe9e", "#d92d5e", "#3f2a6b"] as const;

/* Fallback used when the podcasts API is empty or unreachable.
   Synced directly with live production episodes so offline fallbacks
   mirror live content. */
export const EPISODES: Episode[] = [
  {
    id: 15,
    slug: "the-journey-from-0-to-multi-million-empiremaster-f",
    title:
      "The Journey from 0 to Multi- Million Empire!Master Faheem's Secret to Success!",
    description:
      "Master Faheem shares his journey, key business strategies, and secrets to building a multi-million empire from scratch.",
    thumb:
      "/images/podcast/the-journey-from-0-to-multi-million-empiremaster-f-thumb.jpg",
    thumbAlt:
      "The Journey from 0 to Multi- Million Empire!Master Faheem's Secret to Success!",
    badge: "Success Story",
    badgeColour: BADGE_PALETTE[0],
    isFeatured: true,
    videoUrl: "https://youtu.be/VOarkU7cRXs",
    stats: [
      {
        label: "Entrepreneurship",
        body: "From 0 to Multi-Million Empire with Master Faheem.",
      },
    ],
  },
  {
    id: 13,
    slug: "kya-punjabi-zubaan-taraqqi-mein-rukawat-ha-ahmad-r",
    title: "Kya Punjabi zubaan Taraqqi mein Rukawat Ha? ! Ahmad Raza Punjabi",
    description:
      "Ahmad Raza Punjabi discusses language, culture, and progress in modern Pakistan.",
    thumb:
      "/images/podcast/kya-punjabi-zubaan-taraqqi-mein-rukawat-ha-ahmad-r-thumb.jpg",
    thumbAlt:
      "Kya Punjabi zubaan Taraqqi mein Rukawat Ha? ! Ahmad Raza Punjabi",
    badge: "Culture & Tech",
    badgeColour: BADGE_PALETTE[1],
    isFeatured: true,
    videoUrl: "https://youtu.be/wBwtBmCu47U",
    stats: [
      {
        label: "Language & Growth",
        body: "Breaking linguistic stereotypes for economic growth.",
      },
    ],
  },
  {
    id: 12,
    slug: "failed-locally-succeeded-globally-furqan-azizs-inv",
    title:
      "Failed Locally, Succeeded Globally | Furqan Aziz’s InvoZone Journey",
    description:
      "Furqan Aziz discusses navigating domestic failures and scaling InvoZone into a global software powerhouse.",
    thumb:
      "/images/podcast/failed-locally-succeeded-globally-furqan-azizs-inv-thumb.jpg",
    thumbAlt:
      "Failed Locally, Succeeded Globally | Furqan Aziz’s InvoZone Journey",
    badge: "Global Tech",
    badgeColour: BADGE_PALETTE[2],
    isFeatured: true,
    videoUrl: "https://youtu.be/KkIsAuewyrA",
    stats: [
      {
        label: "Global Reach",
        body: "Building a global technology enterprise from Pakistan.",
      },
    ],
  },
  {
    id: 11,
    slug: "why-do-pakistani-businesses-stop-growingthe-invisi",
    title:
      "WHY DO PAKISTANI BUSINESSES STOP GROWING?THE INVISIBLE GLASS CEILING!MEERAN NASIR",
    description:
      "Why do so many promising Pakistani businesses hit an invisible glass ceiling and stop growing? In this episode, we sit down with Meeran Nasir, CEO of KOT Enterprises.",
    thumb:
      "/images/podcast/why-do-pakistani-businesses-stop-growingthe-invisi-thumb_RlGK6Dm.jpg",
    thumbAlt:
      "WHY DO PAKISTANI BUSINESSES STOP GROWING?THE INVISIBLE GLASS CEILING!MEERAN NASIR",
    badge: "Business Growth",
    badgeColour: BADGE_PALETTE[0],
    isFeatured: false,
    videoUrl: "https://youtu.be/T6m7NKtrAHc?si=0Rzs4MCaNiU6dfFx",
    stats: [
      {
        label: "Scale & Strategy",
        body: "Breaking through growth barriers with Meeran Nasir.",
      },
    ],
  },
  {
    id: 10,
    slug: "how-a-30-year-old-ceo-built-15-companies-in-15-yea",
    title: "How a 30-Year-Old CEO Built 15 Companies in 15 Years",
    description:
      "Exploring the journey behind building multiple businesses from the ground up — vision, challenges, failures, and execution strategies.",
    thumb:
      "/images/podcast/how-a-30-year-old-ceo-built-15-companies-in-15-yea-thumb.jpg",
    thumbAlt: "How a 30-Year-Old CEO Built 15 Companies in 15 Years",
    badge: "Venture Building",
    badgeColour: BADGE_PALETTE[1],
    isFeatured: false,
    videoUrl: "https://youtu.be/kja7cyiRz1g?si=tAGC3i7Kca6R6Mz2",
    stats: [
      {
        label: "Serial Entrepreneur",
        body: "15 companies in 15 years: Lessons in velocity and focus.",
      },
    ],
  },
  {
    id: 9,
    slug: "inside-the-mind-of-an-it-ceo",
    title: "INSIDE THE MIND OF AN IT CEO",
    description:
      "What goes on inside the mind of an IT CEO? From bold decisions and constant innovation to building teams and solving complex tech challenges.",
    thumb:
      "/images/podcast/inside-the-mind-of-an-it-ceo-thumb_A1V5jX0.jpg",
    thumbAlt: "INSIDE THE MIND OF AN IT CEO",
    badge: "Leadership",
    badgeColour: BADGE_PALETTE[2],
    isFeatured: false,
    videoUrl: "https://youtu.be/JvvEjO8Xn9Q?si=lXEY5c5ea0YfitM0",
    stats: [
      {
        label: "Tech Leadership",
        body: "Key decisions driving Pakistan's software industry.",
      },
    ],
  },
];

/* Pages shown in the pager. */
export const TOTAL_PAGES = 4;
