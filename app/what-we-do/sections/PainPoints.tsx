import Link from "next/link";
import Image from "next/image";
import { Recede } from "@/app/components/ScrollFx";
import { PAIN_POINTS } from "@/app/what-we-do/pain-points";

/* What We Do → "Pain Points We Address" (SECTION 1).

   Pinned `sticky top-0 h-screen` so the NEXT section can swipe up and over it,
   the same pattern as /home and /ideas-lab.

   The ribbon, its eight pins and their labels are ONE illustration
   (pain-points.webp) exactly as the designer composed them, so nothing here
   re-positions or re-types any part of it.

   Below `lg` that image is too wide to stay legible — the labels would fall
   under ~9px — so the same eight points render as a stacked list instead, in
   ribbon order. PAIN_POINTS carries that text; it is the mobile fallback only,
   and must stay in sync with the artwork. */
export default function PainPoints() {
  return (
    <section className="sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-[linear-gradient(115deg,#e8f6f8_0%,#f6f3fb_42%,#fbf7fd_100%)] md:h-screen">
      {/* soft cyan wash, upper-left — the corner glow from the mockup. Drawn as
          a gradient rather than the source raster: that asset peaks at an alpha
          of 67/255, so it is a tint, not artwork. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(120,215,230,0.38)_0%,rgba(120,215,230,0)_70%)]"
      />
      {/* matching lavender wash, lower-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 -right-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(170,150,240,0.22)_0%,rgba(170,150,240,0)_70%)]"
      />

      {/* The desktop mockup opens directly on the composition. Keep the logo as
          orientation for the mobile fallback, where the side rail becomes a
          closed drawer and no longer identifies the site at first glance. */}
      <header className="relative z-20 shrink-0 px-8 pt-8 sm:px-14 sm:pt-10 lg:hidden">
        <Link
          href="/"
          aria-label="People First — landing"
          className="inline-flex min-h-11 items-center"
        >
          <Image
            src="/images/logo.svg"
            alt="People First"
            width={398}
            height={100}
            priority
            className="h-11 w-auto sm:h-[52px]"
          />
        </Link>
      </header>

      <Recede className="relative z-10 flex min-h-0 flex-1 flex-col">
        {/* On desktop the PDF places the 40px heading 12% down the canvas. `vw`
            lets it scale with narrower desktop mockup proportions while the
            cap preserves the source size at 1920px and above. */}
        <h2 className="animate-fade-in-up shrink-0 px-8 pr-16 pt-6 text-2xl font-extrabold uppercase tracking-tight text-[#2a1a6e] sm:px-14 sm:pr-20 sm:text-3xl lg:px-0 lg:pt-[12vh] lg:text-center lg:text-[clamp(1.875rem,2.083vw,2.5rem)] lg:leading-none">
          <span className="inline-block lg:scale-x-[1.16]">
            Pain Points We Address
          </span>
        </h2>

        {/* ── lg and up: the illustration, whole ──
            The source artwork occupies about 63.5% of the 1920px PDF canvas,
            starts 27.5% down it, and is centred in the area left of the nav
            rail. Keeping those proportions avoids the oversized, edge-to-edge
            rendering while preserving the illustration as one composed unit. */}
        <div className="absolute left-0 top-[27.5vh] hidden w-[calc(100%_-_20rem)] justify-center lg:flex">
          <div className="relative aspect-[2048/1055] w-[63.5vw] max-w-[78rem]">
            <Image
              src="/images/what-we-do/pain-points.webp"
              alt="A winding path marked by eight pins, one for each pain point People First addresses: no one takes responsibility for your failure; people fight their battles alone; lack of coordination among stakeholders; absence of an integrated development approach; limited access to resources; the gap between potential and opportunity; socio-economic challenges remain unaddressed; and the need for a people-centered development model."
              fill
              priority
              sizes="(max-width: 1024px) 0px, (max-width: 1965px) 63.5vw, 78rem"
              className="select-none object-contain"
            />
          </div>
        </div>

        {/* ── below lg: the same eight points, stacked and scrollable ──
            The section is locked to the viewport height (it is the pinned half
            of the swipe-over), so this list owns the overflow rather than
            letting the page grow. */}
        <ul className="mt-6 min-h-0 flex-1 space-y-3 overflow-y-auto px-8 pb-8 pr-12 sm:px-14 sm:pr-20 lg:hidden">
          {PAIN_POINTS.map((p) => (
            <li key={p.title} className="flex items-start gap-3">
              <Image
                src="/images/what-we-do/pins.webp"
                alt=""
                aria-hidden
                width={400}
                height={792}
                className="pointer-events-none mt-0.5 h-8 w-auto shrink-0 select-none"
              />
              <p className="whitespace-pre-line text-sm font-bold leading-tight text-[#1a1a2e]">
                {p.title}
              </p>
            </li>
          ))}
        </ul>
      </Recede>
    </section>
  );
}
