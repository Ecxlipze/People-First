import type { Metadata } from "next";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import PainPoints from "@/app/what-we-do/sections/PainPoints";
import EcosystemStages from "@/app/what-we-do/sections/EcosystemStages";
import VenturesImpact from "@/app/what-we-do/sections/VenturesImpact";
import EvolutionPipeline from "@/app/what-we-do/sections/EvolutionPipeline";
import BrandArchitecture from "@/app/what-we-do/sections/BrandArchitecture";

export const metadata: Metadata = {
  title: "What We Do — People First",
  description:
    "The pain points we address, the People First Evolution Model across the Physical, Mind and Market stages, our four venture tiers, and the impact focus areas we build toward.",
};

/* What We Do — a multi-section swipe-over page, same pattern as /home and
   /ideas-lab: SECTION 1 pins itself (`sticky top-0 h-screen`) and SECTION 2
   rises up and over it, carrying the covering-block styling (opaque bg,
   rounded top, upward shadow, higher z-index, negative top margin). */
export default function WhatWeDoPage() {
  return (
    <>
      {/* right vertical icon navbar — fixed z-[100], must be outside overflow-x-clip */}
      <SideNav />

      <div className="relative overflow-x-clip bg-[linear-gradient(115deg,#e8f6f8_0%,#f6f3fb_42%,#fbf7fd_100%)]">
        {/* ── SECTION 1: PAIN POINTS ── pinned; SECTION 2 swipes up over it */}
        <PainPoints />

        {/* ── SECTION 2: THE PEOPLE FIRST ECOSYSTEM ──
            Opaque rounded block with a negative top margin → swipes over the
            pinned section above. */}
        <EcosystemStages />

        {/* ── SECTION 3: VENTURE TIERS, RESULTS & IMPACT ──
            Swipes up over section 2 the same way section 2 covers section 1.
            Section 2 is not pinned for this: it is well over a viewport tall, so
            a pin would either clip it or (via PinnedRecede's own guard) disable
            itself and just add dead space. The overlap alone carries the
            transition. */}
        <VenturesImpact />

        {/* ── SECTION 4: THE THREE DIMENSIONS / EVOLUTIONARY PIPELINE ──
            Swipes over section 3, same overlap. */}
        <EvolutionPipeline />

        {/* ── SECTION 5: BRAND ARCHITECTURE ──
            Swipes over section 4, same overlap. */}
        <BrandArchitecture />

        {/* Footer sits in normal flow below the last section, as on every other
            page. */}
        <SiteFooter />
      </div>
    </>
  );
}
