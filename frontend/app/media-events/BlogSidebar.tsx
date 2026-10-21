import Link from "next/link";
import Image from "next/image";
import { SOCIALS } from "@/app/components/SiteFooter";
import { formatPostDate } from "@/app/media-events/ArticleChrome";

/* Right-hand rail shared by the blog index and the article page: the newest
   posts and the social links. Layout mirrors a news-portal sidebar — a small
   underlined heading over a stack of compact items. */

export type SidebarPost = {
  slug?: string;
  title: string;
  image?: string;
  imageAlt: string;
  publishedAt?: string;
};

function Heading({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2
      id={id}
      className="border-b border-zinc-200 pb-3 font-display text-xl font-extrabold tracking-tight text-[#171922] after:mt-3 after:block after:h-0.5 after:w-14 after:bg-[#a02f52]"
    >
      {children}
    </h2>
  );
}

/* Sticky on large screens. It is capped at the window height and scrolls
   inside itself when taller, so a short window never clips the lower sections
   (the 4 latest posts normally fit without scrolling). */
export default function BlogSidebar({
  posts,
  currentSlug,
}: {
  posts: SidebarPost[];
  currentSlug?: string;
}) {
  /* Only posts with an article page can be linked; the local fallback rows
     have none, so the section simply disappears for them. */
  const latest = posts.filter((p) => p.slug && p.slug !== currentSlug).slice(0, 4);

  return (
    <aside aria-label="Sidebar" className="space-y-8 lg:sticky lg:top-6 lg:max-h-[calc(100svh-3rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:p-1 lg:-m-1">
      {latest.length > 0 && (
        <section aria-labelledby="sb-latest">
          <Heading id="sb-latest">Latest Posts</Heading>
          <ul className="mt-5 space-y-5">
            {latest.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/media-events/${p.slug}`}
                  className="group flex items-start gap-4"
                >
                  <span className="relative block h-[4.5rem] w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.imageAlt}
                        fill
                        sizes="6rem"
                        className="object-cover"
                      />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-3 break-words font-display text-sm font-bold leading-snug text-[#171922] group-hover:text-[#c64047]">
                      {p.title}
                    </span>
                    {p.publishedAt && (
                      <time
                        dateTime={p.publishedAt}
                        className="mt-1 block text-xs text-zinc-500"
                      >
                        {formatPostDate(p.publishedAt)}
                      </time>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="sb-follow">
        <Heading id="sb-follow">Follow Us</Heading>
        <ul className="mt-5 grid grid-cols-2 gap-3">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="pf-interactive flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#a02f52]/30 bg-white px-3 font-display text-sm font-bold text-[#a02f52] transition-colors hover:border-[#a02f52] hover:bg-[#a02f52] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a02f52]"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
