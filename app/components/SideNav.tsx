"use client";

import { useEffect, useRef, useState } from "react";
import Link, { useLinkStatus } from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { navItems } from "@/app/lib/nav";

/* A ring that spins around the nav icon while its route is being fetched.
   Must be rendered inside a <Link> — that's where useLinkStatus reads from.

   Most navigations here are prefetched and resolve instantly, in which case
   `pending` never flips and nothing is shown. This is the honest signal for the
   slow case (cold cache, poor connection) so a tap doesn't feel ignored.

   Rendered always-present and toggled by opacity: an element appearing from
   nothing would shift the icon it sits on. */
function NavPending() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute -inset-1 rounded-full border-2 border-pf-magenta/70 border-t-transparent transition-opacity duration-150 ${
        pending ? "animate-spin opacity-100" : "opacity-0"
      }`}
    />
  );
}

const DESKTOP_MIN = 1024; // Tailwind `lg`
const EDGE_ZONE = 40; // px from the right edge that can start an opening drag
const AXIS_LOCK = 8; // px of travel before we commit to horizontal vs vertical

export default function SideNav({
  /* Most pages are dark, so the rail's lg+ labels default to a light grey. On a
     light page (e.g. /contact) that grey disappears — `tone="light"` swaps in
     dark label text. Only affects the lg+ rail: the mobile drawer labels sit on
     their own opaque chips and read fine either way. */
  tone = "dark",
}: {
  tone?: "dark" | "light";
} = {}) {
  const pathname = usePathname();
  const onLight = tone === "light";
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  // Live drag state. `x` is the offset in px (0 = fully open, w = fully
  // closed) and `w` the drawer width it's measured against. null = not
  // dragging. Width lives here (not just in the gesture ref) so render can
  // derive the backdrop opacity without reading a ref mid-render.
  const [drag, setDrag] = useState<{ x: number; w: number } | null>(null);

  // Mutable gesture bookkeeping
  const g = useRef({
    active: false,
    axis: "" as "" | "h" | "v",
    startX: 0,
    startY: 0,
    base: 0,
    width: 0,
    tx: 0,
  });

  // Close whenever the route changes. Done as a render-phase adjustment
  // (React's "adjusting state when a prop changes" pattern) rather than an
  // effect, so the drawer is never painted open on the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
    if (drag) setDrag(null);
  }

  // `open` is read inside long-lived listeners; mirror it into a ref so the
  // gesture effect can register once instead of re-subscribing on every change.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Track the lg breakpoint so we only trap focus in the drawer on mobile —
  // on desktop the rail is always on screen and must stay tabbable.
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Lock background scrolling while the drawer is open (mobile only).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (window.innerWidth >= DESKTOP_MIN) return;
      const t = e.touches[0];
      const isOpen = openRef.current;
      const width = navRef.current?.offsetWidth || 280;
      const canOpen = !isOpen && t.clientX > window.innerWidth - EDGE_ZONE;
      if (!canOpen && !isOpen) return;
      g.current = {
        active: true,
        axis: "",
        startX: t.clientX,
        startY: t.clientY,
        base: isOpen ? 0 : width,
        width,
        tx: isOpen ? 0 : width,
      };
    };

    const onMove = (e: TouchEvent) => {
      const s = g.current;
      if (!s.active) return;
      const t = e.touches[0];
      const dx = t.clientX - s.startX;
      const dy = t.clientY - s.startY;

      if (s.axis === "") {
        if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
        s.axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
        // Vertical intent → let the page scroll; abandon the gesture.
        if (s.axis === "v") {
          s.active = false;
          setDrag(null);
          return;
        }
      }

      if (s.axis === "h") {
        e.preventDefault();
        const tx = Math.max(0, Math.min(s.width, s.base + dx));
        s.tx = tx;
        setDrag({ x: tx, w: s.width });
      }
    };

    const onEnd = () => {
      const s = g.current;
      // Only a committed horizontal drag decides open/closed.
      if (s.active && s.axis === "h") {
        setOpen(s.tx < s.width / 2);
      }
      s.active = false;
      s.axis = "";
      setDrag(null);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const dragging = drag !== null;
  const backdropOpacity = drag
    ? Math.max(0, Math.min(1, (drag.w - drag.x) / (drag.w || 1)))
    : open
      ? 1
      : 0;

  return (
    <>
      {/* pull tab — affordance to open (hidden on desktop and while open/dragging) */}
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`pf-interactive fixed right-0 top-1/2 z-[100] min-h-11 min-w-11 -translate-y-1/2 rounded-l-xl bg-white/90 py-3 pl-2 pr-1 text-zinc-700 shadow-md ring-1 ring-black/10 backdrop-blur-md lg:hidden ${
          open || dragging ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* backdrop — opacity tracks the drag; tap to close */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        style={{ opacity: backdropOpacity }}
        className={`fixed inset-0 z-[95] bg-black/30 backdrop-blur-[2px] lg:hidden ${
          dragging ? "" : "transition-opacity duration-300"
        } ${backdropOpacity > 0 ? "" : "pointer-events-none"}`}
      />

      {/* nav panel: off-canvas drawer below lg, static floating rail on lg+ */}
      <nav
        ref={navRef}
        aria-label="Primary"
        /* Closed off-canvas drawer must not be reachable by keyboard or
           screen readers; the desktop rail always stays interactive. */
        inert={!isDesktop && !open && !dragging}
        style={{ translate: drag ? `${drag.x}px 0` : undefined }}
        className={`fixed right-0 top-0 z-[100] flex h-dvh max-w-[85vw] flex-col overflow-y-auto overscroll-contain rounded-l-2xl bg-transparent pb-[max(1.25rem,env(safe-area-inset-bottom))] pl-6 pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(1.25rem,env(safe-area-inset-top))] lg:right-8 xl:right-12 lg:top-1/2 lg:h-auto lg:max-w-none lg:overflow-visible lg:rounded-none lg:p-0 ${
          dragging ? "" : "transition-[translate] duration-300 ease-out"
        } ${
          dragging
            ? ""
            : open
              ? "[translate:0_0]"
              : "[translate:100%_0] lg:[translate:0_-50%]"
        }`}
      >
        {/* Auto block margins centre the items when height allows, but collapse
            to zero when a short landscape viewport needs scrolling. */}
        {/* `key` on `open` remounts the list each time the drawer opens, which
            restarts the per-item entrance animation below. Cheap: it is seven
            links, and only on mobile where the drawer exists. */}
        <div key={isDesktop ? "rail" : `drawer-${open}`} className="my-auto flex flex-col gap-4">
          {navItems.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                /* Mobile drawer only: items cascade in behind the sliding panel
                   so opening reads as a considered reveal rather than a block of
                   icons arriving at once. Keyed on `open` (below) so it replays
                   each time the drawer opens. On lg+ the rail is always present,
                   so there is nothing to animate — hence lg:animate-none. */
                /* gap-5 on lg: HOME1.pdf puts the label text ending at x=1704
                   with the icon centred near x=1812 on a 1920 frame, i.e. a
                   clear ~40pt gap between chip and icon rather than the tight
                   gap-3 (QA footer note: "padding issues.. also check the other
                   icons as well"). */
                className={`group flex animate-fade-in-up items-center justify-end gap-3 rounded-full focus-visible:outline-offset-4 lg:animate-none lg:gap-3 ${
                  active ? "lg:my-2" : ""
                }`}
                style={{ animationDelay: `${i * 45}ms`, animationDuration: "420ms" }}
              >
              {/* Label chip. Light, brand-tinted surface instead of a heavy
                  black slab; the active item carries the magenta CTA colour.
                  On the lg+ rail it's revealed on hover/focus only (including
                  the active item) so the rail stays a clean row of icons — but
                  it stays visible in the mobile drawer, where there's no hover
                  and the icons alone wouldn't be identifiable. */}
              <span
                aria-hidden
                className={`pointer-events-none whitespace-nowrap transition-all duration-200 uppercase tracking-wider lg:text-[13px] lg:opacity-100 lg:translate-x-0 lg:bg-transparent lg:shadow-none lg:ring-0 ${
                  active
                    ? "lg:font-black lg:text-black max-lg:bg-pf-magenta/15 max-lg:text-pf-magenta-dark max-lg:ring-pf-magenta/30 max-lg:opacity-100 max-lg:translate-x-0"
                    : `lg:font-medium ${onLight ? "lg:text-zinc-600" : "lg:text-[#b0b5c5]"} max-lg:bg-white/90 max-lg:text-zinc-700 max-lg:ring-black/5 max-lg:opacity-0 max-lg:-translate-x-1 max-lg:group-hover:opacity-100 max-lg:group-hover:translate-x-0`
                } max-lg:hidden lg:block`}
              >
                {item.label}
              </span>
              {/* Wrapper is the positioning context for the pending ring and
                  keeps the icon's own scale transition independent of it. */}
              <span className="relative flex shrink-0 items-center justify-center">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={64}
                  height={64}
                  priority
                  className={`shrink-0 rounded-full transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${
                    active
                      ? "h-14 w-14 shadow-xl shadow-rose-900/30 ring-2 ring-rose-500/40 lg:h-[50px] lg:w-[50px]"
                      : "h-11 w-11 opacity-90 group-hover:opacity-100 lg:h-10 lg:w-10"
                  }`}
                />
                <NavPending />
              </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
