/* Tweet-style testimonials for the "People are saying about us" section.
   `avatar` points at public/images/… — leave undefined for an initials
   fallback (TestimonialCard draws a coloured monogram instead of a broken
   image). Tags render as blue #hashtag links. Order here is column-major-ish;
   the section lays them into a balanced masonry so heights can vary. */
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
  },
  {
    name: "Leslie Alexander",
    handle: "@lesslie",
    body: "Simply the best. Better than all the rest. I’d recommend this product to beginners and advanced users.",
    tags: ["postcrafts"],
  },
  {
    name: "Jenny Wilson",
    handle: "@jennywilson",
    body: "This is a top quality product. No need to think twice before making it live on web.",
    tags: ["make_it_fast"],
  },
  {
    name: "Kristin Watson",
    handle: "@kristinwatson2",
    body: "Finally, I’ve found a template that covers all bases for a bootstrapped startup. We were able to launch in days, not months.",
    tags: ["postcrafts"],
  },
  {
    name: "Guy Hawkins",
    handle: "@guyhawkins",
    body: "This is a top quality product. No need to think twice before making it live on web.",
    tags: ["make_it_fast"],
  },
  {
    name: "Marvin McKinney",
    handle: "@marvinmck",
    body: "With Postcrafts, it’s quicker with the customer, the customer is more ensured of getting exactly what they ordered, and I’m all for the efficiency.",
    tags: ["dev", "tools"],
  },
  {
    name: "Annette Black",
    handle: "@annetteblack",
    body: "You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the change and click save.",
    tags: ["another"],
  },
  {
    name: "Floyd Miles",
    handle: "@floydmiles",
    body: "My new site is so much faster and easier to work with than my old site. I just choose the page, make the change and click save.",
    tags: ["postcrafts"],
  },
];
