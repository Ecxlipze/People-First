import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* Numbered pager for the CMS lists: Previous / Next, a window of page numbers
   around the current one with first and last always reachable, and a
   "Showing x–y of N" summary. Plain links, so it works without scripting and
   each page is a shareable URL. */

function windowed(page: number, totalPages: number): (number | "gap")[] {
  const keep = new Set([1, totalPages, page - 1, page, page + 1]);
  const nums = [...keep].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

const cell =
  "grid h-11 min-w-11 place-items-center rounded-lg border px-3 font-display text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a02f52]";
const idle = "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50";

export default function Pagination({
  page,
  totalPages,
  total,
  perPage,
  hrefFor,
  label,
}: {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  hrefFor: (page: number) => string;
  label: string;
}) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-sm text-zinc-600" aria-live="polite">
        Showing {from}–{to} of {total}
      </p>
      <nav aria-label={label} className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} rel="prev" aria-label="Previous page" className={`${cell} ${idle}`}>
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <span aria-hidden className={`${cell} border-zinc-100 bg-zinc-50 text-zinc-300`}>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
        {windowed(page, totalPages).map((n, i) =>
          n === "gap" ? (
            <span key={`gap-${i}`} aria-hidden className="px-1 text-zinc-400">…</span>
          ) : (
            <Link
              key={n}
              href={hrefFor(n)}
              aria-label={`Page ${n}`}
              aria-current={n === page ? "page" : undefined}
              className={`${cell} ${n === page ? "border-transparent bg-[#a02f52] text-white" : idle}`}
            >
              {n}
            </Link>
          ),
        )}
        {page < totalPages ? (
          <Link href={hrefFor(page + 1)} rel="next" aria-label="Next page" className={`${cell} ${idle}`}>
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <span aria-hidden className={`${cell} border-zinc-100 bg-zinc-50 text-zinc-300`}>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </nav>
    </div>
  );
}
