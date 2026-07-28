/* Section 3 data — venture tiers, client results, and impact focus areas.

   All copy here is lifted verbatim from the mockup PDF's `/ActualText`
   structure entries, so it does not suffer the dropped-character problem that
   plagues this deck's Type3 fonts (see the note in stages.ts). Colours are the
   literal path fills read out of the same file. */

export type VentureTier = {
  name: string;
  blurb: string;
  /* the tier's accent — used for the heading, the icon tint and, at 6% alpha,
     the card wash, exactly as the mockup composes it */
  accent: string;
  /* Core and Joint Ventures are drawn as vector glyphs in the source, so they
     render as lucide icons; the other two are raster artwork. */
  icon?: string;
  iconAlt?: string;
};

/* Four tiers, left to right. In the mockup these are 302×402 cards spaced
   350px apart on a 1920 canvas — i.e. equal columns with a ~48px gutter. */
export const VENTURE_TIERS: VentureTier[] = [
  {
    name: "CORE VENTURES",
    blurb: "Built and operated by People First.",
    accent: "#7531ac",
  },
  {
    name: "JOINT VENTURES",
    blurb: "Partnered for greater impact",
    accent: "#328b8a",
  },
  {
    name: "AFFILIATED VENTURES",
    blurb: "Groomed and aligned under People First",
    accent: "#aa37ff",
    icon: "/images/what-we-do/s3/tier-affiliated.webp",
    iconAlt: "",
  },
  {
    name: "GENESIS VENTURES",
    blurb: "Co-created by people First",
    accent: "#cf475f",
    icon: "/images/what-we-do/s3/tier-genesis.webp",
    iconAlt: "",
  },
];

export type Result = {
  text: string;
  icon: string;
};

/* "Results Clients Can Expect" — five items scattered across two rows in the
   mockup rather than set on a strict grid. The order here is the reading order
   of that scatter: top row left→right, then bottom row left→right. */
export const RESULTS: Result[] = [
  {
    text: "Increased online visibility and inbound customer enquiries",
    icon: "/images/what-we-do/s3/result-visibility.webp",
  },
  {
    text: "Reduced dependency on intermediaries",
    icon: "/images/what-we-do/s3/result-dependency.webp",
  },
  {
    text: "Higher profit margins through direct sales channels",
    icon: "/images/what-we-do/s3/result-margins.webp",
  },
  {
    text: "Faster, more efficient operations",
    icon: "/images/what-we-do/s3/result-operations.webp",
  },
  {
    text: "Sustainable digital growth",
    icon: "/images/what-we-do/s3/result-growth.webp",
  },
];

export type ImpactArea = {
  title: string;
  blurb: string;
  icon: string;
  /* Youth Employment is the one filled card in the mockup — navy #090c62 with
     reversed-out text. Everything else is white. */
  featured?: boolean;
};

/* "Impact Focus Areas" — 3 cards then 2, each 400×262 in the source. */
export const IMPACT_AREAS: ImpactArea[] = [
  {
    title: "Economic Empowerment",
    blurb:
      "Removing middlemen and enabling direct commerce so producers keep more of what they earn.",
    icon: "/images/what-we-do/s3/impact-economic.webp",
  },
  {
    title: "Youth Employment",
    blurb:
      "Providing practical digital skills that create real income pathways for Pakistan's young generation.",
    icon: "/images/what-we-do/s3/impact-youth.webp",
    featured: true,
  },
  {
    title: "Women's Financial Independence",
    blurb:
      "Training programs and remote work opportunities enabling women to earn on their own terms.",
    icon: "/images/what-we-do/s3/impact-women.webp",
  },
  {
    title: "Industry Academia Bridge",
    blurb:
      "Connecting educational institutions with industry needs to reduce the skills gap.",
    icon: "/images/what-we-do/s3/impact-industry.webp",
  },
  {
    title: "Digital Inclusion",
    blurb:
      "Making technology and digital tools accessible to businesses that have traditionally been left behind",
    icon: "/images/what-we-do/s3/impact-digital.webp",
  },
];
