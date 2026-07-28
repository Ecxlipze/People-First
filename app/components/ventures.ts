/* Venture cards for the "core, joint, affiliated & genesis ventures" section.
   `logo` points at public/images/logos/<file>. Drop real logo files there and
   they render automatically; until then VentureCard shows a styled placeholder.
   Each venture carries an accent colour used for the card ring + button border,
   matching the design (blue / teal / pink-red groupings). */
export type Venture = {
  name: string;
  tagline: string;
  /* Path to a real logo in public/images/logos/. Leave undefined for a clean
     placeholder box. Set the path AND flip `hasLogo` true once the file exists
     (a path to a missing file makes next/image render broken-image alt text). */
  logo?: string; // e.g. "/images/logos/merchanity.svg"
  hasLogo?: boolean;
  href: string;
  accent: string; // hex ring/border colour
};

export const VENTURES: Venture[] = [
  {
    name: "Merchanity",
    tagline: "Digital Commerce Solutions",
    logo: "/images/logos/merchanity.svg",
    href: "https://merchanity.com",
    accent: "#4f6ef7",
  },
  {
    name: "Insights by people first",
    tagline: "Media & IT Intelligence Plateform",
    logo: "/images/logos/insights.svg",
    href: "https://insights.peoplefirst.com",
    accent: "#e0325a",
  },
  {
    name: "SME & Consumer",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#e0325a",
  },
  {
    name: "Health care",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#e0325a",
  },
  {
    name: "Technology",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#e0325a",
  },
  {
    name: "Abaad.pk",
    tagline: "Smart Property Solutions",
    logo: "/images/logos/abaad.svg",
    href: "https://abaad.pk",
    accent: "#4f6ef7",
  },
  {
    name: "Kissan Veer",
    tagline: "Empowering Agriculture",
    logo: "/images/logos/kissan-veer.svg",
    href: "https://kissanveer.com",
    accent: "#5a9e95",
  },
  {
    name: "Renewable Energy",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#e0325a",
  },
  {
    name: "Knowledge",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#e0325a",
  },
];
