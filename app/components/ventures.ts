/* Venture cards for the "core, joint, affiliated & genesis ventures" section.
   `logo` points at the artwork supplied in the homepage mockup. Cards without
   artwork retain the mockup's clean logo placeholder.
   Each venture carries an accent colour used for the card ring + button border.
   These are sampled per-card from HOME3.pdf — note Merchanity is TEAL (#508088)
   and Abaad.pk VIOLET (#6c5eb9), where both were previously the same blue; QA
   flagged Merchanity specifically ("borders color of this card is not matching
   with design"). HOME3 only rasterises via `pdftoppm` (the splash backend);
   pdftocairo drops eight of the nine cards on that file. */
export type Venture = {
  name: string;
  tagline: string;
  /* Path to a real logo in public/images/logos/. Leave undefined for a clean
     placeholder box. Set the path AND flip `hasLogo` true once the file exists
     (a path to a missing file makes next/image render broken-image alt text). */
  logo?: string;
  hasLogo?: boolean;
  href: string;
  accent: string; // hex ring/border colour
};

export const VENTURES: Venture[] = [
  {
    name: "Merchanity",
    tagline: "Digital Commerce Solutions",
    logo: "/images/home/ventures/merchanity.webp",
    hasLogo: true,
    href: "https://merchanity.com",
    accent: "#508088",
  },
  {
    name: "Insights by people first",
    tagline: "Media & IT Intelligence Plateform",
    logo: "/images/home/ventures/insights.webp",
    hasLogo: true,
    href: "https://insights.peoplefirst.com",
    accent: "#b63a4c",
  },
  {
    name: "SME & Consumer",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#b63a4c",
  },
  {
    name: "Health care",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#ad5770",
  },
  {
    name: "Technology",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#b63a4c",
  },
  {
    name: "Abaad.pk",
    tagline: "Smart Property Solutions",
    logo: "/images/home/ventures/abaad.webp",
    hasLogo: true,
    href: "https://abaad.pk",
    accent: "#6c5eb9",
  },
  {
    name: "Kissan Veer",
    tagline: "Empowering Agriculture",
    logo: "/images/home/ventures/kissan-veer.webp",
    hasLogo: true,
    href: "https://kissanveer.com",
    accent: "#638392",
  },
  {
    name: "Renewable Energy",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#a76986",
  },
  {
    name: "Knowledge",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#ab5d77",
  },
];
