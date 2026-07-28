import Link from "next/link";
import Image from "next/image";
import { Recede } from "@/app/components/ScrollFx";
import ContactTrigger from "@/app/contact/ContactTrigger";

/* Ideas Lab → Hero (SECTION 1).

   Pinned `sticky top-0 h-screen` exactly like the /home hero so the NEXT
   section can swipe up and over it — see the swipe-over pattern used across
   the site. Content is wrapped in <Recede> so it stays bright through most of
   the overlap and only recedes at the very end.

   Layout: logo top-left, three wavy journey lines crossing the full width,
   floating crystals and paper planes scattered along them, then the headline
   with the magnet illustration to its left, and the two CTAs bottom-right. */
export default function Hero() {
  return (
    <section className="sticky top-0 h-[100svh] overflow-hidden bg-[linear-gradient(120deg,#ffffff_0%,#fdfdff_55%,#f7f4fd_100%)] md:h-screen">
      {/* soft lavender glow, mid-left — matches the wash in the mockup */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 top-1/4 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(150,140,240,0.18)_0%,rgba(150,140,240,0)_70%)]"
      />

      {/* ── wavy journey lines ──
          Three near-parallel curves sweeping across the upper half. Drawn as
          SVG (they are vector paths in the design, not a raster asset). */}
      <svg
        aria-hidden
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-[14%] h-[46%] w-full select-none text-zinc-300"
      >
        <path
          d="M-40 232 C 260 120, 470 300, 720 258 C 980 214, 1180 96, 1500 150"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <path
          d="M-40 288 C 250 190, 480 348, 730 300 C 995 250, 1200 150, 1500 196"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <path
          d="M-40 178 C 280 70, 450 250, 710 214 C 960 178, 1170 46, 1500 104"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.4"
        />
      </svg>

      {/* ── floating crystals + paper planes along the lines ── */}
      <Image
        src="/images/ideas-lab/crystal-red.webp"
        alt=""
        aria-hidden
        width={259}
        height={300}
        className="animate-floaty pointer-events-none absolute left-[9%] top-[26%] hidden h-7 w-auto select-none sm:block"
      />
      <Image
        src="/images/ideas-lab/plane-blue.webp"
        alt=""
        aria-hidden
        width={253}
        height={500}
        priority
        className="animate-floaty pointer-events-none absolute left-[24%] top-[26%] hidden h-[5.5rem] w-auto select-none sm:block lg:h-28"
      />
      <Image
        src="/images/ideas-lab/crystal-purple.webp"
        alt=""
        aria-hidden
        width={259}
        height={300}
        className="animate-floaty pointer-events-none absolute left-[44%] top-[39%] hidden h-6 w-auto select-none sm:block"
      />
      <Image
        src="/images/ideas-lab/plane-teal.webp"
        alt=""
        aria-hidden
        width={253}
        height={500}
        priority
        className="animate-floaty pointer-events-none absolute left-[60%] top-[17%] hidden h-24 w-auto select-none sm:block lg:h-32"
      />

      {/* logo, top-left (links back to landing) */}
      <header className="relative z-20 px-8 pt-8 sm:px-14 sm:pt-10 [@media(max-height:500px)]:pt-4">
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
            className="h-11 w-auto sm:h-[52px] [@media(max-height:500px)]:h-9"
          />
        </Link>
      </header>

      {/* ── headline block: magnet illustration + copy ──
          Sits in the lower-left of the viewport, as in the mockup. */}
      <Recede className="absolute inset-x-0 bottom-32 z-10 sm:bottom-32 lg:bottom-36">
        <div className="flex items-center gap-5 px-6 sm:gap-8 sm:px-14 lg:pr-32">
          <Image
            src="/images/ideas-lab/magnet.webp"
            alt=""
            aria-hidden
            width={567}
            height={620}
            priority
            className="animate-floaty hidden h-24 w-auto shrink-0 select-none sm:block lg:h-32"
          />

          {/* pr below sm keeps the copy clear of the SideNav pull tab, which is
              fixed at the right edge until the rail goes static at lg */}
          <div className="animate-fade-in-up max-w-2xl pr-8 sm:pr-0">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#4a1450] min-[390px]:text-3xl sm:text-4xl lg:text-[2.5rem] [@media(max-height:500px)]:text-2xl">
              Insights to Help You Grow in EcoSystem
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6b3f76] sm:mt-4 sm:text-base [@media(max-height:500px)]:mt-2 [@media(max-height:500px)]:text-xs">
              Practical articles, guides, and perspectives on human
              transformation, economic gateways, startup growth, and skills
              development — written for business owners, entrepreneurs, and
              professionals.
            </p>
          </div>
        </div>
      </Recede>

      {/* ── bottom-right CTAs + say-hello glyph ── */}
      <Recede className="absolute bottom-[max(2.5rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] z-20 flex flex-col items-end gap-3 sm:left-auto sm:right-[max(2rem,env(safe-area-inset-right))] sm:flex-row sm:items-center sm:gap-4">
        <div className="flex w-full gap-3 sm:w-auto">
          <ContactTrigger
            href="/partner"
            role="Training Partner"
            className="inline-flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-md bg-[#a02f52] px-3 py-2.5 text-center text-xs font-medium text-white transition-colors hover:bg-[#8c2946] min-[390px]:px-4 min-[390px]:text-sm sm:flex-none sm:px-5 sm:py-3"
          >
            Partner with Us
          </ContactTrigger>
          <ContactTrigger
            href="/training"
            role="Student"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-zinc-200 px-3 py-2.5 text-center text-xs font-medium leading-tight text-zinc-700 transition-colors hover:bg-zinc-300 min-[390px]:px-4 min-[390px]:text-sm sm:flex-none sm:px-5 sm:py-3"
          >
            Join Training Program
          </ContactTrigger>
        </div>
        <ContactTrigger
          href="/contact"
          aria-label="Say hello"
          className="hidden transition-transform duration-300 hover:-translate-y-1 hover:scale-110 sm:inline-flex"
        >
          <Image
            src="/images/icons/messages.png"
            alt=""
            width={40}
            height={40}
            className="h-8 w-8 select-none"
          />
        </ContactTrigger>
      </Recede>
    </section>
  );
}
