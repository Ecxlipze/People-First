import Link from "next/link";
import Image from "next/image";
import SideNav from "@/app/components/SideNav";
import FeaturedWork from "@/app/components/FeaturedWork";
import VenturesShowcase from "@/app/components/VenturesShowcase";
import GalleryShowcase from "@/app/components/GalleryShowcase";
import TestimonialsShowcase from "@/app/components/TestimonialsShowcase";
import EcosystemShowcase from "@/app/components/EcosystemShowcase";
import StoryShowcase from "@/app/components/StoryShowcase";
import { Recede } from "@/app/components/ScrollFx";
import ContactTrigger from "@/app/contact/ContactTrigger";

export default function HomePage() {
  return (
    <>
      {/* right vertical navbar — fixed z-[100], persists visibly across every section */}
      <SideNav />

      <div className="relative overflow-x-clip bg-[linear-gradient(135deg,#e6ebfb_0%,#f1eefb_38%,#f6f3fc_70%,#f7f5fd_100%)]">
        {/* ── SECTION 1: HERO ──
          Pinned to the top so the next section slides up and overlaps it.
          The tall track gives the sticky hero room to pin while FeaturedWork
          swipes up over it by one viewport at every responsive size. */}
        <div className="relative h-[200svh] md:h-[200vh]">
          <section className="sticky top-0 h-[100svh] overflow-hidden bg-[linear-gradient(135deg,#e6ebfb_0%,#f1eefb_38%,#f6f3fc_70%,#f7f5fd_100%)] md:h-screen">
            {/* soft blue glow, top-left */}
            <div
              aria-hidden
              className="animate-glow-pulse pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(140,164,240,0.45)_0%,rgba(140,164,240,0)_70%)]"
            />

            {/* decorative pattern band (crystals + journey lines) */}
            <Image
              src="/images/pattern.png"
              alt=""
              aria-hidden
              width={1923}
              height={462}
              priority
              className="animate-fade-in-up pointer-events-none absolute left-0 right-0 top-[45%] w-full select-none"
            />

            {/* logo, top-left (links back to landing) */}
            <header className="relative z-20 px-8 pt-8 sm:px-14 sm:pt-10 [@media(max-height:500px)]:pt-4">
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
                  className="pf-photo h-11 w-auto sm:h-[52px] [@media(max-height:500px)]:h-9"
                />
              </Link>
            </header>

            {/* hero copy, left */}
            <Recede>
              <main className="animate-fade-in-up relative z-10 w-full max-w-[92%] px-6 pr-12 pt-6 sm:max-w-[min(56rem,72%)] sm:px-14 sm:pt-16 [@media(max-height:500px)]:pt-2">
                <h1 className="text-3xl font-extrabold leading-[1.05] tracking-tight min-[390px]:text-4xl sm:text-6xl lg:text-7xl [@media(max-height:500px)]:text-3xl">
                  <span className="text-[#f2a7a7]">Why </span>
                  <span className="text-[#9ed2bd]">Struggle Alone?</span>
                </h1>

                <p className="mt-5 max-w-2xl text-base font-medium leading-snug text-[#7a86dd] sm:mt-8 sm:text-xl lg:text-2xl [@media(max-height:500px)]:mt-3 [@media(max-height:500px)]:text-sm">
                  Isolation Breeds Failure. People First Rewrites the Script.
                  Together We Progress, Together We Win. Across your physical,
                  mind &amp; market journey
                </p>

                <p className="mt-5 text-xl font-bold tracking-tight sm:mt-7 sm:text-3xl [@media(max-height:500px)]:mt-3 [@media(max-height:500px)]:text-lg">
                  <span className="text-[#f2a7a7]">Learn</span>
                  <span className="text-zinc-400"> x </span>
                  <span className="text-[#b9df53]">Grow</span>
                  <span className="text-zinc-400"> x </span>
                  <span className="text-[#f2a7a7]">Lead</span>
                </p>
              </main>
            </Recede>

            {/* bottom-right CTAs (stack on small screens) */}
            <Recede className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] z-20 flex flex-col items-end gap-3 sm:bottom-10 sm:left-auto sm:right-[max(2rem,env(safe-area-inset-right))] sm:flex-row sm:items-center sm:gap-4">
              <div className="flex w-full gap-3 sm:w-auto">
                <ContactTrigger
                  href="/partner"
                  role="Training Partner"
                  className="pf-interactive inline-flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-md bg-[#a02f52] px-3 py-2.5 text-center text-xs font-medium text-white hover:-translate-y-0.5 hover:bg-[#8c2946] hover:shadow-lg min-[390px]:px-4 min-[390px]:text-sm sm:flex-none sm:px-5 sm:py-3 sm:text-base"
                >
                  Partner with Us
                </ContactTrigger>
                <ContactTrigger
                  href="/training"
                  role="Student"
                  className="pf-interactive inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-zinc-200 px-3 py-2.5 text-center text-xs font-medium leading-tight text-zinc-700 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg min-[390px]:px-4 min-[390px]:text-sm sm:flex-none sm:px-5 sm:py-3 sm:text-base"
                >
                  Join Training Program
                </ContactTrigger>
              </div>
              <ContactTrigger
                href="/contact"
                aria-label="Say hello"
                className="pf-interactive hidden hover:-translate-y-1 hover:scale-110 sm:inline-flex"
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
        </div>

        {/* ── SECTION 2: FEATURED WORK ──
          Higher z-index + opaque bg + rounded top → swipes up over the hero. */}
        <FeaturedWork />

        {/* ── SECTION 3: VENTURES ──
          Opaque rounded block with a negative margin → swipes up over Featured
          Work; pins itself so Gallery can swipe over it in turn. */}
        <VenturesShowcase />

        {/* ── SECTION 4: GALLERY ──
          Opaque rounded block, negative margin → swipes up over the pinned
          Ventures section. Same effect as 1→2 and 2→3. */}
        <GalleryShowcase />

        {/* ── SECTION 5: TESTIMONIALS ──
          Opaque rounded block, negative margin → swipes up over the pinned
          Gallery section. Same swipe-over effect. */}
        <TestimonialsShowcase />

        {/* ── SECTION 6: ECOSYSTEM ──
          Opaque rounded block, negative margin → swipes up over the pinned
          Testimonials section. Left copy + right radial orbit of sectors. */}
        <EcosystemShowcase />

        {/* ── SECTION 7: THE STORY + FOOTER ──
          Opaque rounded block, negative margin → swipes up over the pinned
          Ecosystem section. Left founder story + right circular photo with an
          overlapping "born out of a simple conclusion" callout. The footer
          continues inside this final white panel. */}
        <StoryShowcase />
      </div>
    </>
  );
}
