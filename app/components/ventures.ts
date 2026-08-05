/* Venture cards for the "core, joint, affiliated & genesis ventures" section.
   `logo` points at the artwork supplied in the homepage mockup. Cards without
   artwork retain the mockup's clean logo placeholder.
   Each venture carries an accent colour used for the card ring + button border.
   QA flagged these ("borders color of this card is not matching with design").

   Sampled from the HOME3.pdf render, which only rasterises via `pdftoppm` (the
   splash backend) — pdftocairo drops eight of the nine cards on this file.
   There are exactly THREE border colours across the nine cards, not nine:
     #2c8e85  teal     — Merchanity, Kissan Veer
     #a00017  crimson  — Insights, SME & Consumer, Health care, Technology,
                         Renewable Energy, Knowledge
     #2e21b6  indigo   — Abaad.pk
   An earlier pass recorded nine slightly different values (#b63a4c, #ad5770,
   #a76986, #ab5d77 …). Those were ANTIALIASED EDGE pixels — the border blending
   into the card fill or page background — not the stroke colour. Taking the
   modal non-fill/non-background pixel around each card's whole perimeter gives
   the three true values above. */
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
    accent: "#2c8e85",
  },
  {
    name: "Insights by people first",
    tagline: "Media & IT Intelligence Plateform",
    logo: "/images/home/ventures/insights.webp",
    hasLogo: true,
    href: "https://insights.peoplefirst.com",
    accent: "#a00017",
  },
  {
    name: "SME & Consumer",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#a00017",
  },
  {
    name: "Health care",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#a00017",
  },
  {
    name: "Technology",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#a00017",
  },
  {
    name: "Abaad.pk",
    tagline: "Smart Property Solutions",
    logo: "/images/home/ventures/abaad.webp",
    hasLogo: true,
    href: "https://abaad.pk",
    accent: "#2e21b6",
  },
  {
    name: "Kissan Veer",
    tagline: "Empowering Agriculture",
    logo: "/images/home/ventures/kissan-veer.webp",
    hasLogo: true,
    href: "https://kissanveer.com",
    accent: "#2c8e85",
  },
  {
    name: "Renewable Energy",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#a00017",
  },
  {
    name: "Knowledge",
    tagline: "Media & IT Intelligence Plateform",
    href: "#",
    accent: "#a00017",
  },
];
