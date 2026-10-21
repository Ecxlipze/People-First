"use client";

import { useEffect } from "react";
import { recordPostView } from "@/app/media-events/actions";

const DAY_MS = 24 * 60 * 60 * 1000;

/* Renders nothing; records a view when an article is opened. A reader is
   counted once per post per 24 hours (remembered in localStorage), so reloads
   and back-navigation do not inflate the number. If storage is unavailable the
   view is counted every time rather than not at all. */
export default function ViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `pf-viewed:${slug}`;
    try {
      const last = Number(window.localStorage.getItem(key));
      if (last && Date.now() - last < DAY_MS) return;
      window.localStorage.setItem(key, String(Date.now()));
    } catch {
      /* storage blocked */
    }
    void recordPostView(slug);
  }, [slug]);

  return null;
}
