import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { cmsFetch, getRole, requireSession } from "@/app/cms/session";
import { deletePostAction, setStatusAction } from "@/app/cms/actions";
import type { CmsPost } from "@/app/cms/types";
import ConfirmDelete from "@/app/cms/ConfirmDelete";
import Pagination from "@/app/cms/Pagination";
import { paginate, parsePage } from "@/app/cms/paging";

const TABS = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
] as const;

const NOTICES: Record<string, string> = { deleted: "Post deleted." };

function fmt(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function CmsHome({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; notice?: string; page?: string }>;
}) {
  const { status = "all", notice, page: pageParam } = await searchParams;
  await requireSession();
  const isStaff = (await getRole()) === "staff";
  const requested = parsePage(pageParam);
  const href = (st: string, n = 1) => {
    const p = new URLSearchParams();
    if (st !== "all") p.set("status", st);
    if (n > 1) p.set("page", String(n));
    return p.size ? `/cms?${p}` : "/cms";
  };
  const here = href(status, requested);
  const posts = await cmsFetch<CmsPost[]>("/api/blog-posts/", {}, { render: here });

  const live = (p: CmsPost) => p.status === "published" && !!p.published_at && new Date(p.published_at) <= new Date();
  const counts = { all: posts.length, published: posts.filter((p) => p.status === "published").length, draft: posts.filter((p) => p.status === "draft").length };
  const filtered = status === "all" ? posts : posts.filter((p) => p.status === status);
  const { items: shown, ...paging } = paginate(filtered, requested);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#171922]">Posts</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {isStaff
              ? "Everything published here appears on Media / Events."
              : "Read the published posts and write drafts of your own. An editor reviews and publishes them."}
          </p>
        </div>
        <Link
          href="/cms/posts/new"
          className="pf-interactive inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946]"
        >
          <Plus className="h-4 w-4" aria-hidden /> New post
        </Link>
      </div>

      {notice && NOTICES[notice] && (
        <p role="status" className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{NOTICES[notice]}</p>
      )}

      <nav aria-label="Filter posts" className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={href(t.key)}
            aria-current={status === t.key ? "page" : undefined}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold ${
              status === t.key ? "border-transparent bg-[#a02f52] text-white" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {!isStaff && t.key === "draft" ? "My drafts" : t.label}
            <span className={`rounded-full px-2 text-xs ${status === t.key ? "bg-white/25" : "bg-zinc-100 text-zinc-600"}`}>{counts[t.key]}</span>
          </Link>
        ))}
      </nav>

      {shown.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
          <p className="font-display text-lg font-extrabold text-[#171922]">No posts here yet</p>
          <p className="mt-2 text-sm text-zinc-600">Create your first post to get started.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {shown.map((post) => (
            <li key={post.id} className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="min-w-0 flex-1 basis-[16rem]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ${
                        live(post) ? "bg-emerald-100 text-emerald-800" : post.status === "published" ? "bg-amber-100 text-amber-800" : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {live(post) ? "Published" : post.status === "published" ? "Scheduled" : "Draft"}
                    </span>
                    {!isStaff && post.is_mine && <span className="rounded-full bg-[#a02f52]/10 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide text-[#a02f52]">Yours</span>}
                    {post.category_name && <span className="text-xs font-bold uppercase tracking-wider text-[#a02f52]">{post.category_name}</span>}
                  </div>
                  <h2 className="mt-2 break-words font-display text-lg font-extrabold leading-snug text-[#171922]">
                    {post.editable ? <Link href={`/cms/posts/${post.slug}`} className="hover:text-[#a02f52]">{post.title}</Link> : post.title}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {post.status === "published" ? `Published ${fmt(post.published_at)}` : `Edited ${fmt(post.updated_at)}`} · /{post.slug}
                    {post.author_name && ` · by ${post.author_name}`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {post.editable && (
                    <Link
                      href={`/cms/posts/${post.slug}`}
                      className="pf-interactive inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
                    >
                      <Pencil className="h-4 w-4" aria-hidden /> Edit
                    </Link>
                  )}
                  {live(post) && (
                    <Link
                      href={`/media-events/${post.slug}`}
                      target="_blank"
                      className="pf-interactive inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden /> View
                    </Link>
                  )}
                  {isStaff && (<>
                  <form action={setStatusAction}>
                    <input type="hidden" name="slug" value={post.slug} />
                    <input type="hidden" name="status" value={post.status === "published" ? "draft" : "published"} />
                    <button
                      type="submit"
                      className="pf-interactive inline-flex min-h-11 items-center rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
                    >
                      {post.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <ConfirmDelete action={deletePostAction} slug={post.slug} title={post.title} />
                  </>)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination {...paging} hrefFor={(n) => href(status, n)} label="Post pages" />
    </>
  );
}
