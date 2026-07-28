import Link from "next/link";
import Image from "next/image";
import ContactTrigger from "@/app/contact/ContactTrigger";

/* Grow With Us → Hero. Light mint/lavender panel: the desk illustration floats
   at the top-left, the headline and intro copy sit beside it, and the "Why These
   Programs Exist" block follows below with the conference photo on the left.
   Two paper planes drift in as decorative accents, matching the mockup. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(160deg,#f2f7fb_0%,#eef7f6_45%,#e9f5f2_100%)]">
      {/* soft lavender glow behind the headline, top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(150,140,240,0.18)_0%,rgba(150,140,240,0)_70%)]"
      />

      {/* logo, top-left */}
      <header className="relative z-20 px-6 pt-8 sm:px-12 sm:pt-10">
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
            className="h-10 w-auto sm:h-12"
          />
        </Link>
      </header>

      {/* ── headline row: desk illustration + copy ── */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-10 sm:px-12 sm:pt-14 lg:pr-32">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-10">
          <Image
            src="/images/grow/hero-desk.webp"
            alt=""
            aria-hidden
            width={900}
            height={728}
            priority
            className="animate-floaty h-28 w-auto shrink-0 select-none sm:h-36 lg:h-44"
          />

          <div className="animate-fade-in-up max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-[#1a1a2e] sm:text-4xl lg:text-[2.75rem]">
              <span className="italic text-pf-lead">Learn</span> Skills.{" "}
              <span className="italic text-pf-teal">Earn</span> Independently.
              <br />
              <span className="italic text-pf-magenta">Build</span> Your Future.
            </h1>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-zinc-600 sm:text-base">
              <span className="font-bold text-[#1a1a2e]">People First</span>{" "}
              offers practical, income-generating skills training for youth and
              women across Pakistan. Our programs are designed around what the
              market actually needs so graduates can earn from day one.
            </p>
          </div>
        </div>
      </div>

      {/* ── "Why These Programs Exist": photo left, copy right ── */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-8 pt-14 sm:px-12 sm:pt-20 lg:pr-32">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
          {/* photo + the blue paper plane tucked behind its top-left corner */}
          <div className="relative shrink-0">
            {/* hidden below sm: at narrow widths there is no side margin to
                hold the plane, so it would be clipped by the viewport edge */}
            <Image
              src="/images/grow/plane-blue.webp"
              alt=""
              aria-hidden
              width={253}
              height={500}
              className="animate-floaty pointer-events-none absolute -top-20 left-[-2.5rem] z-0 hidden h-32 w-auto select-none sm:block"
            />
            <Image
              src="/images/grow/why-photo.webp"
              alt="People First team meeting entrepreneurs at an industry expo"
              width={590}
              height={443}
              className="relative z-10 w-[17rem] rounded-xl border-4 border-white shadow-[0_20px_50px_-20px_rgba(60,60,110,0.45)] sm:w-[19rem]"
            />
          </div>

          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a2e] sm:text-3xl">
              Why These Programs Exist
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-zinc-600 sm:text-base">
              Pakistan has millions of talented young people and women who lack
              access to the opportunities. People First bridges the gap between
              aspiration and opportunity by delivering training that is
              practical, affordable, and directly connected to real income
              pathways.
            </p>
          </div>
        </div>
      </div>

      {/* ── two CTAs, right-aligned above the fold-out ── */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-wrap justify-end gap-3 px-6 pb-10 sm:px-12 lg:pr-32">
        <ContactTrigger
          href="/partner"
          role="Training Partner"
          className="inline-flex min-h-11 items-center rounded-lg bg-pf-teal px-5 py-2.5 text-[0.8rem] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(45,190,158,0.8)] transition-all hover:scale-[1.03] hover:brightness-95 sm:text-sm"
        >
          Partner with Us
        </ContactTrigger>
        <ContactTrigger
          href="/training"
          role="Student"
          className="inline-flex min-h-11 items-center rounded-lg bg-[#0f2f47] px-5 py-2.5 text-[0.8rem] font-semibold text-white transition-all hover:scale-[1.03] hover:bg-[#163f5d] sm:text-sm"
        >
          Join Training Program
        </ContactTrigger>
      </div>
    </section>
  );
}
