import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus } from "lucide-react";
import { cmsFetch, requireSession } from "@/app/cms/session";
import { deleteVentureAction, moveVentureAction, setVentureActiveAction } from "@/app/cms/actions";
import type { CmsVenture } from "@/app/cms/types";
import ConfirmDelete from "@/app/cms/ConfirmDelete";
import Pagination from "@/app/cms/Pagination";
import { paginate, parsePage } from "@/app/cms/paging";

const iconBtn =
  "pf-interactive inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40";
const textBtn =
  "pf-interactive inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50";

export default async function VenturesCms({ searchParams }: { searchParams: Promise<{ notice?: string; page?: string }> }) {
  const { notice, page: pageParam } = await searchParams;
  await requireSession();
  const requested = parsePage(pageParam);
  const href = (n: number) => (n > 1 ? `/cms/ventures?page=${n}` : "/cms/ventures");
  const fetched = await cmsFetch<CmsVenture[]>("/api/ventures/", {}, { render: href(requested) });
  const all = [...fetched].sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const { items, offset, ...paging } = paginate(all, requested);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#171922]">Ventures</h1>
          <p className="mt-1 text-sm text-zinc-600">The venture cards on the home page, in the order listed (5 on the top row, then 4). Hidden ones stay here but are not public.</p>
        </div>
        <Link href="/cms/ventures/new" className="pf-interactive inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946]">
          <Plus className="h-4 w-4" aria-hidden /> New venture
        </Link>
      </div>

      {notice === "deleted" && <p role="status" className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Venture deleted.</p>}

      {all.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
          <p className="font-display text-lg font-extrabold text-[#171922]">No ventures added yet</p>
          <p className="mt-2 text-sm text-zinc-600">Until you add one, the home page shows the built-in ventures. Once you add your first, only the ones listed here are shown.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((v, idx) => {
            /* Position within the whole list, not just this page. */
            const i = offset + idx;
            return (
            <li key={v.id} className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="flex min-w-0 flex-1 basis-[16rem] items-start gap-3">
                  <span
                    className="grid h-14 w-24 shrink-0 place-items-center overflow-hidden rounded-lg p-1"
                    style={{ background: v.border_gradient || undefined, backgroundColor: v.accent || "#a00017" }}
                  >
                    <span className="grid h-full w-full place-items-center rounded-md bg-white p-1">
                      {v.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={v.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-xs font-bold text-zinc-400">No logo</span>
                      )}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ${v.is_active ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"}`}>{v.is_active ? "Visible" : "Hidden"}</span>
                      <span className="text-xs font-bold text-zinc-500">#{i + 1}</span>
                    </div>
                    <p className="mt-1.5 break-words font-display text-lg font-extrabold leading-snug text-[#171922]">
                      <Link href={`/cms/ventures/${v.id}`} className="hover:text-[#a02f52]">{v.name}</Link>
                    </p>
                    {v.subtitle && <p className="break-words text-sm text-zinc-600">{v.subtitle}</p>}
                    <p className="mt-0.5 break-all text-xs text-zinc-500">{v.website_url || "No website yet — shows a “coming soon” card"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={moveVentureAction}>
                    <input type="hidden" name="id" value={v.id} /><input type="hidden" name="dir" value="up" />
                    <button type="submit" disabled={i === 0} aria-label="Move earlier" title="Move earlier" className={iconBtn}><ArrowUp className="h-4 w-4" /></button>
                  </form>
                  <form action={moveVentureAction}>
                    <input type="hidden" name="id" value={v.id} /><input type="hidden" name="dir" value="down" />
                    <button type="submit" disabled={i === all.length - 1} aria-label="Move later" title="Move later" className={iconBtn}><ArrowDown className="h-4 w-4" /></button>
                  </form>
                  <Link href={`/cms/ventures/${v.id}`} className={textBtn}><Pencil className="h-4 w-4" aria-hidden /> Edit</Link>
                  {v.website_url && (
                    <a href={v.website_url} target="_blank" rel="noopener noreferrer" className={textBtn}><ExternalLink className="h-4 w-4" aria-hidden /> Visit</a>
                  )}
                  <form action={setVentureActiveAction}>
                    <input type="hidden" name="id" value={v.id} /><input type="hidden" name="is_active" value={v.is_active ? "false" : "true"} />
                    <button type="submit" className={textBtn}>{v.is_active ? "Hide" : "Show"}</button>
                  </form>
                  <ConfirmDelete action={deleteVentureAction} slug={String(v.id)} title={v.name} fieldName="id" />
                </div>
              </div>
            </li>
            );
          })}
        </ul>
      )}
      <Pagination {...paging} hrefFor={href} label="Venture pages" />
    </>
  );
}
