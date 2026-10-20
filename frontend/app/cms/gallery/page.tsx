import Link from "next/link";
import { ArrowLeft, ArrowRight, Pencil, Upload } from "lucide-react";
import { cmsFetch, requireSession } from "@/app/cms/session";
import { deleteGalleryItemAction, moveGalleryAction, setGalleryActiveAction, uploadGalleryAction } from "@/app/cms/actions";
import type { CmsGalleryItem } from "@/app/cms/types";
import ConfirmDelete from "@/app/cms/ConfirmDelete";

function notice(n?: string): { text: string; bad?: boolean } | null {
  if (!n) return null;
  if (n === "deleted") return { text: "Photo deleted." };
  if (n === "no-files") return { text: "Choose at least one photo to upload.", bad: true };
  if (n === "bad-type") return { text: "Only image files can be uploaded.", bad: true };
  if (n === "too-big") return { text: "Each photo must be 10 MB or smaller.", bad: true };
  let m = /^added-(\d+)$/.exec(n);
  if (m) return { text: `Added ${m[1]} photo${m[1] === "1" ? "" : "s"}. Give them descriptions so the site is accessible.` };
  m = /^partial-(\d+)$/.exec(n);
  if (m) return { text: `Added ${m[1]} photo(s); some files were rejected by the server.`, bad: true };
  return null;
}

const iconBtn =
  "pf-interactive inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40";

export default async function GalleryCms({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice: n } = await searchParams;
  await requireSession();
  const fetched = await cmsFetch<CmsGalleryItem[]>("/api/gallery/", {}, { render: "/cms/gallery" });
  const items = [...fetched].sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const msg = notice(n);

  return (
    <>
      <div>
        <h1 className="font-display text-3xl font-extrabold text-[#171922]">Gallery</h1>
        <p className="mt-1 text-sm text-zinc-600">
          The photos in the carousel on the home page, in the order shown here. Hidden photos stay here but are not public.
        </p>
      </div>

      {msg && (
        <p role={msg.bad ? "alert" : "status"} className={`mt-5 rounded-lg px-4 py-3 text-sm font-medium ${msg.bad ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
          {msg.text}
        </p>
      )}

      <form action={uploadGalleryAction} className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
        <label htmlFor="images" className="text-sm font-bold text-zinc-800">Add photos</label>
        <input id="images" name="images" type="file" accept="image/*" multiple required className="min-w-0 flex-1 text-sm" />
        <button type="submit" className="pf-interactive inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946]">
          <Upload className="h-4 w-4" aria-hidden /> Upload
        </button>
        <p className="basis-full text-xs text-zinc-500">
          You can pick several at once (up to 10 MB each). Tall portrait photos (about 2:3) fit the carousel best.
        </p>
      </form>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
          <p className="font-display text-lg font-extrabold text-[#171922]">No photos added yet</p>
          <p className="mt-2 text-sm text-zinc-600">
            Until you add one, the home page shows the built-in photos. Once you add your first photo, the home page shows only the photos listed here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative aspect-[4/3] bg-zinc-100">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.alt_text || item.title || ""} loading="lazy" className={`h-full w-full object-cover ${item.is_active ? "" : "opacity-40"}`} />
                )}
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ${item.is_active ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-700"}`}>
                  {item.is_active ? "Visible" : "Hidden"}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-bold text-white">#{i + 1}</span>
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-bold text-zinc-800">{item.title || "Untitled photo"}</p>
                {!item.alt_text && <p className="mt-0.5 text-xs font-medium text-amber-700">No description for screen readers</p>}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={moveGalleryAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="dir" value="up" />
                    <button type="submit" disabled={i === 0} aria-label="Move earlier" title="Move earlier" className={iconBtn}><ArrowLeft className="h-4 w-4" /></button>
                  </form>
                  <form action={moveGalleryAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="dir" value="down" />
                    <button type="submit" disabled={i === items.length - 1} aria-label="Move later" title="Move later" className={iconBtn}><ArrowRight className="h-4 w-4" /></button>
                  </form>
                  <Link href={`/cms/gallery/${item.id}`} className="pf-interactive inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50">
                    <Pencil className="h-4 w-4" aria-hidden /> Edit
                  </Link>
                  <form action={setGalleryActiveAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="is_active" value={item.is_active ? "false" : "true"} />
                    <button type="submit" className="pf-interactive inline-flex min-h-11 items-center rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50">
                      {item.is_active ? "Hide" : "Show"}
                    </button>
                  </form>
                  <ConfirmDelete action={deleteGalleryItemAction} slug={String(item.id)} title={item.title || "this photo"} fieldName="id" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
