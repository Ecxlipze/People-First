/* "1.2K", "3.4M" — compact counts for views. */
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/* "1.2K views" / "1 view". Empty for zero or unknown, so a brand-new post does
   not advertise "0 views". */
export function formatViews(n?: number): string {
  if (!n || n < 1) return "";
  return `${compact.format(n)} ${n === 1 ? "view" : "views"}`;
}
