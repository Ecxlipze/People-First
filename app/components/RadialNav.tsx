import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/app/lib/nav";

export default function RadialNav() {
  return (
    <nav
      aria-label="Explore"
      /* --nav-r is the icon-arc radius; `top` is the arc's origin. Both come from
         Landing Page.pdf (1440×1024): the fitted origin is y=466 → 45.5% of the
         frame, with r=222px. The origin used to be 58%, which put the whole arc
         ~64px lower than the design at every angle. Below lg the labels are
         hidden and the arc is tighter, so it stays lower to clear the wordmark. */
      className="pointer-events-none absolute left-1/2 top-[58%] h-0 w-0 -translate-x-1/2 [--nav-r:120px] sm:[--nav-r:180px] lg:top-[45.5svh] lg:[--nav-r:222px] [@media(max-height:500px)]:[--nav-r:90px]"
    >
      {navItems.map((item, i) => {
        const rad = (item.angle * Math.PI) / 180;
        const sin = Math.sin(rad).toFixed(4);
        const cos = (-Math.cos(rad)).toFixed(4);

        /* Labels sit on a circle CONCENTRIC with the icon arc, at the same
           angle, one step further out — that is how the mockup is built. Fitting
           the label anchors in Landing Page.pdf gives r≈285px against the icons'
           222px, i.e. a ~63px radial outset (≈0.28 × the icon radius), which is
           what produces the design's characteristic "labels drift upward as the
           arc rises" look: +70px above its icon at HOME, tapering to level by
           IDEAS LAB. Deriving it from the angle reproduces that automatically
           instead of hand-tuning seven offsets, and it keeps working at every
           --nav-r breakpoint. */
        /* Label inner edges in the mockup sit at ~1.29× the icon radius from the
           arc origin (measured per item: 1.21–1.34, mean 1.288 — the scatter is
           hand-placement in Figma, not a rule). The label box is anchored at the
           icon's centre, so the outset needed is that ratio minus 1. */
        const labelOut = 0.29;
        const labelX = (Math.sin(rad) * labelOut).toFixed(4);
        const labelY = (-Math.cos(rad) * labelOut).toFixed(4);

        /* Anchor + self-centring are folded into one `translate` below, because
           mixing Tailwind's -translate-* utilities with an inline `translate`
           would have the two fight over the same property. */
        const labelPlacement =
          item.side === "center"
            ? { anchor: "left-1/2 bottom-full", self: "-50%, 0%" }
            : item.side === "left"
              ? { anchor: "right-0 top-1/2 text-right", self: "0%, -50%" }
              : { anchor: "left-0 top-1/2 text-left", self: "0%, -50%" };

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
              /* ~34px at lg to match the mockup's icon diameter (measured off
                 the 1440-wide frame); the 44px Link box around it keeps the tap
                 target accessible while the glyph itself matches the design. */
              className="h-10 w-10 drop-shadow-[0_0_0_rgba(43,191,196,0)] transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:drop-shadow-[0_0_14px_rgba(43,191,196,0.65)] sm:h-11 sm:w-11 lg:h-[34px] lg:w-[34px]"
            />
            {/* Labels must never wrap: "INSIGHTS BY PEOPLE FIRST" is the
                longest one and sits at the far right of the arc, where it was
                breaking onto a second line ("PEOPLE FIRST" dropping under
                "INSIGHTS BY"). `whitespace-nowrap` alone wasn't enough because
                the nav is a 0×0 box — the label's containing block gave it no
                width to work with, so it wrapped against the viewport edge.
                `w-max` lets it size to its own content instead. */}
            <span
              style={{
                /* Self-centring offset first, then the radial outset along this
                   item's own angle (see labelOut). The left/right anchor pins
                   the label's inner edge, so text grows away from the arc. */
                transform: `translate(${labelPlacement.self}) translate(calc(${labelX} * var(--nav-r)), calc(${labelY} * var(--nav-r)))`,
              }}
              className={`absolute hidden w-max whitespace-nowrap text-[0.9375rem] font-light uppercase tracking-[0.06em] text-zinc-300/90 transition-colors group-hover:text-white lg:block ${labelPlacement.anchor}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
