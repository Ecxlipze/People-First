import Link from "next/link";
import Image from "next/image";
import ContactTrigger from "@/app/contact/ContactTrigger";

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
        className="pointer-events-none absolute -left-32 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(140,110,235,0.18)_0%,rgba(140,110,235,0)_70%)]"
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

      {/* ── headline row: microphone + copy ── */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-10 sm:px-12 sm:pt-14 lg:pr-32">
        <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-center sm:gap-10">
          <Image
            src="/images/podcast/mic.webp"
            alt=""
            aria-hidden
            width={290}
            height={620}
            priority
            className="animate-floaty h-24 w-auto shrink-0 select-none drop-shadow-[0_18px_28px_rgba(70,40,120,0.3)] sm:h-32 lg:h-36"
          />

          <div className="animate-fade-in-up max-w-2xl">
            <h1 className="text-2xl font-extrabold leading-[1.2] tracking-tight text-[#1a1a2e] sm:text-3xl lg:text-[2.25rem]">
              Real{" "}
              <span className="italic text-pf-magenta">Conversations.</span>{" "}
              Real <span className="italic text-pf-lead">Insights.</span> Real{" "}
              <span className="italic text-pf-teal">Growth.</span>
            </h1>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-zinc-600 sm:text-base">
              The People First Podcast brings together entrepreneurs, industry
              leaders, technology experts, and innovators to share knowledge,
              experience, and honest perspectives on building successful
              businesses in Pakistan.
            </p>
          </div>
        </div>
      </div>

      {/* ── "Podcast Value": guest portrait left, pull-quote right ── */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-8 pt-14 sm:px-12 sm:pt-20 lg:pr-32">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
          <div className="relative shrink-0">
            {/* hidden below sm: no side margin to hold it, it would be clipped */}
            <Image
              src="/images/podcast/plane-blue.webp"
              alt=""
              aria-hidden
              width={253}
              height={500}
              className="animate-floaty pointer-events-none absolute -top-20 left-[-2.5rem] z-0 hidden h-32 w-auto select-none sm:block"
            />
            {/* the source frame is portrait; the design crops it landscape, so
                the wrapper fixes the aspect and the image covers it */}
            <div className="relative z-10 aspect-[4/3] w-[15rem] overflow-hidden rounded-xl border-4 border-white shadow-[0_20px_50px_-20px_rgba(60,50,110,0.45)] sm:w-[18rem]">
              <Image
                src="/images/podcast/value-guest.webp"
                alt="A guest recording an episode of the People First Podcast"
                fill
                sizes="(max-width: 640px) 15rem, 18rem"
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a2e] sm:text-3xl">
              Podcast Value
            </h2>
            <blockquote className="mt-4 text-[0.95rem] italic leading-relaxed text-zinc-600 sm:text-base">
              &ldquo;Whether you&rsquo;re a business owner navigating digital
              change, a startup founder seeking guidance, or a professional
              looking to stay ahead Tech Insights Podcast delivers practical
              knowledge from people who&rsquo;ve done it.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>

      {/* ── two CTAs, right-aligned ── */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-wrap justify-end gap-3 px-6 pb-10 sm:px-12 lg:pr-32">
        <ContactTrigger
          href="/partner"
          role="Training Partner"
          className="inline-flex min-h-11 items-center rounded-lg bg-pf-magenta px-5 py-2.5 text-[0.8rem] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(224,64,154,0.7)] transition-all hover:scale-[1.03] hover:bg-pf-magenta-dark sm:text-sm"
        >
          Partner with Us
        </ContactTrigger>
        <ContactTrigger
          href="/training"
          role="Student"
          className="inline-flex min-h-11 items-center rounded-lg border border-zinc-300 bg-white/70 px-5 py-2.5 text-[0.8rem] font-semibold text-[#3f2a6b] transition-all hover:scale-[1.03] hover:bg-white sm:text-sm"
        >
          Join Training Program
        </ContactTrigger>
      </div>
    </section>
  );
}
