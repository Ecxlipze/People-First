import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import BlogHeader, { BLOG_PAGE_BG, formatPostDate } from "@/app/blog/BlogHeader";
import { getBlogCategories, getBlogPosts } from "@/app/lib/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, stories, and ideas from People First.",
  alternates: { canonical: "/blog" },
};

const PER_PAGE = 9;

function href(category?: string, page?: number): string {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  if (page && page > 1) q.set("page", String(page));
  const s = q.toString();
  return s ? `/blog?${s}` : "/blog";
}

const chip =
  "pf-interactive inline-flex min-h-11 items-center rounded-full border px-5 font-display text-sm font-bold transition-colors";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page: pageParam } = await searchParams;
  const [allPosts, categories] = await Promise.all([getBlogPosts(), getBlogCategories()]);

  const posts = category ? allPosts.filter((p) => p.category?.slug === category) : allPosts;
  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const page = Math.min(Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1), totalPages);
  const visible = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <SideNav />
      <div className={BLOG_PAGE_BG}>
        <BlogHeader />
        <main className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-12 sm:px-10 lg:px-24 lg:pr-36 xl:px-28 xl:pr-36">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-[#171922] sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 max-w-xl text-zinc-600">
            Articles, stories, and ideas from the People First team.
          </p>

          {categories.length > 0 && (
            <nav aria-label="Blog categories" className="mt-8 flex flex-wrap gap-2">
              <Link
                href="/blog"
                aria-current={!category ? "page" : undefined}
                className={`${chip} ${!category ? "border-transparent bg-[#a02f52] text-white" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"}`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={href(c.slug)}
                  aria-current={category === c.slug ? "page" : undefined}
                  className={`${chip} ${category === c.slug ? "border-transparent bg-[#a02f52] text-white" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"}`}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          )}

          {visible.length === 0 ? (
            <p className="mt-16 rounded-2xl bg-white/70 px-6 py-16 text-center text-zinc-600">
              {category ? "No posts in this category yet." : "New posts are on the way."}
            </p>
          ) : (
            <ul className="mt-12 grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((post, i) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group pf-card flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_-24px_rgba(45,6,75,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a02f52]"
                  >
                    <div className="relative aspect-video w-full bg-zinc-100">
                      {post.image && (
                        <Image
                          src={post.image}
                          alt={post.imageAlt}
                          fill
                          priority={i === 0}
                          sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 30vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
                        {post.category && <span className="text-[#a02f52]">{post.category.name}</span>}
                        {post.publishedAt && (
                          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                        )}
                      </div>
                      <h2 className="mt-3 break-words font-display text-xl font-extrabold leading-snug text-[#171922] transition-colors group-hover:text-[#c64047]">
                        {post.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-600">
                        {post.excerpt}
                      </p>
                      <span className="mt-auto pt-5 text-xs font-bold text-zinc-500">
                        {post.readingMinutes} min read
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav aria-label="Blog pages" className="mt-14 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={href(category, n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`pf-interactive grid h-11 w-11 place-items-center rounded-lg border font-display text-sm font-bold ${n === page ? "border-transparent bg-pf-magenta text-white" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"}`}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
