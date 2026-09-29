import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import GalleryView from "./GalleryView";
import { getFullGallery } from "@/app/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore visual moments, events, podcast studio sessions, and milestones from across the People First ecosystem.",
  alternates: {
    canonical: "/gallery",
  },
};

export default async function GalleryPage() {
  const photos = await getFullGallery();

  return (
    <>
      {/* Right vertical navbar — fixed z-[100], tone="light" for dark text against light background */}
      <SideNav tone="light" />

      <div className="relative min-h-screen overflow-x-clip bg-[linear-gradient(135deg,#eef1fb_0%,#f4f1fc_50%,#f8f6fd_100%)]">
        {/* Soft violet/cyan ambient glow, top-left */}
        <div
          aria-hidden
          className="animate-glow-pulse pointer-events-none absolute -left-32 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(100,200,230,0.22)_0%,rgba(160,120,240,0.14)_40%,transparent_70%)]"
        />

        {/* ── Header: Logo left ── */}
        <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 lg:pt-12 xl:px-28 xl:pt-14 [@media(max-height:500px)]:pt-4">
          <Link
            href="/"
            aria-label="People First — landing"
            className="group inline-flex min-h-11 items-center"
          >
            <Image
              src="/images/logo.svg"
              alt="People First"
              width={398}
              height={100}
              priority
              className="h-10 w-auto sm:h-12 lg:h-[52px] [@media(max-height:500px)]:h-9"
            />
          </Link>
        </header>

        {/* ── Hero Banner ── */}
        <section className="relative mx-auto max-w-[1600px] px-6 pb-12 pt-10 sm:px-10 sm:pb-16 sm:pt-14 lg:px-24 xl:px-28">
          {/* Subtle floating paper planes decoration, matching the site artwork */}
          <Image
            src="/images/icons/left-plane.png"
            alt=""
            aria-hidden
            width={379}
            height={340}
            className="animate-floaty pointer-events-none absolute -left-4 top-6 z-0 hidden h-20 w-auto select-none opacity-50 sm:block lg:h-28"
          />
          <Image
            src="/images/icons/right-plane.png"
            alt=""
            aria-hidden
            width={358}
            height={302}
            style={{ animationDelay: "-2.5s" }}
            className="animate-floaty pointer-events-none absolute right-12 top-10 z-0 hidden h-16 w-auto select-none opacity-50 sm:block lg:h-24"
          />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#150065] sm:text-sm">
              Visual Chronicles
            </span>
            <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-black sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              OUR <span className="text-[#150065]">GALLERY</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#4e648c] sm:text-lg lg:text-xl">
              Moments, events, and milestones from across the People First
              ecosystem — from studio conversations and leadership podcasts to
              partner roundtables and conferences.
            </p>
          </div>
        </section>

        {/* ── Main Gallery Section ── */}
        <main className="relative z-10 mx-auto max-w-[1600px] px-6 pb-28 sm:px-10 lg:px-24 xl:px-28">
          <GalleryView photos={photos} />
        </main>

        {/* ── Footer ── */}
        <SiteFooter showCta={true} />
      </div>
    </>
  );
}
