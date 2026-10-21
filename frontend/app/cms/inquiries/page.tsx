import Link from "next/link";
import { Download, Search } from "lucide-react";
import { ApiError } from "@/app/lib/api";
import { cmsFetch, requireSession } from "@/app/cms/session";
import Pagination from "@/app/cms/Pagination";
import {
  INQUIRY_STATUS_LABEL, INQUIRY_TYPE_OPTIONS,
  type CmsInquiryPage, type CmsInquirySummary, type InquiryStatus,
} from "@/app/cms/types";

import { CMS_PER_PAGE as PER_PAGE, parsePage } from "@/app/cms/paging";
const STATUS_TABS: ("all" | InquiryStatus)[] = ["all", "new", "read", "replied", "archived"];

const badge: Record<InquiryStatus, string> = {
  new: "bg-[#a02f52] text-white",
  read: "bg-zinc-100 text-zinc-600",
  replied: "bg-emerald-100 text-emerald-800",
  archived: "bg-zinc-200 text-zinc-500",
};

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";
}

export default async function InquiriesInbox({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; type?: string; page?: string; notice?: string }>;
}) {
  const sp = await searchParams;
  await requireSession();

  const status = STATUS_TABS.includes(sp.status as never) && sp.status !== "all" ? (sp.status as InquiryStatus) : undefined;
  const type = INQUIRY_TYPE_OPTIONS.some((o) => o.value === sp.type) ? sp.type : undefined;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const page = parsePage(sp.page);

  const query = (over: Record<string, string | undefined> = {}) => {
    const p = new URLSearchParams();
    const merged = { q, status, type, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    return p.toString();
  };
  const href = (over: Record<string, string | undefined>) => `/cms/inquiries${query(over) ? `?${query(over)}` : ""}`;
  const here = href({ page: page > 1 ? String(page) : undefined });

  const [summary, list] = await Promise.all([
    cmsFetch<CmsInquirySummary>("/api/inquiries/summary/", {}, { render: here }),
    cmsFetch<CmsInquiryPage>(`/api/inquiries/?${query({ page: String(page) })}`, {}, { render: here }).catch((e) => {
      if (e instanceof ApiError && e.status === 404) return { count: 0, results: [] }; // page past the end
      throw e;
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(list.count / PER_PAGE));

  const notice = sp.notice === "deleted" ? "Inquiry deleted." : sp.notice === "export-failed" ? "The export failed. Please try again." : null;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#171922]">Inquiries</h1>
          <p className="mt-1 text-sm text-zinc-600">Messages sent through the website&apos;s contact, partner and training forms.</p>
        </div>
        <a
          href={`/cms/inquiries/export${query() ? `?${query()}` : ""}`}
          className="pf-interactive inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 font-display text-sm font-bold text-zinc-700 hover:bg-zinc-50"
        >
          <Download className="h-4 w-4" aria-hidden /> Export CSV
        </a>
      </div>

      {notice && <p role="status" className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</p>}

      <nav aria-label="Filter by status" className="mt-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => {
          const active = (t === "all" && !status) || t === status;
          const n = t === "all" ? summary.total : summary[t];
          return (
            <Link
              key={t}
              href={href({ status: t === "all" ? undefined : t, page: undefined })}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold ${active ? "border-transparent bg-[#a02f52] text-white" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"}`}
            >
              {t === "all" ? "All" : INQUIRY_STATUS_LABEL[t]}
              <span className={`rounded-full px-2 text-xs ${active ? "bg-white/25" : "bg-zinc-100 text-zinc-600"}`}>{n}</span>
            </Link>
          );
        })}
      </nav>

      <form method="get" action="/cms/inquiries" className="mt-4 flex flex-wrap gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <label htmlFor="q" className="sr-only">Search inquiries</label>
        <div className="relative min-w-0 flex-1 basis-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
          <input id="q" name="q" defaultValue={q} placeholder="Search name, email, phone or message" className="min-h-11 w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-base outline-none focus:border-[#a02f52] focus:ring-2 focus:ring-[#a02f52]/25" />
        </div>
        <label htmlFor="type" className="sr-only">Inquiry type</label>
        <select id="type" name="type" defaultValue={type ?? ""} className="min-h-11 rounded-lg border border-zinc-300 bg-white px-3 text-base">
          <option value="">All types</option>
          {INQUIRY_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button className="min-h-11 rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946]">Search</button>
        {(q || type) && <Link href={href({ q: undefined, type: undefined, page: undefined })} className="inline-flex min-h-11 items-center px-2 text-sm font-bold text-zinc-600 hover:text-zinc-950">Clear</Link>}
      </form>

      {list.results.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
          <p className="font-display text-lg font-extrabold text-[#171922]">{q || status || type ? "No inquiries match" : "No inquiries yet"}</p>
          <p className="mt-2 text-sm text-zinc-600">{q || status || type ? "Try a different search or filter." : "Messages from the website forms will appear here."}</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.results.map((i) => (
            <li key={i.id}>
              <Link href={`/cms/inquiries/${i.id}`} className="block rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a02f52] sm:p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ${badge[i.status]}`}>{INQUIRY_STATUS_LABEL[i.status]}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#a02f52]">{i.inquiry_type_label}</span>
                  <span className="text-xs text-zinc-500">{i.person_type_label}</span>
                  <span className="ml-auto text-xs text-zinc-500">{when(i.created_at)}</span>
                </div>
                <p className={`mt-2 break-words font-display text-lg leading-snug text-[#171922] ${i.status === "new" ? "font-extrabold" : "font-bold"}`}>{i.name}</p>
                <p className="break-all text-sm text-zinc-500">{i.email}{i.phone ? ` · ${i.phone}` : ""}</p>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-700">{i.message}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} total={list.count} perPage={PER_PAGE} hrefFor={(n) => href({ page: n > 1 ? String(n) : undefined })} label="Inquiry pages" />
    </>
  );
}
