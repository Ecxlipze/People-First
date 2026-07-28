export type NavItem = {
  label: string;
  href: string;
  icon: string; // path under /public
  angle: number; // degrees from vertical, for the landing-page arc
  side: "left" | "center" | "right";
};

// Array order = top-to-bottom order of the homepage's right-hand navbar.
// `angle`/`side` drive the landing-page radial arc (order-independent there).
export const navItems: NavItem[] = [
  {
    label: "IDEAS LAB",
    href: "/ideas-lab",
    icon: "/images/ideas_lab.svg",
    angle: -90,
    side: "left",
  },
  {
    label: "WHAT WE DO",
    href: "/what-we-do",
    icon: "/images/whatwedo.svg",
    angle: -60,
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
    angle: -30,
    side: "left",
  },
  {
    label: "PODCASTS",
    href: "/podcasts",
    icon: "/images/podcasts.svg",
    angle: 30,
    side: "right",
  },
  {
    label: "GROW WITH US",
    href: "/grow-with-us",
    icon: "/images/growwithus.svg",
    angle: 60,
    side: "right",
  },
  {
    label: "INSIGHTS BY PEOPLE FIRST",
    href: "/insights",
    icon: "/images/insights.svg",
    angle: 90,
    side: "right",
  },
];
