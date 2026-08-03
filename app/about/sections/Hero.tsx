import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import ContactTrigger from "@/app/contact/ContactTrigger";

/* About → Hero. Deep-purple founder-story panel: big heading, founding question,
   story copy, founder portrait, and two CTAs beneath the portrait. A wavy
   pattern band divides the story from the journey section. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-pf-purple">
      {/* soft glow, top-left */}
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(122,92,240,0.35)_0%,rgba(122,92,240,0)_70%)]"
      />

      {/* logo, top-left (links back to landing) */}
      <header className="relative z-20 mx-auto max-w-[1600px] px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 xl:px-28">
        <Link
          href="/"
          aria-label="People First — landing"
          className="group inline-flex min-h-11 items-center"
        >
          {/* About-page logo (already light/white — designed for the dark hero,
              so no invert filter needed). */}
          <Image
            src="/images/about-page/logo.png"
            alt="People First"
            width={318}
            height={91}
            priority
            className="pf-photo h-11 w-auto sm:h-[58px]"
          />
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid max-w-[1600px] items-start gap-12 px-6 pb-16 pt-12 sm:px-10 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-20 lg:px-24 xl:gap-24 xl:px-28 xl:pr-44">
        {/* ── left: copy ── */}
        <div className="pf-stagger max-w-[680px]">
          <h1 className="text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-[2.75rem] lg:text-5xl">
            Every Movement Begins
            <br className="hidden sm:block" /> with a Question.
          </h1>

          <p className="mt-7 max-w-[650px] text-lg font-semibold leading-snug text-white sm:text-[1.3rem]">
            &ldquo;Why do so many talented people fail, even when they have
            passion and good intentions?&rdquo;
          </p>

          <div className="mt-10 max-w-[650px] space-y-4 text-[0.92rem] leading-[1.55] text-white/90 sm:text-[0.98rem]">
            <p>
              After more than 25 years working closely with entrepreneurs,
              students, farmers, and investors across diverse sectors, our
              founder, Rai Salahuddin Ahmad, realized that regardless of the
              industry, individuals consistently confront the same fundamental
              challenge: People are fighting alone.
            </p>
            <p>
              A passionate young person lacks guidance. A skilled professional
              lacks a platform to grow. A business owner lacks the network to
              scale. Talent is everywhere, but the ecosystem to sustain it is
              missing.
            </p>
            <p>
              People First was born out of a simple conclusion: People
              don&apos;t just need isolated education, funding, or jobs. They
              need connections, opportunities, mentorship, and a unified
              platform where they can discover themselves, perform at their
              highest level, and build meaningful lives.
            </p>
          </div>

        </div>

        {/* ── right: founder portrait ── */}
        <div className="animate-fade-in-up group relative mx-auto w-full max-w-[390px]">
          <div className="relative aspect-[498/641] w-full overflow-hidden border-b-4 border-[#3f4bde] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.72)]">
            <Image
              src="/images/about-page/founder.png"
              alt="Rai Salahuddin Ahmad, founder of People First"
              fill
              sizes="(max-width: 1024px) 90vw, 390px"
              className="pf-photo object-cover object-top"
              priority
            />
          </div>
          <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-3 px-2">
            <ContactTrigger
              href="/partner"
              role="Training Partner"
              className="pf-interactive inline-flex min-h-11 items-center rounded bg-[#a63d72] px-5 py-2.5 text-center text-xs font-semibold text-white shadow-lg hover:-translate-y-0.5 hover:bg-pf-magenta-dark"
            >
              Partner with Us
            </ContactTrigger>
            <ContactTrigger
              href="/training"
              role="Student"
              className="pf-interactive inline-flex min-h-11 items-center rounded bg-zinc-100 px-5 py-2.5 text-center text-xs font-semibold text-zinc-900 shadow-lg hover:-translate-y-0.5 hover:bg-white"
            >
              Join Training Program
            </ContactTrigger>
          </div>
        </div>
      </div>

      {/* "Say Hello!" — bottom-right */}
      <div className="relative z-20 mx-auto flex max-w-[1600px] justify-end px-6 pb-7 sm:px-10 lg:px-24 xl:px-44">
        <ContactTrigger
          href="/contact"
          className="group inline-flex min-h-11 items-center gap-2.5 text-xl font-bold text-white transition-colors hover:text-pf-magenta sm:text-2xl"
        >
          Say Hello!
          <MessageCircle className="h-7 w-7 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
        </ContactTrigger>
      </div>

      {/* wavy pattern band — flows into the same-coloured JourneyPaths below */}
      <Image
        src="/images/about-page/pattern.png"
        alt=""
        aria-hidden
        width={1920}
        height={236}
        className="pf-wipe pointer-events-none relative z-0 w-full select-none opacity-80"
      />
    </section>
  );
}
