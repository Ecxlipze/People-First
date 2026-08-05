/* Tweet-style testimonials for the "People are saying about us" section.
   `avatar` points at public/images/… — leave undefined for an initials
   fallback (Avatar draws a coloured monogram instead of a broken image).
   Tags render as blue #hashtag links. Order here is column-major-ish;
   the section lays them into a balanced masonry so heights can vary.

   ⚠️ PLACEHOLDER CONTENT — NOT REAL TESTIMONIALS.
   Every name, handle, quote and avatar below comes from the HOME5.pdf mockup,
   which uses the standard Figma placeholder set (note the copy references
   "Postcrafts", an unrelated product, and several entries share @jennywilson).
   The avatars are stock portraits cropped out of that mockup.

   These were installed deliberately to match the approved design, but they read
   to a visitor as genuine customer endorsements. Replace all eight with real
   testimonials — and photos you have permission to use — before launch. */
export type Testimonial = {
  name: string;
  handle: string;
  body: string;
  tags: string[];
  avatar?: string;
  hasAvatar?: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Darrell Steward",
    handle: "@darrels",
    body: "You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the change and click save.",
    tags: ["another"],
    avatar: "/images/home/testimonials/darrell-steward.webp",
    hasAvatar: true,
  },
  {
    name: "Leslie Alexander",
    handle: "@lesslie",
    body: "Simply the best. Better than all the rest. I’d recommend this product to beginners and advanced users.",
    tags: ["postcrafts"],
    avatar: "/images/home/testimonials/leslie-alexander.webp",
    hasAvatar: true,
  },
  {
    name: "Jenny Wilson",
    handle: "@jennywilson",
    body: "This is a top quality product. No need to think twice before making it live on web.",
    tags: ["make_it_fast"],
    avatar: "/images/home/testimonials/jenny-wilson.webp",
    hasAvatar: true,
  },
  {
    name: "Kristin Watson",
    handle: "@kristinwatson2",
    body: "Finally, I’ve found a template that covers all bases for a bootstrapped startup. We were able to launch in days, not months.",
    tags: ["postcrafts"],
    avatar: "/images/home/testimonials/kristin-watson.webp",
    hasAvatar: true,
  },
  {
    name: "Guy Hawkins",
    handle: "@guyhawkins",
    body: "This is a top quality product. No need to think twice before making it live on web.",
    tags: ["make_it_fast"],
    avatar: "/images/home/testimonials/guy-hawkins.webp",
    hasAvatar: true,
  },
  {
    name: "Marvin McKinney",
    handle: "@marvinmck",
    body: "With Postcrafts, it’s quicker with the customer, the customer is more ensured of getting exactly what they ordered, and I’m all for the efficiency.",
    tags: ["dev", "tools"],
    avatar: "/images/home/testimonials/marvin-mckinney.webp",
    hasAvatar: true,
  },
  {
    name: "Annette Black",
    handle: "@annetteblack",
    body: "You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the change and click save.",
    tags: ["another"],
    avatar: "/images/home/testimonials/annette-black.webp",
    hasAvatar: true,
  },
  {
    name: "Floyd Miles",
    handle: "@floydmiles",
    body: "My new site is so much faster and easier to work with than my old site. I just choose the page, make the change and click save.",
    tags: ["postcrafts"],
    avatar: "/images/home/testimonials/floyd-miles.webp",
    hasAvatar: true,
  },
];
