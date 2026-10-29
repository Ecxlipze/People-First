import { NextResponse, type NextRequest } from "next/server";
import { redirectTo } from "@/app/cms/redirect";
import { cmsFetch, hasSession } from "@/app/cms/session";

/* CSV download of the inquiries matching the inbox's current filters. */
export async function GET(request: NextRequest) {
  if (!(await hasSession())) return redirectTo("/cms/login");

  const params = new URLSearchParams();
  for (const key of ["status", "type", "q"]) {
    const v = request.nextUrl.searchParams.get(key);
    if (v) params.set(key, v);
  }
  try {
    const csv = await cmsFetch<string>(`/api/inquiries/export/?${params}`, {}, "action");
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="inquiries-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return redirectTo("/cms/inquiries?notice=export-failed");
  }
}
