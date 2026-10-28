"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/app/lib/api";

/* Counts one read of a published post. Called once per reader per day from
   ViewBeacon. Best-effort: a failure must never surface to the reader, and the
   backend refuses drafts and unknown slugs, so a forged slug counts nothing. */
export async function recordPostView(slug: string): Promise<void> {
  if (!/^[a-z0-9-]{1,255}$/.test(slug)) return;
  try {
    await apiFetch(`/api/blog-posts/${slug}/view/`, { method: "POST", revalidate: false });
    /* Otherwise the new count waits out the content cache, so the list and the
       article disagree. Both read /api/blog-posts/ under this one tag, so
       expiring it refreshes them together. */
    updateTag("content:blog-posts");
    revalidatePath("/media-events");
    revalidatePath(`/media-events/${slug}`);
  } catch {
    /* ignore */
  }
}
