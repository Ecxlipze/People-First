import Link from "next/link";
import Image from "next/image";
import HeroCTA from "@/app/components/HeroCTA";
import { Reveal } from "@/app/components/ScrollFx";

/* Grow With Us → Hero. The wide mint panel follows the desktop mockup: brand
   mark, desk illustration and headline, then the expo photo and program
   rationale. The shared SideNav occupies the right-side rail. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#eefaf9]">
      {/* soft lavender glow behind the headline, top-left */}
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute -left-32 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(150,140,240,0.18)_0%,rgba(150,140,240,0)_70%)]"
      />

      {/* logo, top-left */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 lg:pt-12 xl:px-28 xl:pt-14 [@media(max-height:500px)]:pt-4">
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

      {/* ── headline row: desk illustration + copy ── */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-16 sm:px-10 sm:pt-24 lg:px-16">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-12">
          <Image
            src="/images/grow/hero-desk.webp"
            alt=""
            aria-hidden
            width={900}
            height={728}
            priority
            className="animate-floaty hidden h-40 w-auto shrink-0 select-none sm:block sm:h-48 md:h-56 lg:h-64"
          />

          <div className="animate-fade-in-up w-full max-w-[880px] lg:pt-4">
            <h1 className="font-display text-3xl font-normal leading-[1.15] tracking-tight text-[#004f48] sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
              <span className="font-bold italic">Learn</span> Skills.{" "}
              <span className="font-bold italic">Earn</span> Independently.
              <br className="hidden sm:block" />
              <span className="font-bold italic">Build</span> Your Future.
            </h1>
            <p className="mt-4 w-full max-w-[800px] text-[0.95rem] font-normal leading-relaxed text-zinc-800 sm:text-lg lg:text-xl lg:leading-[1.7]">
              <strong className="font-bold text-[#004f48]">People First</strong> offers practical, income-generating skills training for youth and
              women across Pakistan. Our programs are designed around what the
              market actually needs so graduates can earn from day one.
            </p>
          </div>
        </div>
      </div>

      {/* ── "Why These Programs Exist": photo left, copy right ── */}
      <Reveal className="relative z-10 mx-auto max-w-[1440px] px-6 pb-16 pt-24 sm:px-10 sm:pb-24 sm:pt-32 lg:px-16" y={42} scale={0.975}>
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-start lg:gap-16">
          {/* photo + the blue paper plane tucked behind its top-left corner */}
          {/* photo */}
          <div className="group relative shrink-0 w-full lg:w-auto">
            <Image
              src="/images/grow/why-photo.webp"
              alt="People First team meeting entrepreneurs at an industry expo"
              width={590}
              height={443}
              className="pf-photo relative z-10 w-full rounded-2xl shadow-none md:max-w-2xl lg:w-[28rem]"
            />
          </div>

          <div className="flex w-full max-w-2xl flex-col lg:max-w-[720px] lg:pt-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Why These Programs Exist
            </h2>
            <p className="mt-6 text-base font-normal leading-relaxed text-zinc-800 sm:text-lg lg:text-xl lg:leading-[1.7]">
              Pakistan has millions of talented young people and women who lack
              access to the opportunities. People First bridges the gap between
              aspiration and opportunity by delivering training that is
              practical, affordable, and directly connected to real income
              pathways.
            </p>

            {/* ── two CTAs + message icon, right-aligned below the text ── */}
            <HeroCTA className="mt-10 lg:mt-16 justify-start lg:justify-end" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
