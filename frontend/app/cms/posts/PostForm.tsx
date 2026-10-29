"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { createCategoryAction, savePostAction } from "@/app/cms/actions";
import ImageDropzone from "@/app/cms/ImageDropzone";
import RichTextEditor from "@/app/cms/posts/Editor";
import { useCmsForm } from "@/app/cms/useCmsForm";
import { INITIAL_CMS_STATE, type CmsCategory, type CmsPost } from "@/app/cms/types";

const field =
  "mt-1.5 block min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-zinc-900 outline-none focus:border-[#a02f52] focus:ring-2 focus:ring-[#a02f52]/25 aria-[invalid=true]:border-red-500";
const label = "text-sm font-bold text-zinc-800";
const card = "rounded-2xl bg-white p-5 shadow-sm sm:p-6";

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

/* Plain text of the editor's HTML, for deriving a summary. */
function plainText(html: string): string {
  if (!html) return ""; // also keeps the server render (no DOMParser) off this path
  return (new DOMParser().parseFromString(html, "text/html").body.textContent ?? "").replace(/\s+/g, " ").trim();
}

/* Cut at a word boundary so an auto-filled summary never ends mid-word. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > max * 0.6 ? cut.lastIndexOf(" ") : cut.length).trimEnd()}…`;
}

/* The last author name used, so a new post starts with it. Browser storage can
   be unavailable (private windows, blocked site data), so every access is
   guarded and the form works without it. */
const AUTHOR_KEY = "pf-cms-last-author";
const noopSubscribe = () => () => {};
function readLastAuthor(): string {
  try { return window.localStorage.getItem(AUTHOR_KEY) ?? ""; } catch { return ""; }
}
function rememberAuthor(name: string) {
  try { if (name.trim()) window.localStorage.setItem(AUTHOR_KEY, name.trim()); } catch { /* storage unavailable */ }
}

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-red-700">{msg}</p> : null;
}

export default function PostForm({
  post,
  categories: initialCategories,
  notice,
  authorMode = false,
  authorName = "",
}: {
  post?: CmsPost;
  categories: CmsCategory[];
  notice?: string;
  /* A Blog Authors account: drafts only, author line fixed to their own name. */
  authorMode?: boolean;
  authorName?: string;
}) {
  const { state, pending, onSubmit } = useCmsForm(savePostAction, INITIAL_CMS_STATE);
  const errors = state.errors ?? {};

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [content, setContent] = useState(post?.content ?? "");
  /* On a NEW post these start as null = "not typed yet", and the field shows a
     value derived from the ones above it (title -> meta title, body -> summary
     -> meta description, title -> image description). The first keystroke in a
     field makes it the editor's own. An existing post never auto-fills, so
     saved values are never silently replaced. */
  const [metaTitleInput, setMetaTitleInput] = useState<string | null>(post ? post.meta_title : null);
  const [metaDescInput, setMetaDescInput] = useState<string | null>(post ? post.meta_description : null);
  const [excerptInput, setExcerptInput] = useState<string | null>(post ? post.excerpt : null);
  const [altInput, setAltInput] = useState<string | null>(post ? post.featured_image_alt : null);
  const [authorInput, setAuthorInput] = useState<string | null>(post ? post.author_name : null);
  const lastAuthor = useSyncExternalStore(noopSubscribe, readLastAuthor, () => "");
  const [categories, setCategories] = useState(initialCategories);
  const [category, setCategory] = useState(post?.category ? String(post.category) : "");
  const [newCategory, setNewCategory] = useState("");
  const [catError, setCatError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(post?.featured_image ?? null);
  const [removeImage, setRemoveImage] = useState(false);
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [publishedAt, setPublishedAt] = useState(toLocalInput(post?.published_at ?? null));

  const isPublished = post?.status === "published";
  const shownNotice =
    state.status === "success" ? state.message
    : notice === "published" ? "Published — it is live on the site now."
    : notice === "unpublished" ? "Moved back to drafts."
    : notice === "saved" ? "Saved."
    : null;

  const addCategory = async () => {
    setCatError(null);
    const res = await createCategoryAction(newCategory);
    if (res.error || !res.category) return setCatError(res.error ?? "Could not add the category.");
    setCategories((c) => [...c, res.category!]);
    setCategory(String(res.category.id));
    setNewCategory("");
  };

  const excerpt = excerptInput ?? truncate(plainText(content), 200);
  const metaTitle = metaTitleInput ?? title.slice(0, 70);
  const metaDesc = metaDescInput ?? truncate(excerpt, 160);
  const altText = altInput ?? (preview ? title : "");
  const author = authorMode ? authorName : (authorInput ?? lastAuthor);

  const seoTitle = metaTitle || title || "Post title";
  const seoDesc = metaDesc || excerpt || "A short description of the post appears here.";

  return (
    <form onSubmit={(e) => { rememberAuthor(author); onSubmit(e); }} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <input type="hidden" name="originalSlug" value={post?.slug ?? ""} />
      <input type="hidden" name="status" value={post?.status ?? "draft"} />
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="remove_image" value={removeImage ? "1" : ""} />
      {/* datetime-local has no timezone; send an absolute instant instead. */}
      <input type="hidden" name="published_at" value={publishedAt ? new Date(publishedAt).toISOString() : ""} />

      <div className="min-w-0 space-y-6">
        {(shownNotice || state.status === "error") && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={`rounded-lg px-4 py-3 text-sm font-medium ${state.status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}
          >
            {state.status === "error" ? state.message : shownNotice}
          </p>
        )}

        <section className={card}>
          <label htmlFor="title" className={label}>Title</label>
          <input
            id="title" name="title" required value={title} aria-invalid={!!errors.title}
            onChange={(e) => { setTitle(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }}
            className={`${field} font-display text-xl font-extrabold`} placeholder="Post title"
          />
          <Err id="title-err" msg={errors.title} />

          <label htmlFor="excerpt" className={`${label} mt-5 block`}>Short summary</label>
          <textarea
            id="excerpt" name="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerptInput(e.target.value)}
            className={`${field} py-2.5`} placeholder="One or two sentences shown on the Media / Events page."
          />
          {!post && excerptInput === null && excerpt && <p className="mt-1.5 text-xs text-zinc-500">Filled in from the start of the post. Edit it to write your own.</p>}

          <p className={`${label} mt-5`}>Body</p>
          <div className="mt-1.5">
            <RichTextEditor initialHtml={post?.content ?? ""} onChange={setContent} />
          </div>
          <Err id="content-err" msg={errors.content} />
        </section>

        <section className={card}>
          <h2 className="font-display text-lg font-extrabold text-[#171922]">Search &amp; sharing (SEO)</h2>
          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">How it may look on Google</p>
            <p className="mt-2 truncate text-lg text-[#1a0dab]">{seoTitle}</p>
            <p className="truncate text-sm text-emerald-800">/media-events/{slug || "post-url"}</p>
            <p className="mt-0.5 line-clamp-2 text-sm text-zinc-600">{seoDesc}</p>
          </div>

          <label htmlFor="meta_title" className={`${label} mt-5 block`}>
            Meta title <span className="font-normal text-zinc-500">({metaTitle.length}/70)</span>
          </label>
          <input id="meta_title" name="meta_title" maxLength={70} value={metaTitle} onChange={(e) => setMetaTitleInput(e.target.value)} aria-invalid={!!errors.meta_title} className={field} placeholder="Filled in from the post title" />
          <Err id="mt-err" msg={errors.meta_title} />

          <label htmlFor="meta_description" className={`${label} mt-5 block`}>
            Meta description <span className="font-normal text-zinc-500">({metaDesc.length}/160)</span>
          </label>
          <textarea id="meta_description" name="meta_description" rows={3} maxLength={160} value={metaDesc} onChange={(e) => setMetaDescInput(e.target.value)} aria-invalid={!!errors.meta_description} className={`${field} py-2.5`} placeholder="Filled in from the short summary" />
          <Err id="md-err" msg={errors.meta_description} />

          <label htmlFor="slug" className={`${label} mt-5 block`}>Page address (URL)</label>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="shrink-0 text-sm text-zinc-500">/media-events/</span>
            <input
              id="slug" name="slug" required value={slug} aria-invalid={!!errors.slug}
              onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }}
              className={`${field} mt-0`}
            />
          </div>
          <Err id="slug-err" msg={errors.slug} />
          {isPublished && <p className="mt-1.5 text-xs text-zinc-500">Changing the address of a published post breaks links people already have.</p>}
        </section>

        {!authorMode && <details className={card}>
          <summary className="min-h-11 cursor-pointer font-display text-lg font-extrabold text-[#171922]">
            Feature card (optional)
          </summary>
          <p className="mt-2 text-sm text-zinc-600">
            Extras for the large Media / Events layout. Leave everything blank for an ordinary article.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {([
              ["metric", "Headline number (e.g. 80%)", post?.metric],
              ["metric_label", "What the number means", post?.metric_label],
              ["card_value", "Teal card value (e.g. 2025)", post?.card_value],
              ["card_label", "Teal card label", post?.card_label],
              ["video_url", "Video link", post?.video_url],
              ["order", "Order (lower = earlier)", String(post?.order ?? 0)],
            ] as const).map(([name, text, value]) => (
              <div key={name}>
                <label htmlFor={name} className={label}>{text}</label>
                <input id={name} name={name} defaultValue={value ?? ""} type={name === "order" ? "number" : "text"} min={name === "order" ? 0 : undefined} className={field} />
              </div>
            ))}
            <div>
              <label htmlFor="studio_image" className={label}>Wide image</label>
              <ImageDropzone id="studio_image" name="studio_image" />
            </div>
            <div>
              <label htmlFor="studio_image_alt" className={label}>Wide image description</label>
              <input id="studio_image_alt" name="studio_image_alt" defaultValue={post?.studio_image_alt ?? ""} className={field} />
            </div>
          </div>
        </details>}
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto lg:pb-1">
        <section className={card}>
          <h2 className="font-display text-lg font-extrabold text-[#171922]">Publish</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Status:{" "}
            <strong>{isPublished ? "Published" : post ? "Draft" : "New post"}</strong>
          </p>

          {authorMode ? (
            <p className="mt-3 text-sm text-zinc-600">Your posts are saved as drafts. An editor reviews and publishes them.</p>
          ) : (<>
          <label htmlFor="when" className={`${label} mt-4 block`}>Publish date (optional)</label>
          <input id="when" type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={field} />
          <p className="mt-1 text-xs text-zinc-500">Leave blank to publish immediately. A future date schedules the post.</p>
          </>)}

          <div className="mt-5 flex flex-col gap-2">
            {authorMode ? (
              <button name="intent" value="draft" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946] disabled:opacity-60">
                {pending ? "Saving…" : "Save draft"}
              </button>
            ) : isPublished ? (
              <>
                <button name="intent" value="save" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946] disabled:opacity-60">
                  {pending ? "Saving…" : "Update post"}
                </button>
                <button name="intent" value="unpublish" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 font-display text-sm font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60">
                  Unpublish (back to draft)
                </button>
              </>
            ) : (
              <>
                <button name="intent" value="publish" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946] disabled:opacity-60">
                  {pending ? "Saving…" : "Publish"}
                </button>
                <button name="intent" value="draft" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 font-display text-sm font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60">
                  Save draft
                </button>
              </>
            )}
            <Link href="/cms" className="inline-flex min-h-11 items-center justify-center text-sm font-bold text-zinc-600 hover:text-zinc-950">
              ← Back to posts
            </Link>
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display text-lg font-extrabold text-[#171922]">Featured image</h2>
          {/* Remounted on "Remove image" so a file picked earlier is dropped too. */}
          <ImageDropzone
            key={dropzoneKey}
            id="featured_image" name="featured_image"
            preview={removeImage ? null : preview}
            onFile={(f) => { setPreview(URL.createObjectURL(f)); setRemoveImage(false); }}
          />
          {post?.featured_image && (
            <button type="button" onClick={() => { setRemoveImage(true); setPreview(null); setDropzoneKey((k) => k + 1); }} className="mt-2 min-h-11 text-sm font-bold text-red-700">
              Remove image
            </button>
          )}
          <label htmlFor="featured_image_alt" className={`${label} mt-3 block`}>Image description (for accessibility)</label>
          <input id="featured_image_alt" name="featured_image_alt" value={altText} onChange={(e) => setAltInput(e.target.value)} className={field} />
        </section>

        <section className={card}>
          <h2 className="font-display text-lg font-extrabold text-[#171922]">Details</h2>
          <label htmlFor="category-select" className={`${label} mt-3 block`}>Category</label>
          <select id="category-select" value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
            <option value="">No category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {!authorMode && <div className="mt-2 flex gap-2">
            <input aria-label="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category" className={`${field} mt-0`} />
            <button type="button" onClick={addCategory} className="min-h-11 shrink-0 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-700 hover:bg-zinc-50">Add</button>
          </div>}
          {catError && <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{catError}</p>}

          <label htmlFor="author_name" className={`${label} mt-4 block`}>Author name</label>
          <input id="author_name" name="author_name" value={author} readOnly={authorMode} onChange={(e) => setAuthorInput(e.target.value)} autoComplete="name" className={`${field} ${authorMode ? "bg-zinc-100 text-zinc-600" : ""}`} />
          {authorMode && <p className="mt-1.5 text-xs text-zinc-500">Posts always carry your own name.</p>}
        </section>
      </aside>
    </form>
  );
}
