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

      {/* logo, top-left */}
      <header className="relative z-20 shrink-0 px-8 pt-8 sm:px-14 sm:pt-10">
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
        {/* pr keeps the heading clear of the SideNav pull tab, which is fixed to
            the right edge until the rail goes static at lg */}
        <h2 className="animate-fade-in-up shrink-0 px-8 pr-16 pt-6 text-2xl font-extrabold uppercase tracking-tight text-[#2a1a6e] sm:px-14 sm:pr-20 sm:text-3xl lg:pr-14 lg:text-center lg:text-[2rem]">
          Pain Points We Address
        </h2>

        {/* ── lg and up: the illustration, whole ──
            The right padding clears the icon rail, which is static from lg and
            occupies roughly the last 280px; the illustration's own rightmost
            label ("Need for a People-Centered…") sits flush to its edge, so
            there is no slack inside the asset to borrow. */}
        <div className="relative mt-2 hidden min-h-0 flex-1 items-center justify-center px-10 pb-6 lg:flex lg:pr-[19rem]">
          <div className="relative h-full w-full">
            <Image
              src="/images/what-we-do/pain-points.webp"
              alt="A winding path marked by eight pins, one for each pain point People First addresses: no one takes responsibility for your failure; people fight their battles alone; lack of coordination among stakeholders; absence of an integrated development approach; limited access to resources; the gap between potential and opportunity; socio-economic challenges remain unaddressed; and the need for a people-centered development model."
              fill
              priority
              sizes="(max-width: 1024px) 0px, 70rem"
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
