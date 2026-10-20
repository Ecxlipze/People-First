import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/app/lib/api";
import { cmsFetch, hasSession } from "@/app/cms/session";

/* "Fetch from YouTube" in the podcast form: staff-only metadata lookup. */
export async function GET(request: NextRequest) {
  if (!(await hasSession())) return NextResponse.json({ detail: "Not signed in." }, { status: 401 });
  const url = request.nextUrl.searchParams.get("url") ?? "";
  try {
    const data = await cmsFetch(`/api/podcasts/lookup/?url=${encodeURIComponent(url)}`, {}, "action");
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      return NextResponse.json({ success: false, error: "Paste a valid YouTube video link." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Could not reach YouTube just now." }, { status: 502 });
  }
}
