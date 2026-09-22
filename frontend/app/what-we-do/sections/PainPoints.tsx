import Link from "next/link";
import Image from "next/image";
import { Recede } from "@/app/components/ScrollFx";
import { PAIN_POINTS } from "@/app/what-we-do/pain-points";

/* What We Do → "Pain Points We Address" (SECTION 1).

   Pinned at xl so the NEXT section can swipe up and over it, the same pattern
   as /home and /ideas-lab. Phones and tablets use normal flow because the
   readable text fallback is taller than a viewport.

   The ribbon, its eight pins and their labels are ONE illustration
   (pain-points.webp) exactly as the designer composed them, so nothing here
   re-positions or re-types any part of it.

   Below `xl` that image is too wide to stay legible — the labels would fall
   under ~9px — so the same eight points render as a stacked list instead, in
   ribbon order. PAIN_POINTS carries that text; it is the mobile fallback only,
   and must stay in sync with the artwork. */
export default function PainPoints() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[linear-gradient(115deg,#e8f6f8_0%,#f6f3fb_42%,#fbf7fd_100%)] xl:sticky xl:top-0 xl:h-screen xl:min-h-0">
      {/* soft cyan wash, upper-left — the corner glow from the mockup. Drawn as
          a gradient rather than the source raster: that asset peaks at an alpha
          of 67/255, so it is a tint, not artwork. */}
      {/* The two washes breathe slowly (glow-pulse) so the pinned first
          viewport isn't completely still while the user reads it. They are
          decorative and behind everything, so the movement can't disturb the
          composition — and it stops on prefers-reduced-motion. */}
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(120,215,230,0.38)_0%,rgba(120,215,230,0)_70%)]"
      />
      {/* matching lavender wash, lower-right */}
      <div
        aria-hidden
        /* Offset delay so the two washes don't pulse in lockstep. */
        style={{ animationDelay: "-2.5s" }}
        className="animate-glow-pulse pointer-events-none absolute -bottom-56 -right-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(170,150,240,0.22)_0%,rgba(170,150,240,0)_70%)]"
      />

      {/* The desktop mockup opens directly on the composition. Keep the logo as
          orientation for the mobile fallback, where the side rail becomes a
          closed drawer and no longer identifies the site at first glance. */}
      <header className="relative xl:absolute xl:left-0 xl:right-0 xl:top-0 z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 lg:pt-12 xl:px-28 xl:pt-14 [@media(max-height:500px)]:pt-4">
        <Link
          href="/"
          aria-label="People First — landing"
          className="group inline-flex min-h-11 items-center"
        >
          <Image
            src="/images/logo.svg"
            alt="People First"
            width={398}
            height={100}
            priority
            className="h-10 w-auto sm:h-12 lg:h-[52px] [@media(max-height:500px)]:h-9"
          />
        </Link>
      </header>

      <Recede className="relative z-10 flex min-h-0 flex-1 flex-col">
        {/* On desktop the PDF places the 40px heading 12% down the canvas. `vw`
            lets it scale with narrower desktop mockup proportions while the
            cap preserves the source size at 1920px and above. */}
        <h1 className="animate-fade-in-up shrink-0 px-8 pr-16 pt-6 text-2xl font-display font-extrabold uppercase tracking-tight text-[#2a1a6e] sm:px-14 sm:pr-20 sm:text-3xl xl:px-0 xl:pt-[12vh] xl:text-center xl:text-[clamp(1.875rem,2.083vw,2.5rem)] xl:leading-none">
          <span className="inline-block xl:scale-x-[1.16]">
            Pain Points We Address
          </span>
        </h1>

        {/* ── lg and up: the illustration, whole ──
            The source artwork occupies about 63.5% of the 1920px PDF canvas,
            starts 27.5% down it, and is centred in the area left of the nav
            rail. Keeping those proportions avoids the oversized, edge-to-edge
            rendering while preserving the illustration as one composed unit. */}
        <div className="absolute left-0 top-[27.5vh] hidden w-[calc(100%_-_20rem)] justify-center xl:flex">
          <div className="relative aspect-[2048/1055] w-[63.5vw] max-w-[78rem]">
            <Image
              src="/images/what-we-do/pain-points.webp"
              alt="A winding path marked by eight pins, one for each pain point People First addresses: no one takes responsibility for your failure; people fight their battles alone; lack of coordination among stakeholders; absence of an integrated development approach; limited access to resources; the gap between potential and opportunity; socio-economic challenges remain unaddressed; and the need for a people-centered development model."
              fill
              priority
              sizes="(max-width: 1279px) 0px, (max-width: 1965px) 63.5vw, 78rem"
              className="select-none object-contain"
            />
          </div>
        </div>

        {/* ── below xl: the same eight points in normal document flow ── */}
        {/* The list cascades in rather than appearing all at once. `pf-stagger`
            (CSS, mount-driven) is used instead of the scroll-scrubbed <Stagger>
            because this list is its own scroll container — the items' viewport
            position doesn't change as it scrolls, so a scroll-scrubbed reveal
            would never advance for anything below the fold. */}
        <ul className="pf-stagger mt-6 flex-1 space-y-3 px-8 pb-12 pr-12 sm:px-14 sm:pb-16 sm:pr-20 xl:hidden">
          {PAIN_POINTS.map((p, i) => (
            <li
              key={p.title}
              /* .pf-stagger's nth-child fallback only covers six children; these
                 are eight, so the index is set explicitly. */
              style={{ "--i": i } as React.CSSProperties}
              className="flex items-start gap-3"
            >
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
