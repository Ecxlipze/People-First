import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/app/lib/nav";

export default function RadialNav() {
  return (
    <nav
      aria-label="Explore"
      className="pointer-events-none absolute left-1/2 top-[58%] h-0 w-0 -translate-x-1/2 [--nav-r:120px] sm:[--nav-r:180px] lg:[--nav-r:290px]"
    >
      {navItems.map((item, i) => {
        const rad = (item.angle * Math.PI) / 180;
        const sin = Math.sin(rad).toFixed(4);
        const cos = (-Math.cos(rad)).toFixed(4);

        const labelPlacement =
          item.side === "center"
            ? "bottom-full mb-3 left-1/2 -translate-x-1/2"
            : item.side === "left"
              ? "right-full mr-4 top-1/2 -translate-y-1/2 text-right"
              : "left-full ml-4 top-1/2 -translate-y-1/2 text-left";

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            className="animate-pop-in pointer-events-auto group absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-11 sm:w-11"
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
              className="h-9 w-9 drop-shadow-[0_0_0_rgba(43,191,196,0)] transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:drop-shadow-[0_0_14px_rgba(43,191,196,0.65)] sm:h-11 sm:w-11"
            />
            <span
              className={`absolute hidden whitespace-nowrap text-sm tracking-wide text-zinc-300 transition-colors group-hover:text-white lg:block ${labelPlacement}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
