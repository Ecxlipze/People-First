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
      <SideNav />

      {/* pr on lg+ keeps the panel clear of the fixed nav rail */}
      <div className="relative flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_center_top,#2a2a30_0%,#141417_45%,#0b0b0d_100%)] px-6 py-8 sm:px-14 sm:py-10 lg:pr-32">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" aria-label="People First — landing">
            <Image
              src="/images/about-page/logo.png"
              alt="People First"
              width={318}
              height={91}
              priority
              className="h-10 w-auto sm:h-12"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-14">
          <div className="w-full max-w-5xl">
            {eyebrow && (
              <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-pf-magenta">
                {eyebrow}
              </p>
            )}
            <div className="overflow-hidden rounded-xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]">
              <ContactPanel defaultRole={defaultRole} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
