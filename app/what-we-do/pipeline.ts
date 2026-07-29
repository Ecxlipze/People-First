import { STAGES, type Venture } from "@/app/what-we-do/stages";

/* Section 4 data — "Our Evolutionary Pipeline".

   Copy is verbatim from the mockup PDF's `/ActualText` entries.

   The three pipeline cards carry the SAME ventures as section 2's stage
   columns — identical names and blurbs — so the venture lists are imported
   from stages.ts rather than restated here. Only what section 4 adds (the
   stage label, headline, rationale and outcome strip) lives in this file. */

export type PipelineStage = {
  number: string;
  /* the small caps label above the headline, e.g. "PHYSICAL STAGE" */
  label: string;
  headline: string;
  /* the paragraph under the headline */
  rationale: string;
  ventures: Venture[];
  /* THE MIND STAGE shows one feature card instead of a venture list, matching
     the way section 2 renders it */
  feature?: { name: string; blurb: string };
  outcome: {
    title: string;
    /* the small line under the outcome title */
    detail: string;
    /* the outcome strip's background */
    bg: string;
  };
  /* the numbered pill's background */
  pillBg: string;
};

export const PIPELINE: PipelineStage[] = [
  {
    number: "01",
    label: "PHYSICAL STAGE",
    headline: "Securing the Foundation",
    rationale:
      "A workforce cannot focus on growth or innovation if its foundational survival requirements are unmet. We secure the basics so our people can focus on building a better future.",
    ventures: STAGES[0].ventures,
    outcome: {
      title: "Financial Freedom & Stability",
      detail: "Lower expenses. Better living. Stronger communities.",
      bg: "#97c3c4",
    },
    pillBg: "#2f7d70",
  },
  {
    number: "02",
    label: "MIND STAGE",
    headline: "Cultivating Capability",
    rationale:
      "Once the physical and financial baselines are stabilized, individuals gain the mental bandwidth required for advancement.",
    ventures: [],
    feature: STAGES[1].feature,
    outcome: {
      title: "Skilled Minds & Confidence",
      detail: "Education. Skills. Strategy. Self-reliance.",
      bg: "#7097ba",
    },
    pillBg: "#12518f",
  },
  {
    number: "03",
    label: "MARKET STAGE",
    headline: "Scaling to Prosperity",
    rationale:
      "Training the mind without building commercial infrastructure creates a bottleneck of underutilized talent.",
    ventures: STAGES[2].ventures,
    outcome: {
      title: "Enterprise Growth & Prosperity",
      detail: "Opportunities. Trade. Scale. Wealth Creation.",
      bg: "#9383ad",
    },
    pillBg: "#5b2150",
  },
];

/* The two columns of the purple "Building the Ecosystem Together" banner. */
export const ECOSYSTEM_BANNER = {
  title: "Building the Ecosystem Together",
  columns: [
    "To turn this theory into reality, we do not wait for external markets to mature; we launch targeted synchronized ventures across multiple industries simultaneously to build a self-sustaining ecosystem.",
    "We actively forge strategic Joint Ventures (JVs) and collaborations with external companies that share our vision and ambitions, combining strengths to scale at an unprecedented pace.",
  ],
};
