import Link from "next/link";
import Image from "next/image";
import ContactTrigger from "@/app/contact/ContactTrigger";
import { Reveal } from "@/app/components/ScrollFx";

/* Podcasts → Hero. Light lavender panel: the 3D microphone sits at the left of
   the headline, and the "Podcast Value" block follows below with the guest
   portrait on the left and the pull-quote on the right. Two CTAs close the
   section, right-aligned as in the mockup. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(165deg,#f7f6fd_0%,#f4f2fc_50%,#efeefb_100%)]">
      {/* soft violet glow behind the headline */}
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute -left-32 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(140,110,235,0.18)_0%,rgba(140,110,235,0)_70%)]"
      />

      {/* logo, top-left */}
      <header className="relative z-20 mx-auto max-w-[1600px] px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 xl:px-28">
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
            className="pf-photo h-12 w-auto sm:h-16"
          />
        </Link>
      </header>

      {/* ── headline row: microphone + copy ── */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-16 sm:px-10 sm:pt-24 lg:px-24 lg:pr-44 xl:px-28 xl:pr-48">
        <div className="flex w-full min-w-0 flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12">
          <Image
            src="/images/podcast/mic.webp"
            alt=""
            aria-hidden
            width={290}
            height={620}
            priority
            className="animate-floaty h-28 w-auto shrink-0 select-none drop-shadow-[0_18px_28px_rgba(70,40,120,0.3)] sm:h-36 lg:h-44"
          />

          <div className="animate-fade-in-up w-full min-w-0 max-w-[980px]">
            <h1 className="text-2xl font-extrabold leading-[1.18] tracking-tight text-[#6b215b] sm:text-3xl lg:text-[2.15rem]">
              Real{" "}
              <span className="italic">Conversations.</span>{" "}
              Real <span className="italic">Insights.</span> Real{" "}
              <span className="italic">Growth.</span>
            </h1>
            <p className="mt-6 max-w-[920px] text-[0.95rem] leading-relaxed text-[#6b215b] sm:text-lg">
              The People First Podcast brings together entrepreneurs, industry
              leaders, technology experts, and innovators to share knowledge,
              experience, and honest perspectives on building successful
              businesses in Pakistan.
            </p>
          </div>
        </div>
      </div>

      {/* ── "Podcast Value": guest portrait left, pull-quote right ── */}
      <Reveal className="relative z-10 mx-auto max-w-[1440px] px-6 pb-4 pt-20 sm:px-10 sm:pt-28 lg:pl-52 lg:pr-36" y={42} scale={0.975}>
        <div className="flex w-full min-w-0 flex-col items-start gap-9 md:flex-row md:items-center md:gap-12">
          <div className="group relative shrink-0">
            {/* hidden below sm: no side margin to hold it, it would be clipped */}
            <Image
              src="/images/podcast/plane-blue.webp"
              alt=""
              aria-hidden
              width={253}
              height={500}
              className="animate-floaty pointer-events-none absolute -left-24 -top-8 z-0 hidden h-40 w-auto select-none md:block"
            />
            <div className="relative z-10 aspect-[6/7] w-[15rem] overflow-hidden rounded-xl border-4 border-white shadow-[0_20px_50px_-20px_rgba(60,50,110,0.45)] sm:w-[18rem]">
              <Image
                src="/images/podcast/value-guest.webp"
                alt="A guest recording an episode of the People First Podcast"
                fill
                sizes="(max-width: 640px) 15rem, 18rem"
                className="pf-photo object-cover object-top"
              />
            </div>
          </div>

          <div className="w-full min-w-0 max-w-xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1c0878] sm:text-3xl">
              Podcast Value
            </h2>
            <blockquote className="mt-4 text-[0.95rem] leading-relaxed text-zinc-900 sm:text-lg">
              &ldquo;Whether you&rsquo;re a business owner navigating digital
              change, a startup founder seeking guidance, or a professional
              looking to stay ahead Tech Insights Podcast delivers practical
              knowledge from people who&rsquo;ve done it.&rdquo;
            </blockquote>
          </div>
        </div>
      </Reveal>

      {/* ── two CTAs, right-aligned ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-wrap justify-end gap-4 px-6 pb-8 pt-8 sm:px-10 lg:px-24 lg:pr-36 xl:px-28 xl:pr-36">
        <ContactTrigger
          href="/partner"
          role="Training Partner"
          className="pf-interactive inline-flex min-h-11 w-full items-center justify-center rounded bg-[#ad3f69] px-7 py-2.5 text-[0.8rem] font-semibold text-white hover:-translate-y-0.5 hover:bg-[#96345a] sm:w-auto sm:text-sm"
        >
          Partner with Us
        </ContactTrigger>
        <ContactTrigger
          href="/training"
          role="Student"
          className="pf-interactive inline-flex min-h-11 w-full items-center justify-center rounded bg-zinc-200 px-7 py-2.5 text-[0.8rem] font-semibold text-zinc-900 hover:-translate-y-0.5 hover:bg-white sm:w-auto sm:text-sm"
        >
          Join Training Program
        </ContactTrigger>
      </div>
    </section>
  );
}
