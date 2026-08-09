import Link from "next/link";
import Image from "next/image";
import ContactTrigger from "@/app/contact/ContactTrigger";
import { Reveal } from "@/app/components/ScrollFx";

/* This lucide-react version dropped ALL brand glyphs (no Instagram/Facebook/
   LinkedIn/Twitter exports — the AGENTS.md deprecation warning in action), so
   every social mark below is inlined as SVG. `currentColor` lets Tailwind tint
   them, matching the dark glyphs in the design. */
type IconProps = { className?: string };

function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.12 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.12.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.12-1.38 5.9 5.9 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.12A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function TwitterBird({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.23 13.23 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.65 4.65 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.7 4.7 0 0 1-2.104.08 4.66 4.66 0 0 0 4.352 3.234 9.35 9.35 0 0 1-5.786 1.995 9 9 0 0 1-1.112-.065 13.19 13.19 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.5 9.5 0 0 0 2.323-2.41z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
  { label: "Twitter", href: "https://twitter.com", icon: TwitterBird },
] as const;

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Pages",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/what-we-do" },
      { label: "Blog", href: "/insights" },
      { label: "Podcast", href: "/podcasts" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Account", href: "/contact" },
      { label: "FAQ", href: "/contact" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

/* Site footer — the final block of the /home page. Unlike the sections above it,
   this is NOT a swipe-over/pinned block; it sits in normal flow at the page
   bottom. A rounded purple gradient CTA band on top, then the logo + socials and
   the Pages/Support/Legal link columns below.

   `showCta` (default true) renders the CTA band. Pages that already provide
   their own CTA band above the footer (e.g. /about) pass `showCta={false}` to
   avoid rendering it twice. */
export default function SiteFooter({
  showCta = true,
  swipeOver = false,
}: {
  showCta?: boolean;
  swipeOver?: boolean;
}) {
  return (
    <footer
      className={`relative z-[70] bg-white ${swipeOver ? "-mt-8 rounded-t-[2rem] shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] xl:-mt-[100vh]" : ""}`}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 py-14 sm:px-10 sm:py-16 lg:px-32 xl:px-36">
        {/* ── CTA band ── short & wide; globe flush-left and clipped, copy
            slightly right of it, CTAs pinned to the right. */}
        {showCta && (
          <Reveal
            y={36}
            scale={0.975}
            /* Gradient sampled across the band in Footer.pdf: #150065 at the left
               edge easing to #4f1a57 at the right (deep indigo → plum), where this
               used #26095f→#3a1268→#5a1e6d. Corner radius measured at ~14px on
               the 1920 frame → 10px at 1440, so rounded-[0.625rem] rather than
               the 1.5rem here. */
            className="relative overflow-hidden rounded-[0.625rem] bg-[linear-gradient(100deg,#150065_0%,#340d5e_55%,#4f1a57_100%)]"
          >
            {/* wireframe globe (real asset) — vertically centred, flush to the
              left edge and clipped by the rounded corner, ~1.5× the band height.
              The source art is magenta lines on transparency; the filter tints
              it toward white and the low opacity gives the faint lavender
              wireframe of the design. */}
            <Image
              src="/images/icons/globe.webp"
              alt=""
              aria-hidden
              width={500}
              height={500}
              className="pointer-events-none absolute left-0 top-1/2 hidden h-[135%] w-auto -translate-x-[38%] -translate-y-1/2 select-none opacity-30 [filter:brightness(0)_invert(1)] sm:block"
            />

            <div className="relative flex flex-col gap-8 px-8 py-10 sm:px-12 xl:flex-row xl:items-center xl:justify-between xl:gap-10 xl:py-11">
              {/* copy */}
              <div className="text-center xl:pl-52 xl:text-left">
                <h2 className="font-serif text-[1.75rem] italic leading-tight text-white sm:text-[2rem]">
                  Let&rsquo;s Get in Touch
                </h2>
                <p className="mt-2 text-base text-white sm:text-[1.0625rem]">
                  Learn More about us and what you wanna do further.
                </p>
              </div>

              {/* CTAs. All three buttons share ONE right edge in the design: the
                  outlined button and "Partner With Us" both end at x1704 on the
                  1920 frame, with the block running x1199→1704 = 506px (380px at
                  1440) and sitting 54px inside the band's right edge. This was
                  29rem/464px. Buttons are 50px tall → ~38px at 1440. */}
              {/* `min-w-0` on the row + no `whitespace-nowrap` on the buttons.
                  With nowrap AND flex-1, "Join a Training Program" forced itself
                  wider than the 380px block, pushing the pair past the band's
                  right edge — the buttons hanging outside the panel. The label is
                  long, so the type steps down slightly at sm to keep it on one
                  line inside the design's width instead of forcing an overflow. */}
              <div className="mx-auto flex w-full flex-none flex-col gap-3.5 sm:w-[380px] xl:mx-0">
                <div className="flex min-w-0 flex-col gap-3.5 sm:flex-row">
                  <ContactTrigger
                    href="/contact"
                    className="pf-interactive min-w-0 flex-1 rounded-md bg-[#dcd4e1] px-3 py-3 text-center text-[0.95rem] font-medium leading-tight text-[#090c62] hover:-translate-y-0.5 hover:bg-white hover:shadow-lg sm:text-[0.8125rem]"
                  >
                    Book a Consultation
                  </ContactTrigger>
                  <ContactTrigger
                    href="/training"
                    role="Student"
                    className="pf-interactive min-w-0 flex-1 rounded-md border border-white/50 px-3 py-3 text-center text-[0.95rem] font-medium leading-tight text-white hover:-translate-y-0.5 hover:bg-white/10 sm:text-[0.8125rem]"
                  >
                    Join a Training Program
                  </ContactTrigger>
                </div>
                <ContactTrigger
                  href="/partner"
                  role="Training Partner"
                  className="pf-interactive w-full rounded-md bg-white px-5 py-3 text-center text-[0.95rem] font-bold text-black hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-lg"
                >
                  Partner With Us
                </ContactTrigger>
              </div>
            </div>
          </Reveal>
        )}

        {/* ── logo + socials + link columns ── */}
          <Reveal
            y={36}
            scale={0.985}
            className="mt-14 grid grid-cols-1 gap-12 sm:mt-16 xl:grid-cols-[1fr_1.1fr]"
        >
          {/* logo + socials — centred within its column on lg+, matching the
              design (QA Footer: "present in center in design"). No `pl-*` here:
              a left pad would offset the block from the column's true centre,
              which is what left it 227px/203px off-centre before. */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* Logo is 283×66 on the 1920 frame → ~50px tall at 1440, where this
                rendered h-11/44px. */}
            <Link href="/" aria-label="People First — home">
              <Image
                src="/images/logo.svg"
                alt="People First"
                width={398}
                height={100}
                className="h-[50px] w-auto"
              />
            </Link>
            {/* Icons are 34px in the design (26px at 1440) and the whole row spans
                253px → 190px at 1440, i.e. ~29px of visible gap between marks.
                The gap value has to account for the 44px tap-target wrappers:
                each `w-11` box adds 9px of padding either side of its 26px glyph,
                so a bare gap-[29px] rendered as 47px of visible space. Using
                gap-[11px] (29 − 2×9) lands the visible gap at ~29px while every
                link keeps its full 44px touch target. */}
            <div className="mt-8 flex items-center gap-[11px]">
              {SOCIALS.map(({ label, href, icon: SocialIcon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="pf-interactive grid h-11 w-11 place-items-center rounded-full text-black hover:-translate-y-0.5 hover:text-[#5a1f9e]"
                >
                  <SocialIcon className="h-[26px] w-[26px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns, preceded by a vertical divider on lg+. Measured in
              Footer.pdf: the rule is a 1px PURE BLACK hairline at x=932 spanning
              y419–618 — 200px, which stops short of the columns' own height
              (their content runs to y660). A `border-l` on this grid cell would
              instead run the full row height, so the rule is drawn as an
              absolutely-positioned span sized to the design's 200px (150px at
              1440). Headings are pure black, links #3c3c3c, and the gap from rule
              to the "Pages" column is 119px → 89px at 1440 (pl-20 ≈ 80px is
              within a rounding step). QA asked for both the divider treatment and
              more left padding on the right-hand links. */}
          <div className="relative grid grid-cols-1 justify-items-start gap-x-10 gap-y-10 text-left sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(9rem,1.15fr)] sm:justify-items-center sm:text-center xl:justify-items-start xl:gap-x-16 xl:pl-[89px] xl:text-left">
            {/* inset-y-0 rather than a fixed height: the rule should run the
                columns' own height. A hard h-[150px] taken from the design's
                200px rule left it floating — the design's columns are 193px tall
                there, so the rule effectively spans them, and ours are a
                different height. */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 hidden w-px bg-black xl:block"
            />
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xl font-bold text-black">{col.title}</h3>
                {/* Keep every row's visual spacing at least as large as its 44px
                    touch target. The previous 33px rows made adjacent links
                    overlap vertically and left the Legal column looking
                    compressed, especially once SideNav clearance narrowed the
                    footer at 1024px. */}
                <ul className="mt-6 flex flex-col gap-2 xl:mt-[35px]">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="pf-interactive inline-flex min-h-11 items-center rounded-sm text-[1.0625rem] text-black hover:translate-x-0.5 hover:text-[#491557]"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
