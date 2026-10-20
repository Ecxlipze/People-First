import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, apiFetch, type ApiFetchOptions } from "@/app/lib/api";

/* CMS session = the Django JWT pair, held in httpOnly cookies so page scripts
   can never read them, and only ever sent to this site's own server, which
   calls the API on the editor's behalf (API_BASE_URL stays server-only).

   The access cookie is kept as long as the refresh cookie (a day) even though
   the JWT inside it expires after 30 minutes: an expired token makes the API
   answer 401, and that is the cue to refresh. Refreshing rotates the refresh
   token, so the new pair MUST be stored — which is only possible in a route
   handler or server action, never while rendering. Hence renders redirect to
   /cms/refresh and actions refresh inline. */

const ACCESS = "pf_cms_access";
const REFRESH = "pf_cms_refresh";
const ONE_DAY = 60 * 60 * 24;

export async function storeTokens(access: string, refresh: string) {
  const jar = await cookies();
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/cms",
    maxAge: ONE_DAY,
  };
  jar.set(ACCESS, access, base);
  jar.set(REFRESH, refresh, base);
}

export async function clearTokens() {
  const jar = await cookies();
  jar.delete({ name: ACCESS, path: "/cms" });
  jar.delete({ name: REFRESH, path: "/cms" });
}

export async function hasSession(): Promise<boolean> {
  const jar = await cookies();
  return Boolean(jar.get(ACCESS)?.value || jar.get(REFRESH)?.value);
}

/* Exchanges the refresh cookie for a new pair and stores it. False = signed out. */
export async function refreshSession(): Promise<boolean> {
  const jar = await cookies();
  const refresh = jar.get(REFRESH)?.value;
  if (!refresh) return false;
  try {
    const data = await apiFetch<{ access: string; refresh?: string }>("/api/token/refresh/", {
      method: "POST",
      json: { refresh },
      revalidate: false,
    });
    await storeTokens(data.access, data.refresh ?? refresh);
    return true;
  } catch {
    return false;
  }
}

/* Where a failed call sends the editor. "render" contexts bounce through the
   refresh route (which returns here); "action" contexts refresh and retry. */
export type CmsContext = { render: string } | "action";

export async function cmsFetch<T>(
  path: string,
  options: ApiFetchOptions,
  ctx: CmsContext,
): Promise<T> {
  const attempt = async (): Promise<T> => {
    const token = (await cookies()).get(ACCESS)?.value;
    if (!token) throw new ApiError("No CMS session", 401, undefined);
    return apiFetch<T>(path, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
      revalidate: false,
    });
  };

  try {
    return await attempt();
  } catch (error) {
    if (!(error instanceof ApiError) || (error.status !== 401 && error.status !== 403)) throw error;
    if (ctx === "action") {
      if (error.status === 401 && (await refreshSession())) return attempt();
      redirect("/cms/login");
    }
    if (error.status === 401 && (await cookies()).get(REFRESH)?.value) {
      redirect(`/cms/refresh?next=${encodeURIComponent(ctx.render)}`);
    }
    redirect("/cms/login");
  }
}

/* Pages call this first so a signed-out visitor goes straight to the form. */
export async function requireSession() {
  if (!(await hasSession())) redirect("/cms/login");
}
