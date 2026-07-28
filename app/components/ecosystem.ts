/* Sectors orbiting the central "People First" hub in the ecosystem section.
   `angle` is the clock position in degrees (0 = top / 12 o'clock, increasing
   clockwise) — nine sectors spaced 40° apart. `icon` names a lucide-react
   icon (looked up in EcosystemShowcase). `label` short-wraps to two lines in
   the design; keep it as written. */
export type Sector = {
  label: string;
  tagline: string;
  icon: string;
  color: string; // node fill (matches the design's brand colours)
  angle: number; // degrees, 0 = top, clockwise
};

export const SECTORS: Sector[] = [
  {
    label: "Agriculture",
    tagline: "Ensuring Foundational Security",
    icon: "Sprout",
    color: "#3f9b2f",
    angle: 0,
  },
  {
    label: "Real Estate",
    tagline: "Providing Structural Stability",
    icon: "Building2",
    color: "#1f7a6b",
    angle: 40,
  },
  {
    label: "Health Care and Wellness",
    tagline: "Better health through innovation.",
    icon: "HeartPulse",
    color: "#9e1f52",
    angle: 80,
  },
  {
    label: "Knowledge Capital",
    tagline: "Building Capacity",
    icon: "GraduationCap",
    color: "#122b7a",
    angle: 120,
  },
  {
    label: "Media & Marketing",
    tagline: "Creative solutions for brands.",
    icon: "Megaphone",
    color: "#5a1f9e",
    angle: 160,
  },
  {
    label: "Technology",
    tagline: "Driving Innovation & Global Scale",
    icon: "Cpu",
    color: "#152f6e",
    angle: 200,
  },
  {
    label: "Commerce & Trade",
    tagline: "Connecting Markets, Creating Value",
    icon: "Handshake",
    color: "#c2661a",
    angle: 240,
  },
  {
    label: "SMEs & Consumer",
    tagline: "Smarter business growth.",
    icon: "Briefcase",
    color: "#158a99",
    angle: 280,
  },
  {
    label: "Renewable Energy",
    tagline: "Connecting Markets, Creating Value",
    icon: "RefreshCw",
    color: "#c62828",
    angle: 320,
  },
];
