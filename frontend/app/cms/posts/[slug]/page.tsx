import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ApiError } from "@/app/lib/api";
import { cmsFetch, getDisplayName, getRole, requireSession } from "@/app/cms/session";
import PostForm from "@/app/cms/posts/PostForm";
import type { CmsCategory, CmsPost } from "@/app/cms/types";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { slug } = await params;
  const { notice } = await searchParams;
  await requireSession();
  const here = `/cms/posts/${slug}`;

  const [post, categories] = await Promise.all([
    cmsFetch<CmsPost>(`/api/blog-posts/${encodeURIComponent(slug)}/?raw=1`, {}, { render: here }).catch((e) => {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }),
    cmsFetch<CmsCategory[]>("/api/blog-categories/", {}, { render: here }),
  ]);
  if (!post) notFound();
  const author = (await getRole()) !== "staff";
  /* Authors may only open their own drafts; anything else goes back to the list. */
  if (author && !post.editable) redirect("/cms");

  return (
    <>
      <Link href="/cms" className="inline-flex min-h-11 items-center text-sm font-bold text-[#a02f52]">← All posts</Link>
      <h1 className="mt-1 break-words font-display text-3xl font-extrabold text-[#171922]">Edit post</h1>
      <div className="mt-6">
        {/* key: a rename redirects to a new slug and must remount with fresh data */}
        <PostForm key={post.slug} post={post} categories={categories} notice={notice} authorMode={author} authorName={author ? await getDisplayName() : undefined} />
      </div>
    </>
  );
}
