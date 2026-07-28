/* Section 5 data — the four corporate pillars of the brand architecture.

   Copy is verbatim from the mockup PDF's `/ActualText` entries.

   Geometry, on the PDF's 1440×1304 canvas: the cards are 620×388 at
   x=80/750, y=398/826 — a 2×2 grid with a 50px gutter. Each card carries a
   19×174 accent bar on its left edge, aligned to the card's upper portion
   (y=404 / y=832), and a card fill of #f3efef.

   The accent colours are sampled from those bars, and they are NOT section
   3's tier colours: the mockup uses a distinct, deeper palette here (plum,
   teal, violet, wine). Section 3 keeps its own — matching them up would mean
   overriding one mockup with the other.

   The `Purpose:` labels, the footer taglines and the CORE check discs are all
   #471860 regardless of the card's accent. */

export type Pillar = {
  name: string;
  /* the definition paragraph under the heading */
  definition: string;
  /* the paragraph under the "Purpose:" label */
  purpose: string;
  /* optional check-bulleted examples, between definition and purpose — only
     CORE VENTURES has these in the mockup */
  examples?: string[];
  /* the footer line; the mockup renders CORE's as two halves split by a rule */
  tagline: string;
  taglineSecond?: string;
  /* left accent bar + icon tint, sampled from the PDF */
  accent: string;
  /* icon basename under /images/what-we-do/s5, extracted from the mockup */
  icon: string;
};

export const PILLARS: Pillar[] = [
  {
    name: "CORE VENTURES",
    definition:
      "Ventures established, fully funded, and operated directly by the parent company.",
    purpose:
      "They serve as our foundational industrial infrastructure and active on-the-ground training platforms.",
    examples: [
      "Real estate developments",
      "Agritech testing grounds",
      "Core media properties",
    ],
    tagline: "Direct ownership",
    taglineSecond: "Operational backbone",
    accent: "#471860",
    icon: "icon-core",
  },
  {
    name: "JOINT VENTURES",
    definition:
      "Independent businesses that align with our core philosophy and enter a formal equity or operational partnership with us.",
    purpose:
      "Combining external specialized expertise with People First's infrastructure, network, and resource pool to achieve fast market scaling.",
    tagline: "Partnership-driven growth engine",
    accent: "#3a908f",
    icon: "icon-joint",
  },
  {
    name: "AFFILIATED VENTURES",
    definition:
      "Existing, fully operational organizations that voluntarily place their strategic direction and management protocols under the governance of the People First ecosystem.",
    purpose:
      "Optimizing underperforming assets or traditional businesses by aligning them with sustainable, community-first values and modern technological frameworks.",
    tagline: "Transformation of existing businesses",
    accent: "#b53fff",
    icon: "icon-affiliated",
  },
  {
    name: "GENESIS VENTURES",
    definition:
      "The highest and most powerful expression of our mission. Brand-new companies built completely from scratch inside the ecosystem.",
    purpose:
      "These are brands co-created and founded by individuals who originally entered our ecosystem with nothing but raw passion in the Learn Stage, advanced through the Grow Stage, and emerged as fully capable corporate founders in the Lead Stage.",
    tagline: "Founder creation engine",
    accent: "#9e3659",
    icon: "icon-genesis",
  },
];
