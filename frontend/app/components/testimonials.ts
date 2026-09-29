/* Tweet-style testimonials for the "People are saying about us" section.
   `avatar` points at public/images/… — leave undefined for an initials
   fallback (Avatar draws a coloured monogram instead of a broken image).
   Tags render as blue #hashtag links. Order here is column-major-ish;
   the section lays them into a balanced masonry so heights can vary.

   ⚠️ GENERIC PLACEHOLDER CONTENT — NOT REAL TESTIMONIALS.
   The names, roles and quotes below are neutral stand-ins, written to be
   on-brand without naming real customers or making specific claims. Replace
   them with real testimonials (with permission) through the admin. No avatars
   are set, so each card shows the monogram fallback. */
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
    name: "Ayesha Khan",
    handle: "Trainee, Digital Skills Program",
    body: "The training was practical from day one. I learned skills I could use right away and now take on remote work with confidence.",
    tags: ["digital_skills", "training"],
  },
  {
    name: "Hassan Raza",
    handle: "Small Business Owner",
    body: "People First helped us get online and reach customers directly. Fewer middlemen and better margins made a real difference.",
    tags: ["direct_commerce", "growth"],
  },
  {
    name: "Sana Malik",
    handle: "Freelancer",
    body: "A supportive team and a clear path from learning to earning. I would recommend it to anyone starting out.",
    tags: ["remote_work", "learning"],
  },
  {
    name: "Usman Tariq",
    handle: "Partner Organisation",
    body: "Working with the team was smooth and professional. They understand local needs and deliver on what they promise.",
    tags: ["partnership", "impact"],
  },
  {
    name: "Fatima Zahra",
    handle: "University Graduate",
    body: "The programs bridge the gap between what we study and what industry needs. It gave me direction and real confidence.",
    tags: ["youth", "careers"],
  },
  {
    name: "Bilal Ahmed",
    handle: "Entrepreneur",
    body: "From idea to launch, the guidance was honest and useful. It feels like a team that genuinely wants you to succeed.",
    tags: ["startups", "mentorship"],
  },
  {
    name: "Hira Nadeem",
    handle: "Content Creator",
    body: "The studio and podcast support helped me find my voice and grow an audience I am proud of.",
    tags: ["podcast", "creators"],
  },
  {
    name: "Imran Sheikh",
    handle: "Community Leader",
    body: "Digital tools are finally reaching people who were left behind. This work is opening real doors in our community.",
    tags: ["inclusion", "community"],
  },
];
