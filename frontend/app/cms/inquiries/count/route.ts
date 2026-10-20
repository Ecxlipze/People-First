import { NextResponse } from "next/server";
import { cmsFetch, hasSession } from "@/app/cms/session";
import type { CmsInquirySummary } from "@/app/cms/types";

/* Unread count for the nav badge. Quietly answers 0 on any failure so the
   badge can never break a page. */
export async function GET() {
  if (!(await hasSession())) return NextResponse.json({ new: 0 });
  try {
    const s = await cmsFetch<CmsInquirySummary>("/api/inquiries/summary/", {}, "action");
    return NextResponse.json({ new: s.new }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ new: 0 });
  }
}
