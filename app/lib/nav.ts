export type NavItem = {
  label: string;
  href: string;
  icon: string; // path under /public
  /* Degrees from vertical for the landing-page arc, taken from the Landing Page
     mockup (1440×1024). Fitting a circle to the seven icon centres in that file
     gives an origin at x=720 / y=466 and a radius of 222px to within 10px, at
     these angles — note ±80.5°, NOT ±90°: at 90° the outermost pair would sit
     exactly level with the arc's origin, which is what made the rendered arc
     read as a flat half-circle instead of the design's tucked-in fan. */
  angle: number;
  side: "left" | "center" | "right";
};

// Array order = top-to-bottom order of the homepage's right-hand navbar.
// `angle`/`side` drive the landing-page radial arc (order-independent there).
export const navItems: NavItem[] = [
  {
    label: "IDEAS LAB",
    href: "/ideas-lab",
    icon: "/images/ideas_lab.svg",
    angle: -80.5,
    side: "left",
  },
  {
    label: "WHAT WE DO",
    href: "/what-we-do",
    icon: "/images/whatwedo.svg",
    angle: -56.8,
    side: "left",
  },
  {
    label: "HOME",
    href: "/home",
    icon: "/images/home.svg",
    angle: 0,
    side: "center",
  },
  {
    label: "ABOUT US",
    href: "/about",
    icon: "/images/aboutus.svg",
    angle: -31.5,
    side: "left",
  },
  {
    label: "PODCASTS",
    href: "/podcasts",
    icon: "/images/podcasts.svg",
    angle: 31.5,
    side: "right",
  },
  {
    label: "GROW WITH US",
    href: "/grow-with-us",
    icon: "/images/growwithus.svg",
    angle: 56.8,
    side: "right",
  },
  {
    label: "INSIGHTS BY PEOPLE FIRST",
    href: "/insights",
    icon: "/images/insights.svg",
    angle: 80.5,
    side: "right",
  },
];
