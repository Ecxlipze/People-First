import Link from "next/link";
import { Plus, Pencil, ExternalLink, RefreshCw } from "lucide-react";
import { cmsFetch, requireSession } from "@/app/cms/session";
import { deletePodcastAction, setPodcastActiveAction, syncPodcastsAction } from "@/app/cms/actions";
import type { CmsPodcast } from "@/app/cms/types";
import ConfirmDelete from "@/app/cms/ConfirmDelete";
import Pagination from "@/app/cms/Pagination";
import { paginate, parsePage } from "@/app/cms/paging";

function notice(n?: string): { text: string; bad?: boolean } | null {
  if (!n) return null;
  if (n === "deleted") return { text: "Episode deleted." };
  if (n === "sync-failed") return { text: "Could not read the YouTube channel. Check the YouTube settings on the server.", bad: true };
  const m = /^synced-(\d+)$/.exec(n);
  if (m) return { text: Number(m[1]) === 0 ? "Already up to date — no new videos found." : `Added ${m[1]} new episode${m[1] === "1" ? "" : "s"} from YouTube.` };
  return null;
}

function fmt(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function PodcastsCms({ searchParams }: { searchParams: Promise<{ notice?: string; page?: string }> }) {
  const { notice: n, page: pageParam } = await searchParams;
  await requireSession();
  const requested = parsePage(pageParam);
  const href = (n: number) => (n > 1 ? `/cms/podcasts?page=${n}` : "/cms/podcasts");
  const all = await cmsFetch<CmsPodcast[]>("/api/podcasts/", {}, { render: href(requested) });
  const { items: episodes, ...paging } = paginate(all, requested);
  const msg = notice(n);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#171922]">Podcasts</h1>
          <p className="mt-1 text-sm text-zinc-600">Episodes shown on the Podcasts page. Hidden episodes stay here but are not public.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <form action={syncPodcastsAction}>
            <button type="submit" className="pf-interactive inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 font-display text-sm font-bold text-zinc-700 hover:bg-zinc-50">
              <RefreshCw className="h-4 w-4" aria-hidden /> Sync from YouTube
            </button>
          </form>
          <Link href="/cms/podcasts/new" className="pf-interactive inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946]">
            <Plus className="h-4 w-4" aria-hidden /> New episode
          </Link>
        </div>
      </div>

      {msg && (
        <p role={msg.bad ? "alert" : "status"} className={`mt-5 rounded-lg px-4 py-3 text-sm font-medium ${msg.bad ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
          {msg.text}
        </p>
      )}

      {all.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
          <p className="font-display text-lg font-extrabold text-[#171922]">No episodes yet</p>
          <p className="mt-2 text-sm text-zinc-600">Add one, or sync from the YouTube channel.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {episodes.map((ep) => (
            <li key={ep.id} className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="min-w-0 flex-1 basis-[16rem]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ${ep.is_active ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"}`}>
                      {ep.is_active ? "Visible" : "Hidden"}
                    </span>
                    {ep.is_featured && <span className="rounded-full bg-[#a02f52]/10 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide text-[#a02f52]">Featured</span>}
                  </div>
                  <h2 className="mt-2 break-words font-display text-lg font-extrabold leading-snug text-[#171922]">
                    <Link href={`/cms/podcasts/${ep.id}`} className="hover:text-[#a02f52]">{ep.title}</Link>
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {ep.published_at ? `Published ${fmt(ep.published_at)}` : `Added ${fmt(ep.updated_at)}`}
                    {ep.youtube_video_id ? " · from YouTube" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/cms/podcasts/${ep.id}`} className="pf-interactive inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50">
                    <Pencil className="h-4 w-4" aria-hidden /> Edit
                  </Link>
                  {ep.is_active && (
                    <Link href={`/podcasts#${ep.slug}`} target="_blank" className="pf-interactive inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50">
                      <ExternalLink className="h-4 w-4" aria-hidden /> View
                    </Link>
                  )}
                  <form action={setPodcastActiveAction}>
                    <input type="hidden" name="id" value={ep.id} />
                    <input type="hidden" name="is_active" value={ep.is_active ? "false" : "true"} />
                    <button type="submit" className="pf-interactive inline-flex min-h-11 items-center rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50">
                      {ep.is_active ? "Hide" : "Show"}
                    </button>
                  </form>
                  <ConfirmDelete action={deletePodcastAction} slug={String(ep.id)} title={ep.title} fieldName="id" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pagination {...paging} hrefFor={href} label="Episode pages" />
    </>
  );
}
