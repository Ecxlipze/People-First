import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/app/lib/nav";

export default function RadialNav() {
  return (
    <nav
      aria-label="Explore"
      /* --nav-r is the icon-arc radius; `top` is the arc's origin. Both come from
         Landing Page.pdf (1440×1024): fitting the seven extracted icon-circle
         centres against the HOME axis puts the origin at y=470.8 → 45.98% of the
         frame, with r=224.4px. The origin used to be 58%, which put the whole arc
         ~64px lower than the design at every angle. Below lg the labels are
         hidden and the arc is tighter, so it stays lower to clear the wordmark.

         The lg radius is `min(224.4px, 32svh)`, not a flat 224.4px. The origin is
         a share of viewport HEIGHT while the radius was fixed, so on short-but-
         wide windows the arc outgrew the space above it: at 1024×600 the origin
         falls at 276px, putting HOME's icon at 52px and its label (72px higher)
         off-screen entirely. Capping the radius against svh keeps the design
         size wherever there is room — 32svh ≥ 224.4px once the viewport is
         ~700px tall, so the 1024-tall mockup is untouched — and shrinks the arc
         to fit below that. Verified: the HOME label clears the top edge at every
         height from 560px up. */
      className="pointer-events-none absolute left-1/2 top-[58%] h-0 w-0 -translate-x-1/2 [--nav-r:120px] sm:[--nav-r:180px] lg:top-[45.98svh] lg:[--nav-r:min(224.4px,32svh)] [@media(max-height:500px)]:[--nav-r:90px]"
    >
      {navItems.map((item, i) => {
        const rad = (item.angle * Math.PI) / 180;
        const sin = Math.sin(rad).toFixed(4);
        const cos = (-Math.cos(rad)).toFixed(4);

        /* Labels are placed from the per-item offsets measured in nav.ts, not
           from a formula. An earlier concentric-ring model put every label a
           fixed 63px further out along its own angle; re-measuring the mockup
           showed the design does not do that — the four label baselines are
           fixed (y=169.5/232.5/320.5/433.5), so the implied outset ranges from
           +72px at HOME down to *negative* at IDEAS LAB, and any single value
           lands the outer rows ~17px off. */

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            className="animate-pop-in pointer-events-auto group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{
              left: `calc(${sin} * var(--nav-r))`,
              top: `calc(${cos} * var(--nav-r))`,
              animationDelay: `${0.15 + i * 0.08}s`,
            }}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={44}
              height={44}
              priority
              /* 35px at lg: the seven icon circles extracted from the mockup all
                 measure 34.5–36px across on the 1440-wide frame. The 44px Link
                 box around it keeps the tap target accessible while the glyph
                 itself matches the design. */
              className="h-10 w-10 drop-shadow-[0_0_0_rgba(43,191,196,0)] transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:drop-shadow-[0_0_14px_rgba(43,191,196,0.65)] sm:h-11 sm:w-11 lg:h-[35px] lg:w-[35px]"
            />
            {/* Labels must never wrap: "INSIGHTS BY PEOPLE FIRST" is the
                longest one and sits at the far right of the arc, where it was
                breaking onto a second line ("PEOPLE FIRST" dropping under
                "INSIGHTS BY"). `whitespace-nowrap` alone wasn't enough because
                the nav is a 0×0 box — the label's containing block gave it no
                width to work with, so it wrapped against the viewport edge.
                `w-max` lets it size to its own content instead.

                Type: Poppins 300 at 17px, NO letter-spacing adjustment. Poppins
                is the mockup's own face (confirmed by the client), which is why
                nothing has to be nudged to fit — it comes in via the `font-nav`
                utility; next/font loads it once in app/layout.tsx.

                Fitting all seven label widths against real Poppins metrics
                solves to 17.7px with -0.03em, and at a flat 17px the required
                tracking is -0.002em — i.e. zero. Every label then lands within
                2px of its design width. For contrast, the same fit against the
                site's own faces could not get below ~3px of error at any size,
                because their letterforms are simply different: the mockup's
                glyphs measure E/H=0.67 and O/H=1.44, matching Poppins (0.70 /
                1.33) but not Montserrat (0.85 / 1.28).

                Leaving tracking alone is also what restores the word spacing:
                the design's gaps are 1-2px between letters but 6-7px between
                words, and Poppins at 17px reproduces both (1.5px and 5.6-7.0px)
                on its own. Negative tracking shrinks the word gaps along with
                the letter gaps, which is what made "IDEAS LAB" read as one word.

                Weight 300 matches the mockup's stroke: its H stem rasterises at
                1px against a 13px cap, and Poppins 300 renders 1.19px at this
                size against w400's 1.55px. */}
            <span
              style={{
                /* Anchored at the icon's exact centre, then moved by the design's
                   measured offset. The percentage term picks WHICH edge of the
                   label that offset refers to, so `labelDx` stays the gap to the
                   text's inner edge and long labels grow outward, away from the
                   arc — that is what keeps "INSIGHTS BY PEOPLE FIRST" on one
                   line running off to the right instead of wrapping inward.

                   The offsets are expressed as a fraction of --nav-r rather than
                   flat px, so when the radius shrinks on short viewports the
                   labels stay pinned to their icons instead of drifting away.
                   Dividing by the design radius (224.4) makes the ratio 1 at the
                   mockup's own size. */
                left: '50%',
                top: '50%',
                transform: `translate(calc(${
                  item.side === "left" ? "-100%" : item.side === "right" ? "0%" : "-50%"
                } + ${(item.labelDx / 224.4).toFixed(4)} * var(--nav-r)), calc(-50% + ${(
                  item.labelDy / 224.4
                ).toFixed(4)} * var(--nav-r)))`,
              }}
              className={`font-nav absolute hidden w-max whitespace-nowrap text-[17px] font-light uppercase text-zinc-300/90 transition-colors group-hover:text-white lg:block ${
                item.side === "left" ? "text-right" : item.side === "right" ? "text-left" : "text-center"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
