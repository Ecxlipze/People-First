export type NavItem = {
  label: string;
  href: string;
  icon: string; // path under /public
  /* Degrees from vertical for the landing-page arc. Measured off the seven icon
     centres in Landing Page.pdf (1440×1024) by extracting their vector circles:
     IDEAS LAB (500.0,429.5), WHAT WE DO (534.5,345.0), ABOUT US (608.5,282.5),
     HOME (720.5,241.5) and the mirror of the first three. Fitting those against
     the HOME axis (x=720.5) gives origin y=470.8 and r=224.4 — note ±79.4°, NOT
     ±90°: at 90° the outermost pair would sit exactly level with the arc's
     origin, which is what made the rendered arc read as a flat half-circle
     instead of the design's tucked-in fan. Re-projecting these angles onto the
     single fitted radius lands every icon within 5.3px of its design position
     (0.37% of frame width). */
  angle: number;
  side: "left" | "center" | "right";
  /* Label placement, as an offset in design px from the icon's centre.
     The labels are NOT on a concentric ring: fitting one gives anchor radii
     scattered across 277–305px, and no single radial outset reproduces the
     design (IDEAS LAB/INSIGHTS would need a *negative* one, and a uniform 72px
     outset misses the outer rows by 17px). They are hand-placed on four fixed
     baselines — y=169.5 / 232.5 / 320.5 / 433.5 — so `dy` is stored per item
     and is exactly symmetric across the arc: -72, -50, -24.5, +4.
     `dx` is the gap from the icon centre to the label's INNER edge (its right
     edge for left-side items, its left edge for right-side ones), which is what
     keeps the text clear of the icon glyph. */
  labelDx: number;
  labelDy: number;
};

// Array order = top-to-bottom order of the homepage's right-hand navbar.
// `angle`/`side` drive the landing-page radial arc (order-independent there).
export const navItems: NavItem[] = [
  {
    label: "IDEAS LAB",
    href: "/ideas-lab",
    icon: "/images/ideas_lab.svg",
    angle: -79.4,
    side: "left",
    labelDx: -74.5,
    labelDy: 4,
  },
  {
    label: "WHAT WE DO",
    href: "/what-we-do",
    icon: "/images/whatwedo.svg",
    angle: -55.9,
    side: "left",
    labelDx: -66.7,
    labelDy: -24.5,
  },
  {
    label: "HOME",
    href: "/home",
    icon: "/images/home.svg",
    angle: 0,
    side: "center",
    labelDx: 0,
    labelDy: -72,
  },
  {
    label: "ABOUT US",
    href: "/about",
    icon: "/images/aboutus.svg",
    angle: -30.7,
    side: "left",
    labelDx: -20.6,
    labelDy: -50,
  },
  {
    label: "PODCASTS",
    href: "/podcasts",
    icon: "/images/podcasts.svg",
    angle: 30.7,
    side: "right",
    labelDx: 40.8,
    labelDy: -50,
  },
  {
    label: "GROW WITH US",
    href: "/grow-with-us",
    icon: "/images/growwithus.svg",
    angle: 56.0,
    side: "right",
    labelDx: 69.7,
    labelDy: -24.5,
  },
  {
    label: "INSIGHTS BY PEOPLE FIRST",
    href: "/insights",
    icon: "/images/insights.svg",
    angle: 79.6,
    side: "right",
    labelDx: 49.5,
    labelDy: 4,
  },
];
