import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import { cmsFetch, requireSession } from "@/app/cms/session";
import { deleteTestimonialAction, moveTestimonialAction, setTestimonialActiveAction } from "@/app/cms/actions";
import type { CmsTestimonial } from "@/app/cms/types";
import ConfirmDelete from "@/app/cms/ConfirmDelete";

const iconBtn =
  "pf-interactive inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40";
const textBtn =
  "pf-interactive inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50";

export default async function TestimonialsCms({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  await requireSession();
  const fetched = await cmsFetch<CmsTestimonial[]>("/api/testimonials/", {}, { render: "/cms/testimonials" });
  const items = [...fetched].sort((a, b) => a.display_order - b.display_order || a.id - b.id);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#171922]">Testimonials</h1>
          <p className="mt-1 text-sm text-zinc-600">Quotes shown on the home page, in the order listed. Hidden ones stay here but are not public.</p>
        </div>
        <Link href="/cms/testimonials/new" className="pf-interactive inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946]">
          <Plus className="h-4 w-4" aria-hidden /> New testimonial
        </Link>
      </div>

      {notice === "deleted" && <p role="status" className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Testimonial deleted.</p>}

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
          <p className="font-display text-lg font-extrabold text-[#171922]">No testimonials added yet</p>
          <p className="mt-2 text-sm text-zinc-600">Until you add one, the home page shows the built-in testimonials. Once you add your first, only the ones listed here are shown.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((t, i) => (
            <li key={t.id} className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="flex min-w-0 flex-1 basis-[16rem] gap-3">
                  {t.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatar} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#a02f52]/10 font-display text-lg font-extrabold text-[#a02f52]">{t.name.charAt(0).toUpperCase()}</span>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ${t.is_active ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"}`}>{t.is_active ? "Visible" : "Hidden"}</span>
                      <span className="text-xs font-bold text-zinc-500">#{i + 1}</span>
                    </div>
                    <p className="mt-1.5 break-words font-display text-lg font-extrabold leading-snug text-[#171922]">
                      <Link href={`/cms/testimonials/${t.id}`} className="hover:text-[#a02f52]">{t.name}</Link>
                    </p>
                    {t.handle && <p className="break-words text-sm text-zinc-500">{t.handle}</p>}
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-700">{t.body}</p>
                    {t.tags.length > 0 && <p className="mt-1.5 text-xs font-bold text-[#a02f52]">{t.tags.map((x) => `#${x}`).join(" ")}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={moveTestimonialAction}>
                    <input type="hidden" name="id" value={t.id} /><input type="hidden" name="dir" value="up" />
                    <button type="submit" disabled={i === 0} aria-label="Move earlier" title="Move earlier" className={iconBtn}><ArrowUp className="h-4 w-4" /></button>
                  </form>
                  <form action={moveTestimonialAction}>
                    <input type="hidden" name="id" value={t.id} /><input type="hidden" name="dir" value="down" />
                    <button type="submit" disabled={i === items.length - 1} aria-label="Move later" title="Move later" className={iconBtn}><ArrowDown className="h-4 w-4" /></button>
                  </form>
                  <Link href={`/cms/testimonials/${t.id}`} className={textBtn}><Pencil className="h-4 w-4" aria-hidden /> Edit</Link>
                  <form action={setTestimonialActiveAction}>
                    <input type="hidden" name="id" value={t.id} /><input type="hidden" name="is_active" value={t.is_active ? "false" : "true"} />
                    <button type="submit" className={textBtn}>{t.is_active ? "Hide" : "Show"}</button>
                  </form>
                  <ConfirmDelete action={deleteTestimonialAction} slug={String(t.id)} title={`the testimonial from ${t.name}`} fieldName="id" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
