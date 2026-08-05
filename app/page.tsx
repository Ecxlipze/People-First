import Link from "next/link";
import Image from "next/image";
import RadialNav from "@/app/components/RadialNav";
import SayHelloIcon from "@/app/components/SayHelloIcon";
import ContactTrigger from "@/app/contact/ContactTrigger";

export default function Landing() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-[#0b0b0d]">
      <div 
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/bg-landing.png')] bg-cover bg-center bg-no-repeat opacity-80 mix-blend-screen"
      />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <RadialNav />

        {/* Logo block. The radial nav's HOME icon sits one nav-radius directly
            above this block's centre, so the logo's top edge and that icon
            compete for the same band. Measured clearance between the two <img>
            boxes was only 1–11px from 320–600px (the logo visually touching the
            icon — QA #6/#7), because the arc's radius grows at `sm`/`lg` while
            the logo's own top margin did not. These margins keep ≥28px of air
            at every width; verified 320→1920px. */}
        {/* On lg+ the artwork is anchored to the viewport like the icon arc is,
            because in the mockup the two are locked together: the arc origin is
            at y=466 of 1024 (45.5%) and the artwork box starts at y=311 (30.4%),
            so the fan's tip rises into the ring. Flex-centring the logo
            independently let it drift relative to the arc, which is what pushed
            the fan's tip onto the HOME icon. Expressed in svh so the pairing
            holds as the viewport height changes. Below lg the labels are hidden
            and the arc is tighter, so margin-based stacking still applies. */}
        <div className="animate-fade-in-up relative mt-40 flex flex-col items-center min-[400px]:mt-44 sm:mt-36 lg:absolute lg:mt-0 lg:top-[30.4svh] [@media(max-height:500px)]:mt-0">
          {/* soft pulsing glow behind the logo */}
          <div
            aria-hidden
            className="animate-glow-pulse pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(43,191,196,0.25)_0%,rgba(43,191,196,0)_70%)] sm:h-[460px] sm:w-[460px]"
          />
          <Image
            src="/images/peoplefirst.svg"
            alt="People First"
            width={619}
            height={505}
            priority
            /* lg width from the mockup: the full artwork (fan + wordmark) spans
               583px on the 1440-wide frame — measured aspect 1.213 confirms it
               is this same SVG (619/505 = 1.226). Sizing off the wordmark text
               alone overshoots badly: at 720px the fan grows into the icon ring
               and covers ABOUT US / PODCASTS / GROW WITH US.

               The `min()` is load-bearing: the mockup is 1024px tall, and a flat
               583px overflowed the footer on shorter desktop windows (1440×700,
               1280×720, 1024×600 all clashed). Capping against svh keeps the
               design size whenever there is room and scales down when there
               isn't — 46.5svh ≈ 476px of art height at 1024px tall. */
            className="animate-floaty w-[210px] max-w-[85vw] sm:w-[300px] lg:w-[min(583px,57svh)] [@media(max-height:500px)]:w-[150px]"
          />
        </div>
      </main>

      <footer className="animate-fade-in-up flex flex-col gap-6 pb-[max(2rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] text-sm text-zinc-400 sm:flex-row sm:items-end sm:justify-between sm:pl-[max(3.5rem,env(safe-area-inset-left))] sm:pr-[max(3.5rem,env(safe-area-inset-right))]">
        <div className="space-y-1">
          {/* "58A2", not "58-A2" — matches the Landing Page mockup. */}
          <p className="font-semibold text-white">
            58A2 Kickstart Tipu Road Gulberg, Lahore, PK
          </p>
          {/* Legal links. Each link keeps a 44px tap target, but the row itself
              must not wrap: below ~568px "Cookies" was dropping onto a second
              line while its "|" separator stayed behind on the first, which is
              the broken layout in the QA screenshot. Tightening the gaps and
              shrinking the type slightly keeps all three on one line down to
              320px, and `whitespace-nowrap` stops a single label from breaking
              mid-word. */}
          <div className="flex items-center gap-x-2 text-xs whitespace-nowrap sm:gap-x-3 sm:text-sm">
            <Link
              href="/privacy"
              className="pf-interactive pf-underline inline-flex min-h-11 items-center hover:text-white"
            >
              Privacy
            </Link>
            {/* Thin vertical rule, not a "|" glyph — the mockup uses a hairline
                divider that is taller than the cap height of the link text. */}
            <span aria-hidden className="h-4 w-px shrink-0 bg-zinc-600" />
            <Link
              href="/terms"
              className="pf-interactive pf-underline inline-flex min-h-11 items-center hover:text-white"
            >
              Terms of Service
            </Link>
            {/* Thin vertical rule, not a "|" glyph — the mockup uses a hairline
                divider that is taller than the cap height of the link text. */}
            <span aria-hidden className="h-4 w-px shrink-0 bg-zinc-600" />
            <Link
              href="/cookies"
              className="pf-interactive pf-underline inline-flex min-h-11 items-center hover:text-white"
            >
              Cookies
            </Link>
          </div>
        </div>

        <ContactTrigger
          href="/contact"
          className="pf-interactive group inline-flex min-h-11 items-center gap-3 self-start text-lg font-bold text-white hover:-translate-y-0.5 hover:text-accent sm:self-auto sm:text-xl"
        >
          Say Hello!
          {/* ~36px in the mockup at desktop, alongside the "Say Hello!" text. */}
          <SayHelloIcon className="h-7 w-7 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 sm:h-9 sm:w-9" />
        </ContactTrigger>
      </footer>
    </div>
  );
}
