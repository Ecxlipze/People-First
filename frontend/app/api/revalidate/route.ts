import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CONTENT_TAGS } from "@/app/lib/content/tags";

/* Called by the Django admin (backend/people_first/revalidate.py) after an
   editor saves or deletes a row, so the public site drops its cached copy
   immediately instead of waiting out CONTENT_REVALIDATE_SECONDS.

   Body: { "tags": ["content:gallery", …] }. Authenticated with a shared secret
   in REVALIDATE_SECRET; with no secret configured the endpoint is closed. */

function authorised(request: Request): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!authorised(request)) return Response.json({ error: "unauthorised" }, { status: 401 });

  let tags: unknown;
  try {
    ({ tags } = await request.json());
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }
  const allowed = new Set<string>(CONTENT_TAGS);
  const valid = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string" && allowed.has(t))
    : [];
  if (valid.length === 0) return Response.json({ error: "no valid tags" }, { status: 400 });

  /* expire: 0 drops the entry now, so the next visit is a blocking fetch of
     fresh data rather than stale-while-revalidate. */
  for (const tag of valid) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: valid });
}
