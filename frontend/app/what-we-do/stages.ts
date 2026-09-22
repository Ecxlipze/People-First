export type Venture = {
  name: string;
  blurb: string;
};

export type Stage = {
  /* the big numeral in the header pill */
  number: string;
  title: string;
  /* the paragraph under the header */
  intro: string;
  /* header background */
  headerBg: string;
  /* card border + the numeral circle's text colour */
  accent: string;
  ventures: Venture[];
  /* THE MIND STAGE has a single, larger feature card with a graduation-cap
     icon instead of a list — see StageColumn in EcosystemStages.tsx */
  feature?: {
    name: string;
    blurb: string;
  };
};

/* The People First Evolution Model — three stages, left to right.

   Stage colours are read off the mockup: a teal header for Physical, navy for
   Mind, and plum for Market, each with a matching hairline border on its
   venture cards. */
export const STAGES: Stage[] = [
  {
    number: "1",
    title: "THE PHYSICAL STAGE",
    intro:
      "A strong foundation is essential. We meet basic needs, provide security and ensure access to clean energy, liberating income and creating financial freedom.",
    headerBg: "#60aaaa",
    accent: "#60aaaa",
    ventures: [
      {
        name: "Agriculture",
        blurb:
          "Providing pure healthy and affordable food & nutrition for every home.",
      },
      {
        name: "Real Estate",
        blurb:
          "Delivering high quality secure and affordable housing & property solutions",
      },
      {
        name: "HealthCare & Wellness",
        blurb:
          "Advancing healthier lives through quality care and innovative wellness solutions.",
      },
      {
        name: "Renewable Energy",
        blurb:
          "Driving a sustainable future with clean and renewable energy solutions.",
      },
    ],
  },
  {
    number: "2",
    title: "THE MIND STAGE",
    intro:
      "Once the foundation is stable, we unlock mental potential through education, skills & strategic acumen.",
    headerBg: "#014483",
    accent: "#014483",
    ventures: [],
    feature: {
      name: "National Agaaz Readiness Programme (NARP)",
      blurb:
        "A foundational learning initiative to educate, skills and build the strategic acumen of our people, transforming raw potential into market ready talent.",
    },
  },
  {
    number: "3",
    title: "THE MARKET STAGE",
    intro:
      "We bridge talent to opportunity through commerce, trade and enterprise empowerment.",
    headerBg: "#422d77",
    accent: "#422d77",
    ventures: [
      {
        name: "Merchanity",
        blurb:
          "An e-commerce platform connecting skilled talent with businesses to drive trade and growth.",
      },
      {
        name: "TECH SOLUTIONS",
        blurb:
          "Delivering accessible, innovative, and impactful tech solutions to empower every user.",
      },
      {
        name: "Media & Marketing",
        blurb:
          "Empowering brands through creative media and strategic marketing solutions.",
      },
      {
        name: "SMEs & Consumer Manufacturing",
        blurb:
          "Enabling businesses to produce, innovate, and scale consumer products.",
      },
    ],
  },
];
