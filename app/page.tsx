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
      {/* Subtle side patterns and dark gradients */}
      <div 
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 100% at -10% 50%, rgba(43, 191, 196, 0.15) 0%, transparent 70%),
            radial-gradient(ellipse 80% 100% at 110% 50%, rgba(43, 191, 196, 0.15) 0%, transparent 70%),
            repeating-radial-gradient(circle at -20% 50%, transparent 0, transparent 80px, rgba(255,255,255,0.03) 80px, rgba(255,255,255,0.03) 160px),
            repeating-radial-gradient(circle at 120% 50%, transparent 0, transparent 80px, rgba(255,255,255,0.03) 80px, rgba(255,255,255,0.03) 160px)
          `
        }}
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
            at y=470.8 of 1024 (45.98%) and the artwork's ink starts at y=313.6,
            leaving ~50px of air below the HOME icon. Flex-centring the logo
            independently let it drift relative to the arc, which is what pushed
            the fan's tip onto the HOME icon. Expressed in svh so the pairing
            holds as the viewport height changes. Below lg the labels are hidden
            and the arc is tighter, so margin-based stacking still applies.

            -31.45% (was -47%) places the ink exactly where the mockup has it;
            the old value sat the artwork ~70px high, which is what drove it into
            the icon ring. The artwork's own width is capped against svh (see the
            <Image> below), so on short windows it shrinks rather than colliding
            with the footer — that keeps this offset a single constant. */}
        <div className="animate-fade-in-up absolute flex flex-col items-center top-[58%] lg:top-[45.98svh] left-1/2 -translate-x-1/2 -translate-y-[47%] lg:-translate-y-[31.45%]">
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
            /* lg width from the mockup: the artwork's visible ink spans
               x 434.1..1013.6 = 579.6px on the 1440-wide frame. This SVG is
               93.63% ink and 6.37% transparent padding (the 1500×1500 source is
               inset by its pattern transform), so the *element* must be
               579.6 / 0.9363 = 619px — i.e. exactly the SVG's own intrinsic
               size. The previous 583px was the ink figure used as the element
               width, rendering the whole logo 5.8% small.

               Both `min()` terms are load-bearing on short windows:
               • 60.5svh keeps the fan clear of the icon ring (≥49px of air).
               • calc(102.62svh - 281px) keeps the wordmark off the footer; it
                 derives from ink_bottom ≤ viewport - footer, and is the binding
                 term below ~700px tall. Verified 560→1400px: the icon gap never
                 drops under 49px and footer clearance never under 8px, while
                 1024px-tall viewports still get the exact 619px design size. */
            className="animate-floaty w-[210px] max-w-[85vw] sm:w-[300px] lg:w-[min(619px,60.5svh,calc(102.62svh-281px))] [@media(max-height:500px)]:w-[150px]"
          />
        </div>
      </main>

      <footer className="animate-fade-in-up flex flex-col gap-6 pb-[max(2rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] text-sm text-zinc-400 sm:flex-row sm:items-end sm:justify-between sm:pl-[max(3.5rem,env(safe-area-inset-left))] sm:pr-[max(3.5rem,env(safe-area-inset-right))]">
        <div className="space-y-1">
          {/* "58A2", not "58-A2" — matches the Landing Page mockup.
              18px at sm+: the mockup's cap height here is 13px (= 18px at Inter's
              0.727 ratio) and fitting the full string's 399.4px advance width
              gives 18.8px. The inherited text-sm (14px) was undersized. */}
          <p className="font-semibold text-white sm:text-[18px]">
            58A2 Kickstart Tipu Road Gulberg, Lahore, PK
          </p>
          {/* Legal links. Each link keeps a 44px tap target, but the row itself
              must not wrap: below ~568px "Cookies" was dropping onto a second
              line while its "|" separator stayed behind on the first, which is
              the broken layout in the QA screenshot. Tightening the gaps and
              shrinking the type slightly keeps all three on one line down to
              320px, and `whitespace-nowrap` stops a single label from breaking
              mid-word.

              `text-white`, not the footer's inherited zinc-400: sampling the
              glyph interiors of Privacy / Terms of Service / Cookies in the
              mockup returns #ffffff for all three, the same value as the address
              line above them. The muted grey is what QA flagged as the footer
              navigation's colour not matching the design (LND-04).

              18px at sm+ for the same reason as the address line above (13px cap
              height; width fit gives 19.1px). The small sizes are kept below sm
              because that is what holds all three links on one line down to
              320px — see the wrapping note above. */}
          <div className="flex items-center gap-x-2 text-xs whitespace-nowrap text-white sm:gap-x-3 sm:text-[18px]">
            <Link
              href="/privacy"
              className="pf-interactive pf-underline inline-flex min-h-11 items-center hover:text-accent"
            >
              Privacy
            </Link>
            {/* Thin vertical rule, not a "|" glyph — the mockup uses a hairline
                divider that is taller than the cap height of the link text. */}
            <span aria-hidden className="h-4 w-px shrink-0 bg-zinc-500" />
            <Link
              href="/terms"
              className="pf-interactive pf-underline inline-flex min-h-11 items-center hover:text-accent"
            >
              Terms of Service
            </Link>
            {/* Thin vertical rule, not a "|" glyph — the mockup uses a hairline
                divider that is taller than the cap height of the link text. */}
            <span aria-hidden className="h-4 w-px shrink-0 bg-zinc-500" />
            <Link
              href="/cookies"
              className="pf-interactive pf-underline inline-flex min-h-11 items-center hover:text-accent"
            >
              Cookies
            </Link>
          </div>
        </div>

        {/* Montserrat 700 at 30px, with an 18px gap to the icon at sm+.

            The family is measured, not assumed: the mockup's "Say Hello!" glyph
            proportions (o/H=0.94, e/H=0.89, S/H=1.00) track Montserrat w700
            (0.92/0.88/0.91) rather than Inter (0.87/0.84/0.93). It is display
            text, so it takes the heading face while the address and legal links
            below stay on Inter as body copy.

            30px reproduces the design's 146px advance width to within 5%. Cap
            height alone would argue for ~34px, but matching the width keeps the
            footer row's proportions. Note this is Montserrat, not the Poppins
            used by the radial nav labels — that face is scoped to those labels
            alone (see globals.css --font-nav). */}
        <ContactTrigger
          href="/contact"
          className="pf-interactive font-heading group inline-flex min-h-11 items-center gap-3 self-start text-lg font-bold text-white hover:-translate-y-0.5 hover:text-accent sm:gap-[18px] sm:self-auto sm:text-[30px]"
        >
          Say Hello!
          {/* 36px square in the mockup (ink spans x 1308–1343, y 910–945),
              alongside the "Say Hello!" text. */}
          <SayHelloIcon className="h-7 w-7 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 sm:h-9 sm:w-9" />
        </ContactTrigger>
      </footer>
    </div>
  );
}
