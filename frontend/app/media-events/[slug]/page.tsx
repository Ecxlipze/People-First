import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import BlogHeader, { BLOG_PAGE_BG, formatPostDate } from "@/app/media-events/ArticleChrome";
import { getBlogPost } from "@/app/lib/content/blog";
import { getBaseUrl } from "@/app/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/media-events/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle,
      description: post.metaDescription,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.image ? [{ url: post.image, alt: post.imageAlt }] : undefined,
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
    headline: post.title,
    description: post.metaDescription,
    mainEntityOfPage: `${getBaseUrl()}/media-events/${post.slug}`,
    ...(post.image ? { image: [post.image] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt,
    ...(post.author ? { author: { "@type": "Person", name: post.author } } : {}),
    publisher: { "@type": "Organization", name: "People First" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        /* "<" escaped so a post title can never close the script tag */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SideNav />
      <div className={BLOG_PAGE_BG}>
        <BlogHeader />
        <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-10 sm:px-10 lg:pr-24">
          <Link
            href="/media-events"
            className="pf-interactive inline-flex min-h-11 items-center gap-2 font-display text-sm font-bold text-[#a02f52] hover:text-[#c64047]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Media / Events
          </Link>

          <article className="mt-4">
            <header>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
                {post.category && (
                  <span className="text-[#a02f52]">{post.category.name}</span>
                )}
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                )}
                <span>{post.readingMinutes} min read</span>
                {post.author && <span>By {post.author}</span>}
              </div>
              <h1 className="mt-4 break-words font-display text-3xl font-extrabold leading-tight text-[#171922] sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
            </header>

            {post.image && (
              <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 92vw, 48rem"
                  className="object-cover"
                />
              </div>
            )}

            {/* Server-sanitised HTML from the admin editor (see backend blog/models.py). */}
            <div
              className="pf-prose mt-10"
              dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
            />
          </article>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
