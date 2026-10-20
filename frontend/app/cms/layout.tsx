import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { hasSession } from "@/app/cms/session";
import { logoutAction } from "@/app/cms/actions";
import CmsNav from "@/app/cms/CmsNav";

/* The editors' workspace: never indexed, not linked from the public site. */
export const metadata: Metadata = {
  title: { absolute: "Content Studio | People First" },
  robots: { index: false, follow: false },
};

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await hasSession();

  return (
    <div className="min-h-svh bg-[#f7f4fb] text-zinc-900">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-[100rem] flex-wrap items-center justify-between gap-x-4 px-4 sm:px-5 lg:flex-nowrap lg:px-8">
          <Link href="/cms" className="inline-flex min-h-11 shrink-0 items-center gap-3">
            <Image src="/images/logo.svg" alt="People First" width={398} height={100} priority className="h-8 w-auto" />
            <span className="hidden border-l border-zinc-300 pl-3 font-display text-sm font-extrabold uppercase tracking-wider text-[#a02f52] sm:inline">
              Content Studio
            </span>
          </Link>
          {signedIn && (
            <div className="order-3 -mx-1 w-full lg:order-none lg:mx-0 lg:w-auto">
              <CmsNav />
            </div>
          )}
          {signedIn && (
            <div className="flex items-center gap-2">
              <Link
                href="/media-events"
                target="_blank"
                className="hidden min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-zinc-600 hover:text-zinc-950 sm:inline-flex"
              >
                View site
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
                >
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-[100rem] px-4 py-8 sm:px-5 lg:px-8">{children}</main>
    </div>
  );
}
