import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";

export type LegalSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type LegalPath = "/privacy" | "/terms" | "/cookies";

const LEGAL_PAGES: { label: string; href: LegalPath }[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export function LegalPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline rounded-sm bg-pf-lavender px-1.5 py-0.5 font-display text-[0.92em] font-semibold text-pf-purple ring-1 ring-pf-purple/15 [box-decoration-break:clone]">
      {children}
    </span>
  );
}

export default function LegalPageLayout({
  title,
  summary,
  currentPath,
  sections,
}: {
  title: string;
  summary: string;
  currentPath: LegalPath;
  sections: LegalSection[];
}) {
  return (
    <>
      {/* Keep the fixed rail outside the clipped page wrapper so it remains
          viewport-positioned, matching the shared internal-page architecture. */}
      <SideNav tone="light" />

      <div className="relative overflow-x-clip bg-[#fbfafc] text-zinc-950">
        <main>
          <div className="border-b border-pf-purple/10 bg-[linear-gradient(135deg,#ffffff_0%,#f7f1fa_55%,#eee8fb_100%)]">
            <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 lg:pt-12 xl:px-28 xl:pt-14 [@media(max-height:500px)]:pt-4">
              <Link
                href="/"
                aria-label="People First — home"
                className="group pf-interactive inline-flex min-h-11 items-center rounded-sm focus-visible:outline-offset-4"
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
              <Link
                href="/home"
                className="pf-interactive inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-zinc-600 hover:-translate-x-0.5 hover:text-pf-purple focus-visible:outline-offset-4"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to site
              </Link>
            </header>

            <div className="mx-auto w-full max-w-[1600px] px-6 pb-12 pt-6 sm:px-10 sm:pb-16 sm:pt-10 lg:pb-20 lg:pl-24 lg:pr-32 xl:pl-28 xl:pr-36">
              <div className="max-w-[900px]">
                <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-pf-magenta-dark sm:text-sm">
                  Legal information
                </p>
                <h1 className="mt-4 max-w-[820px] font-display text-4xl leading-[1.08] tracking-tight text-pf-purple sm:text-5xl lg:text-[3.5rem]">
                  {title}
                </h1>
                <p className="mt-6 max-w-[780px] font-sans text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8">
                  {summary}
                </p>

                <dl className="mt-8 grid max-w-[780px] gap-3 border-t border-pf-purple/15 pt-6 text-sm text-zinc-700 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <dt className="font-display font-semibold text-zinc-950">
                      Effective date
                    </dt>
                    <dd className="mt-1">
                      <LegalPlaceholder>[Effective date required]</LegalPlaceholder>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-display font-semibold text-zinc-950">
                      Website operator
                    </dt>
                    <dd className="mt-1">
                      <LegalPlaceholder>
                        [Company legal name required]
                      </LegalPlaceholder>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[1600px] px-6 py-12 sm:px-10 sm:py-16 lg:py-20 lg:pl-24 lg:pr-32 xl:pl-28 xl:pr-36">
            <nav
              aria-label="Legal pages"
              className="mb-12 flex flex-wrap gap-2 border-b border-zinc-200 pb-6"
            >
              {LEGAL_PAGES.map((page) => {
                const active = page.href === currentPath;
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    aria-current={active ? "page" : undefined}
                    className={`pf-interactive inline-flex min-h-11 items-center rounded-full px-5 py-2 text-sm font-semibold focus-visible:outline-offset-4 ${
                      active
                        ? "bg-pf-purple text-white"
                        : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:-translate-y-0.5 hover:text-pf-purple hover:ring-pf-purple/30"
                    }`}
                  >
                    {page.label}
                  </Link>
                );
              })}
            </nav>

            <div className="grid items-start gap-12 xl:grid-cols-[230px_minmax(0,820px)] xl:gap-16">
              <aside className="rounded-xl border border-pf-purple/10 bg-white p-5 shadow-[0_14px_40px_-32px_rgba(73,21,87,0.45)] xl:sticky xl:top-8">
                <p className="font-display text-sm font-bold text-pf-purple">
                  On this page
                </p>
                <nav aria-label={`${title} sections`}>
                  <ol className="mt-3 space-y-1">
                    {sections.map((section, index) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="pf-interactive flex min-h-11 items-center gap-3 rounded-md px-2 py-2 text-sm leading-5 text-zinc-600 hover:bg-pf-lavender/60 hover:text-pf-purple focus-visible:outline-offset-2"
                        >
                          <span
                            aria-hidden
                            className="w-5 shrink-0 font-display text-xs font-semibold text-pf-magenta-dark"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{section.title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>

              <article className="min-w-0 max-w-[820px]">
                <div className="mb-10 rounded-xl border-l-4 border-pf-magenta bg-pf-lavender/55 px-5 py-5 text-sm leading-6 text-zinc-700 sm:px-6">
                  <p>
                    This draft intentionally identifies details that need
                    company or legal confirmation. Highlighted bracketed text
                    must be completed before this policy is treated as final.
                  </p>
                </div>

                <div className="space-y-12 sm:space-y-14">
                  {sections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-8 border-b border-zinc-200 pb-12 last:border-b-0 last:pb-0 sm:pb-14"
                    >
                      <h2 className="font-display text-2xl leading-tight tracking-tight text-pf-purple sm:text-[1.75rem]">
                        {section.title}
                      </h2>
                      <div className="mt-5 space-y-4 break-words font-sans text-base leading-7 text-zinc-700 [overflow-wrap:anywhere] sm:text-[1.0625rem] sm:leading-8 [&_a]:font-semibold [&_a]:text-pf-purple [&_a]:underline [&_a]:decoration-pf-magenta/50 [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:hover:text-pf-magenta-dark [&_a]:focus-visible:rounded-sm [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-pf-magenta [&_li]:pl-1 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_strong]:font-display [&_strong]:font-semibold [&_strong]:text-zinc-950 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2">
                        {section.content}
                      </div>
                    </section>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </main>

        <SiteFooter showCta={false} />
      </div>
    </>
  );
}
