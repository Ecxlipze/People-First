"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ITEMS = [
  { href: "/cms", label: "Blog posts", match: (p: string) => p === "/cms" || p.startsWith("/cms/posts") },
  { href: "/cms/podcasts", label: "Podcasts", match: (p: string) => p.startsWith("/cms/podcasts") },
  { href: "/cms/testimonials", label: "Testimonials", match: (p: string) => p.startsWith("/cms/testimonials") },
  { href: "/cms/ventures", label: "Ventures", match: (p: string) => p.startsWith("/cms/ventures") },
  { href: "/cms/gallery", label: "Gallery", match: (p: string) => p.startsWith("/cms/gallery") },
  { href: "/cms/inquiries", label: "Inquiries", match: (p: string) => p.startsWith("/cms/inquiries") },
];

export default function CmsNav({ role }: { role: "staff" | "author" }) {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  /* Unread inquiries, refreshed on every navigation inside the CMS. */
  useEffect(() => {
    if (role !== "staff") return;
    let live = true;
    fetch("/cms/inquiries/count", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { new: 0 }))
      .then((d: { new?: number }) => live && setUnread(d.new ?? 0))
      .catch(() => {});
    return () => { live = false; };
  }, [pathname, role]);
  return (
    <nav aria-label="Content sections" className="flex flex-wrap items-center gap-1">
      {(role === "staff" ? ITEMS : ITEMS.slice(0, 1)).map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-lg px-3 font-display text-sm font-bold ${
              active ? "bg-[#a02f52]/10 text-[#a02f52]" : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            {item.label}
            {item.href === "/cms/inquiries" && unread > 0 && (
              <span className="ml-1.5 rounded-full bg-[#a02f52] px-1.5 text-xs font-extrabold text-white" aria-label={`${unread} unread`}>{unread}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
