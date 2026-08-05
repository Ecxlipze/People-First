/* Sectors orbiting the central "People First" hub in the ecosystem section.
   `angle` is the clock position in degrees (0 = top / 12 o'clock, increasing
   clockwise) — nine sectors spaced 40° apart. `iconSrc` points to the matching
   white line icon extracted from the supplied Hook line page PDF. `label`
   short-wraps to two lines in the design; keep it as written. */
export type Sector = {
  label: string;
  tagline: string;
  iconSrc: string;
  color: string; // label text colour + gradient end-stop
  /* Node fill. Every node in HOME6.pdf is a diagonal gradient, light at the
     top-left and dark at the bottom-right — sampled at r=24 either side of each
     82px circle's centre. A flat `color` fill read noticeably duller. */
  from: string;
  to: string;
  angle: number; // degrees, 0 = top, clockwise
  /* Distance from the hub as a fraction of the ring radius. The design's ring is
     NOT a true circle: measuring the nine 82px circles against the 130px hub
     centre gives radii from 138 to 187 (mean 169) at angles averaging 40° apart
     (32.5–44.3°). The angles are regular enough to keep at an even 40°, but the
     radii are visibly hand-nudged, so each node carries its own. */
  r: number;
};

export const SECTORS: Sector[] = [
  {
    label: "AGRICULTURE",
    tagline: "Ensuring Foundational Security",
    iconSrc: "/images/home/ecosystem/agriculture.webp",
    color: "#1f7a0a",
    from: "#22a800",
    to: "#125a00",
    angle: 0,
    r: 1.065,
  },
  {
    label: "REAL ESTATE",
    tagline: "Providing Structural Stability",
    iconSrc: "/images/home/ecosystem/real-estate.webp",
    color: "#00775c",
    from: "#009d78",
    to: "#005440",
    angle: 40,
    r: 0.962,
  },
  {
    label: "Health Care and Wellness",
    tagline: "Better health through innovation.",
    iconSrc: "/images/home/ecosystem/healthcare-wellness.webp",
    color: "#9d004b",
    from: "#9d004b",
    to: "#540023",
    angle: 80,
    r: 0.941,
  },
  {
    label: "KNOWLEDGE CAPITAL",
    tagline: "Building Capacity",
    iconSrc: "/images/home/ecosystem/knowledge-capital.webp",
    color: "#002d80",
    from: "#00379c",
    to: "#001f5a",
    angle: 120,
    r: 1.090,
  },
  {
    label: "Media & Marketing",
    tagline: "Creative solutions for brands.",
    iconSrc: "/images/home/ecosystem/media-marketing.webp",
    color: "#52008f",
    from: "#58009d",
    to: "#2d0054",
    angle: 160,
    r: 1.095,
  },
  {
    label: "TECHNOLOGY",
    tagline: "Driving Innovation & Global Scale",
    iconSrc: "/images/home/ecosystem/technology.webp",
    color: "#00466f",
    from: "#005183",
    to: "#002034",
    angle: 200,
    r: 1.104,
  },
  {
    label: "COMMERCE & TRADE",
    tagline: "Connecting Markets, Creating Value",
    iconSrc: "/images/home/ecosystem/commerce-trade.webp",
    color: "#b35400",
    from: "#c95e00",
    to: "#8d4200",
    angle: 240,
    r: 0.938,
  },
  {
    label: "SMEs & Consumer",
    tagline: "Smarter business growth.",
    iconSrc: "/images/home/ecosystem/smes-consumer.webp",
    color: "#00838f",
    from: "#00949d",
    to: "#003e54",
    angle: 280,
    r: 0.817,
  },
  {
    label: "RENEWABLE ENERGY",
    tagline: "Connecting Markets, Creating Value",
    iconSrc: "/images/home/ecosystem/renewable-energy.webp",
    color: "#c01105",
    from: "#c51206",
    to: "#ab0c05",
    angle: 320,
    r: 0.988,
  },
];
