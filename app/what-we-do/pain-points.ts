export type PainPoint = {
  /* the label, line-broken as the artwork breaks it */
  title: string;
};

/* The eight pain points, in ribbon order — the far bottom-left of the coil (the
   start of the journey) through to the top-right.

   On `lg` and up these are NOT rendered: the ribbon illustration
   (pain-points.webp) already contains them as part of the artwork. This list is
   the below-`lg` fallback, where that image would be too small to read. Keep
   the wording in step with the illustration. */
export const PAIN_POINTS: PainPoint[] = [
  { title: "No One Takes\nResponsibility\nfor Your Failure" },
  { title: "People Fight\nTheir Battles\nAlone" },
  { title: "Lack of\nCoordination\nAmong Stakeholders" },
  { title: "Absence of an\nIntegrated Development\nApproach" },
  { title: "Limited Access\nto Resources" },
  { title: "Gap Between\nPotential and\nOpportunity" },
  { title: "Socio-Economic\nChallenges Remain\nUnaddressed" },
  { title: "Need for a\nPeople-Centered\nDevelopment Model" },
];
