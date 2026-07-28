import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SideNav from "@/app/components/SideNav";

export default function PageShell({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      {/* shared right-hand icon rail — the same nav every other page carries.
          Rendered outside the page wrapper so nothing can clip it. */}
      <SideNav />

      {/* pr on lg+ keeps the centred copy clear of the fixed rail */}
      <div className="relative flex min-h-svh flex-col bg-[radial-gradient(ellipse_at_center_top,#2a2a30_0%,#141417_45%,#0b0b0d_100%)] px-6 py-8 sm:px-14 sm:py-10 lg:pr-32">
        <Link
          href="/"
          className="pf-interactive inline-flex min-h-11 w-fit items-center gap-2 rounded-sm text-sm text-zinc-400 hover:-translate-x-0.5 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="animate-fade-in-up flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold text-white sm:text-6xl">{title}</h1>
          <div className="mt-4 max-w-xl text-zinc-400">{children}</div>
        </div>
      </div>
    </>
  );
}
