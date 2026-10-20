import { NextResponse, type NextRequest } from "next/server";
import { clearTokens, refreshSession } from "@/app/cms/session";

/* Renders can't store rotated tokens, so an expired session lands here first. */
export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") ?? "/cms";
  /* Only ever bounce back inside /cms — never to an arbitrary address. */
  const safe = next.startsWith("/cms") && !next.startsWith("//") ? next : "/cms";

  if (await refreshSession()) return NextResponse.redirect(new URL(safe, request.url));
  await clearTokens();
  return NextResponse.redirect(new URL("/cms/login", request.url));
}
