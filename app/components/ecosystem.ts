/* Sectors orbiting the central "People First" hub in the ecosystem section.
   `angle` is the clock position in degrees (0 = top / 12 o'clock, increasing
   clockwise) — nine sectors spaced 40° apart. `iconSrc` points to the matching
   white line icon extracted from the supplied Hook line page PDF. `label`
   short-wraps to two lines in the design; keep it as written. */
export type Sector = {
  label: string;
  tagline: string;
  iconSrc: string;
  color: string; // node fill (matches the design's brand colours)
  angle: number; // degrees, 0 = top, clockwise
};

export const SECTORS: Sector[] = [
  {
    label: "Agriculture",
    tagline: "Ensuring Foundational Security",
    iconSrc: "/images/home/ecosystem/agriculture.webp",
    color: "#3f9b2f",
    angle: 0,
  },
  {
    label: "Real Estate",
    tagline: "Providing Structural Stability",
    iconSrc: "/images/home/ecosystem/real-estate.webp",
    color: "#1f7a6b",
    angle: 40,
  },
  {
    label: "Health Care and Wellness",
    tagline: "Better health through innovation.",
    iconSrc: "/images/home/ecosystem/healthcare-wellness.webp",
    color: "#9e1f52",
    angle: 80,
  },
  {
    label: "Knowledge Capital",
    tagline: "Building Capacity",
    iconSrc: "/images/home/ecosystem/knowledge-capital.webp",
    color: "#122b7a",
    angle: 120,
  },
  {
    label: "Media & Marketing",
    tagline: "Creative solutions for brands.",
    iconSrc: "/images/home/ecosystem/media-marketing.webp",
    color: "#5a1f9e",
    angle: 160,
  },
  {
    label: "Technology",
    tagline: "Driving Innovation & Global Scale",
    iconSrc: "/images/home/ecosystem/technology.webp",
    color: "#152f6e",
    angle: 200,
  },
  {
    label: "Commerce & Trade",
    tagline: "Connecting Markets, Creating Value",
    iconSrc: "/images/home/ecosystem/commerce-trade.webp",
    color: "#c2661a",
    angle: 240,
  },
  {
    label: "SMEs & Consumer",
    tagline: "Smarter business growth.",
    iconSrc: "/images/home/ecosystem/smes-consumer.webp",
    color: "#158a99",
    angle: 280,
  },
  {
    label: "Renewable Energy",
    tagline: "Connecting Markets, Creating Value",
    iconSrc: "/images/home/ecosystem/renewable-energy.webp",
    color: "#c62828",
    angle: 320,
  },
];
