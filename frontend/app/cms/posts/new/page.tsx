import Link from "next/link";
import { cmsFetch, getDisplayName, getRole, requireSession } from "@/app/cms/session";
import PostForm from "@/app/cms/posts/PostForm";
import type { CmsCategory } from "@/app/cms/types";

export default async function NewPostPage() {
  await requireSession();
  const author = (await getRole()) !== "staff";
  const categories = await cmsFetch<CmsCategory[]>("/api/blog-categories/", {}, { render: "/cms/posts/new" });

  return (
    <>
      <Link href="/cms" className="inline-flex min-h-11 items-center text-sm font-bold text-[#a02f52]">← All posts</Link>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-[#171922]">New post</h1>
      <div className="mt-6">
        <PostForm categories={categories} authorMode={author} authorName={author ? await getDisplayName() : undefined} />
      </div>
    </>
  );
}
