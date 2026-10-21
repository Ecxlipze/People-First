"use server";

import { apiFetch } from "@/app/lib/api";

/* Counts one read of a published post. Called once per reader per day from
   ViewBeacon. Best-effort: a failure must never surface to the reader, and the
   backend refuses drafts and unknown slugs, so a forged slug counts nothing. */
export async function recordPostView(slug: string): Promise<void> {
  if (!/^[a-z0-9-]{1,255}$/.test(slug)) return;
  try {
    await apiFetch(`/api/blog-posts/${slug}/view/`, { method: "POST", revalidate: false });
  } catch {
    /* ignore */
  }
}
