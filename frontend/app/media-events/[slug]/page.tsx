import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import BlogHeader, { BLOG_PAGE_BG, formatPostDate } from "@/app/media-events/ArticleChrome";
import BlogSidebar from "@/app/media-events/BlogSidebar";
import ShareButtons from "@/app/media-events/ShareButtons";
import ViewBeacon from "@/app/media-events/ViewBeacon";
import { formatViews } from "@/app/lib/format";
import { getBlogPost, getBlogPosts, type BlogPost } from "@/app/lib/content/blog";
import { absoluteSiteUrl, createPageMetadata, serializeJsonLd } from "@/app/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  const metadata = createPageMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription,
    path: `/media-events/${post.slug}`,
    image: post.image ? { url: post.image, alt: post.imageAlt || post.title } : undefined,
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteSiteUrl(`/media-events/${post.slug}#article`),
    url: absoluteSiteUrl(`/media-events/${post.slug}`),
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    mainEntityOfPage: absoluteSiteUrl(`/media-events/${post.slug}`),
    isPartOf: { "@id": absoluteSiteUrl("/#website") },
    ...(post.image ? { image: [absoluteSiteUrl(post.image)] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@id": absoluteSiteUrl("/#organization") },
    publisher: { "@id": absoluteSiteUrl("/#organization") },
  };

  /* Up to three other posts, same category first, so the reader has somewhere
     to go next. The listing is the same cached request the index uses. */
  const others = (await getBlogPosts()).filter((p) => p.slug !== post.slug);
  const related = [
    ...others.filter((p) => p.category?.slug === post.category?.slug),
    ...others.filter((p) => p.category?.slug !== post.category?.slug),
  ].slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <SideNav />
      <ViewBeacon slug={post.slug} />
      <div className={BLOG_PAGE_BG}>
        <BlogHeader />
        <main className="px-5 pb-24 pt-6 sm:px-8 lg:pl-16 lg:pr-24 xl:pl-24">
          <div className="mx-auto grid max-w-[80rem] gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="min-w-0">
              <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
                <ol className="flex flex-wrap items-center gap-x-2">
                  <li>
                    <Link href="/" className="inline-flex min-h-11 items-center hover:text-[#c64047]">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li>
                    <Link href="/media-events" className="inline-flex min-h-11 items-center hover:text-[#c64047]">
                      Media / Events
                    </Link>
                  </li>
                  {post.category && (
                    <>
                      <li aria-hidden>/</li>
                      <li>{post.category.name}</li>
                    </>
                  )}
                </ol>
              </nav>

              <article>
                <header>
                  {post.category && (
                    <span className="inline-block rounded-sm bg-[#a02f52] px-3 py-1 font-display text-xs font-bold text-white">
                      {post.category.name}
                    </span>
                  )}
                  <h1 className="mt-4 break-words font-display text-3xl font-extrabold leading-[1.15] tracking-tight text-[#171922] sm:text-4xl lg:text-[2.6rem]">
                    {post.title}
                  </h1>
                  {post.excerpt && (
                    <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500">
                    <span
                      aria-hidden
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#171922] font-display text-sm font-bold text-white"
                    >
                      {(post.author || "People First").charAt(0).toUpperCase()}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-display font-bold text-[#171922]">
                        {post.author || "People First"}
                      </span>
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                      )}
                      <span>{post.readingMinutes} min read</span>
                      {formatViews(post.viewCount) && <span>{formatViews(post.viewCount)}</span>}
                    </div>
                  </div>
                  <div className="mt-5">
                    <ShareButtons variant="bar" title={post.title} url={absoluteSiteUrl(`/media-events/${post.slug}`)} />
                  </div>
                </header>

                {post.image && (
                  <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-md bg-zinc-100">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 92vw, 52rem"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Server-sanitised HTML from the admin editor (see backend blog/models.py). */}
                <div
                  className="pf-prose mt-10"
                  dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                />

                {post.author && (
                  <div className="mt-10 flex items-center gap-4 rounded-md bg-white p-5 shadow-[0_14px_36px_-24px_rgba(80,80,120,0.35)]">
                    <span
                      aria-hidden
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#171922] font-display text-xl font-bold text-white"
                    >
                      {post.author.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Written by</p>
                      <p className="font-display text-lg font-extrabold text-[#171922]">{post.author}</p>
                    </div>
                  </div>
                )}
              </article>

              {related.length > 0 && <MorePosts posts={related} />}
            </div>

            <BlogSidebar
              currentSlug={post.slug}
              posts={others.map((p) => ({
                slug: p.slug,
                title: p.title,
                image: p.image,
                imageAlt: p.imageAlt,
                publishedAt: p.publishedAt,
              }))}
            />
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

function MorePosts({ posts }: { posts: BlogPost[] }) {
  return (
    <section aria-labelledby="more-posts" className="mt-16">
      <h2
        id="more-posts"
        className="border-b border-zinc-200 pb-3 font-display text-xl font-extrabold tracking-tight text-[#171922] after:mt-3 after:block after:h-0.5 after:w-14 after:bg-[#a02f52]"
      >
        Related Posts
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/media-events/${p.slug}`}
            className="group pf-card flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_14px_36px_-22px_rgba(80,80,120,0.3)]"
          >
            <div className="relative aspect-[16/10] w-full bg-zinc-200">
              {p.image && (
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 20rem"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              {p.category && (
                <span className="font-display text-xs font-extrabold uppercase tracking-wider text-[#a02f52]">
                  {p.category.name}
                </span>
              )}
              <h3 className="break-words font-display text-lg font-extrabold leading-snug text-[#171922] group-hover:text-[#c64047]">
                {p.title}
              </h3>
              <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-2 font-display text-sm font-bold text-[#a02f52]">
                Read article
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
