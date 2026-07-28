import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import ContactTrigger from "@/app/contact/ContactTrigger";

/* About → Hero. Deep-purple founder-story panel: label + big heading + the
   founding question as a quote, the founder story copy, two CTAs on the left;
   the founder portrait (bordered frame + two pill labels) on the right. A faint
   wavy pattern band sits at the bottom as a divider into the light section. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-pf-purple">
      {/* soft glow, top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(122,92,240,0.35)_0%,rgba(122,92,240,0)_70%)]"
      />

      {/* logo, top-left (links back to landing) */}
      <header className="relative z-20 px-8 pt-8 sm:px-14 sm:pt-10">
        <Link
          href="/"
          aria-label="People First — landing"
          className="inline-flex min-h-11 items-center"
        >
          {/* About-page logo (already light/white — designed for the dark hero,
              so no invert filter needed). */}
          <Image
            src="/images/about-page/logo.png"
            alt="People First"
            width={318}
            height={91}
            priority
            className="h-11 w-auto sm:h-[52px]"
          />
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-12 px-8 pb-20 pt-10 sm:px-14 sm:pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pr-32">
        {/* ── left: copy ── */}
        <div className="animate-fade-in-up max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pf-lead">
            Ideas Lab
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Every Movement Begins with a Question.
          </h1>

          <p className="mt-6 text-lg font-medium italic leading-snug text-white/70 sm:text-xl">
            &ldquo;Why do so many talented people fail, even when they have
            passion and good intentions?&rdquo;
          </p>

          <div className="mt-7 space-y-4 text-[0.95rem] leading-relaxed text-white/65 sm:text-base">
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

          <div className="mt-9 flex flex-wrap gap-4">
            <ContactTrigger
              href="/partner"
              role="Training Partner"
              className="inline-flex min-h-11 items-center rounded-full bg-pf-magenta px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(224,64,154,0.6)] transition-all hover:scale-[1.03] hover:bg-pf-magenta-dark sm:text-base"
            >
              Partner with Us
            </ContactTrigger>
            <ContactTrigger
              href="/training"
              role="Student"
              className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:bg-white/10 sm:text-base"
            >
              Join Training Program
            </ContactTrigger>
          </div>
        </div>

        {/* ── right: founder portrait ── */}
        <div className="animate-fade-in-up relative mx-auto w-full max-w-sm lg:mt-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-2 border-white/15 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)]">
            <Image
              src="/images/about-page/founder.png"
              alt="Rai Salahuddin Ahmad, founder of People First"
              fill
              sizes="(max-width: 1024px) 90vw, 384px"
              className="object-cover object-top"
              priority
            />
            {/* two pill labels, overlapping the bottom of the frame */}
            <div className="absolute inset-x-0 bottom-4 flex flex-wrap justify-center gap-2 px-3">
              <span className="rounded-full bg-pf-magenta px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg sm:px-4 sm:text-[11px]">
                Partner with Us
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-pf-purple shadow-lg sm:px-4 sm:text-[11px]">
                Job Training Program
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* "Say Hello!" — bottom-right */}
      <div className="relative z-20 flex justify-end px-8 pb-8 sm:px-14">
        <ContactTrigger
          href="/contact"
          className="group inline-flex min-h-11 items-center gap-2.5 text-lg font-bold text-white transition-colors hover:text-pf-magenta"
        >
          Say Hello!
          <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
        </ContactTrigger>
      </div>

      {/* wavy pattern band — flows into the same-coloured JourneyPaths below */}
      <Image
        src="/images/about-page/pattern.png"
        alt=""
        aria-hidden
        width={1920}
        height={236}
        className="pointer-events-none relative z-0 w-full select-none opacity-40"
      />
    </section>
  );
}
