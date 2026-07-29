import Link from "next/link";
import Image from "next/image";
import ContactTrigger from "@/app/contact/ContactTrigger";

/* Grow With Us → Hero. The wide mint panel follows the desktop mockup: brand
   mark, desk illustration and headline, then the expo photo and program
   rationale. The shared SideNav occupies the right-side rail. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#eefaf9]">
      {/* soft lavender glow behind the headline, top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(150,140,240,0.18)_0%,rgba(150,140,240,0)_70%)]"
      />

      {/* logo, top-left */}
      <header className="relative z-20 mx-auto max-w-[1600px] px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 xl:px-28">
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
            className="h-12 w-auto sm:h-16"
          />
        </Link>
      </header>

      {/* ── headline row: desk illustration + copy ── */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-16 sm:px-10 sm:pt-24 lg:px-24 lg:pr-44 xl:px-28 xl:pr-48">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12">
          <Image
            src="/images/grow/hero-desk.webp"
            alt=""
            aria-hidden
            width={900}
            height={728}
            priority
            className="animate-floaty h-32 w-auto shrink-0 select-none sm:h-40 lg:h-52"
          />

          <div className="animate-fade-in-up max-w-[880px]">
            <h1 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-[#004f48] sm:text-4xl lg:text-[2.65rem]">
              <span className="italic">Learn</span> Skills.{" "}
              <span className="italic">Earn</span> Independently.
              <br />
              <span className="italic">Build</span> Your Future.
            </h1>
            <p className="mt-3 max-w-[900px] text-[0.95rem] leading-relaxed text-[#075950] sm:text-lg">
              <span className="font-extrabold">People First</span>{" "}
              offers practical, income-generating skills training for youth and
              women across Pakistan. Our programs are designed around what the
              market actually needs so graduates can earn from day one.
            </p>
          </div>
        </div>
      </div>

      {/* ── "Why These Programs Exist": photo left, copy right ── */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-10 pt-20 sm:px-10 sm:pt-28 lg:px-16 lg:pr-36">
        <div className="flex flex-col items-start gap-9 md:flex-row md:items-center md:gap-12">
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
              className="animate-floaty pointer-events-none absolute -top-12 -left-24 z-0 hidden h-36 w-auto select-none md:block"
            />
            <Image
              src="/images/grow/why-photo.webp"
              alt="People First team meeting entrepreneurs at an industry expo"
              width={590}
              height={443}
              className="relative z-10 w-[18rem] rounded-xl shadow-[0_20px_50px_-20px_rgba(60,60,110,0.45)] sm:w-[20rem]"
            />
          </div>

          <div className="max-w-[720px]">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-[2rem]">
              Why These Programs Exist
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-zinc-900 sm:text-lg">
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
      <div className="relative z-10 mx-auto flex max-w-[1600px] flex-wrap justify-end gap-4 px-6 pb-8 pt-8 sm:px-10 lg:px-24 lg:pr-44 xl:px-28 xl:pr-48">
        <ContactTrigger
          href="/partner"
          role="Training Partner"
          className="pf-interactive inline-flex min-h-11 items-center rounded bg-pf-teal px-7 py-2.5 text-[0.8rem] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(45,190,158,0.8)] hover:-translate-y-0.5 hover:brightness-95 sm:text-sm"
        >
          Partner with Us
        </ContactTrigger>
        <ContactTrigger
          href="/training"
          role="Student"
          className="pf-interactive inline-flex min-h-11 items-center rounded bg-[#c9f3f1] px-7 py-2.5 text-[0.8rem] font-semibold text-zinc-950 hover:-translate-y-0.5 hover:bg-white sm:text-sm"
        >
          Join Training Program
        </ContactTrigger>
      </div>
    </section>
  );
}
