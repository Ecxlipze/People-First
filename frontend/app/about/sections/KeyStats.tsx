import Image from "next/image";
import { Reveal } from "@/app/components/ScrollFx";

/* About → Strategic partners, displayed as a continuously moving logo rail. */

const PARTNERS: { name: string; logo: string; size?: [number, number] }[] = [
  {
    name: "National University of Computer & Emerging Sciences",
    logo: "/images/about-page/nu-logo.png",
  },
  {
    name: "FinTech News Pakistan",
    logo: "/images/about-page/Fintech-Logo.png",
  },
  { name: "SkillX", logo: "/images/about-page/skiilx-logo.png" },
  { name: "KOT Enterprises", logo: "/images/about-page/kot-logo.png" },
  {
    name: "Deep Skills",
    logo: "/images/about-page/deepskills-black-v3.png",
    // Wide wordmark: its own aspect ratio lets it fill the same logo height
    // as the others instead of shrinking to the default 337×97 box.
    size: [340, 76],
  },
  {
    name: "Scope Career Consultancy",
    logo: "/images/about-page/scope-logo.png",
    size: [380, 199],
  },
];

export default function KeyStats() {
  return (
    <section className="bg-[#67235c] px-6 py-24 sm:px-10 sm:py-28 lg:px-24 xl:px-28">
      <div className="mx-auto max-w-[1440px]">
        {/* ── strategic partners ── */}
        <Reveal>
          <h2 className="font-display text-center text-3xl font-bold uppercase tracking-tight text-[#f6d9ff] sm:text-[2.65rem]">
            OUR STRATEGIC PARTNERS
          </h2>
          <div className="about-partner-marquee mt-12 flex flex-col gap-4 sm:gap-6">
            <div className="about-partner-track">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  role={copy === 0 ? "list" : undefined}
                  aria-label={
                    copy === 0 ? "People First strategic partners" : undefined
                  }
                  aria-hidden={copy === 1}
                  className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6"
                >
                  {PARTNERS.map((partner) => (
                    <div
                      key={`${copy}-${partner.name}`}
                      role={copy === 0 ? "listitem" : undefined}
                      className="group flex h-24 w-[220px] shrink-0 items-center justify-center bg-white px-6 shadow-sm sm:h-28 sm:w-[280px] lg:w-[320px]"
                    >
                      <Image
                        src={partner.logo}
                        alt={copy === 0 ? partner.name : ""}
                        width={partner.size?.[0] ?? 337}
                        height={partner.size?.[1] ?? 97}
                        className="max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div
              className="about-partner-track"
              style={{ animationDirection: "reverse" }}
            >
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  aria-hidden="true"
                  className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6"
                >
                  {[...PARTNERS.slice(2), ...PARTNERS.slice(0, 2)].map(
                    (partner, i) => (
                      <div
                        key={`rev-${copy}-${i}`}
                        className="group flex h-24 w-[220px] shrink-0 items-center justify-center bg-white px-6 shadow-sm sm:h-28 sm:w-[280px] lg:w-[320px]"
                      >
                        <Image
                          src={partner.logo}
                          alt=""
                          width={partner.size?.[0] ?? 337}
                          height={partner.size?.[1] ?? 97}
                          className="max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16"
                        />
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
