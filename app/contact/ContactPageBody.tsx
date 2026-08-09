import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import SideNav from "@/app/components/SideNav";
import ContactPanel from "./ContactPanel";

/* Standalone page rendering of the contact panel — the non-modal fallback
   behind /contact, /partner and /training. Same <ContactPanel> the modal uses,
   just framed as a page (dark backdrop, logo, back link, the shared nav rail).

   This is what direct links, shared URLs, crawlers and no-JS clients get. */
export default function ContactPageBody({
  defaultRole,
  eyebrow,
}: {
  defaultRole?: string;
  /* Small label above the panel, e.g. "Partner with Us". */
  eyebrow?: string;
}) {
  return (
    <>
      {/* This page's backdrop is light, unlike the rest of the site. */}
      <SideNav tone="light" />

      {/* Exactly one viewport tall with nothing spilling out — the page never
          scrolls; the panel inside compresses to fit instead.
          The container padding is uniform to keep the modal perfectly centered. */}
      <div className="relative flex h-svh flex-col overflow-hidden bg-[radial-gradient(ellipse_at_center_top,#ffffff_0%,#f2f2f4_45%,#e6e5ea_100%)] px-5 py-[clamp(1rem,2.5vh,2.5rem)] sm:px-14">
        <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 lg:pt-12 xl:px-28 xl:pt-14 [@media(max-height:500px)]:pt-4">
          <Link
            href="/"
            aria-label="People First — landing"
            className="group inline-flex min-h-11 items-center"
          >
            {/* The dark-text mark, not about-page/logo.png — that one is white
                lettering for dark pages and vanishes on this light backdrop. */}
            <Image
              src="/images/logo.svg"
              alt="People First"
              width={398}
              height={100}
              priority
              className="h-10 w-auto sm:h-12 lg:h-[52px] [@media(max-height:500px)]:h-9"
            />
          </Link>
          <Link
            href="/"
            className="pf-interactive inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-zinc-600 hover:-translate-x-0.5 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </header>

        {/* min-h-0 lets this flex child actually shrink below its content's
            natural height, which is what keeps the panel inside the viewport. */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-[clamp(1rem,3vh,3.5rem)]">
          <div className="w-full max-w-[1120px]">
            {eyebrow && (
              <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-pf-magenta">
                {eyebrow}
              </p>
            )}
            <div className="animate-modal-panel overflow-hidden rounded-2xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] sm:rounded-3xl">
              <ContactPanel defaultRole={defaultRole} />
            </div>
          </div>
        </div>

        {/* Invisible spacer to balance the header height for perfect vertical centering */}
        <div className="shrink-0 h-10 sm:h-12" aria-hidden="true" />
      </div>
    </>
  );
}
