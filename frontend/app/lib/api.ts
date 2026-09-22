/* The single place the Next.js server talks to the Django REST API
   (backend/ in this repo).

   Server-only by convention: the base URL is read from API_BASE_URL, which is
   deliberately *not* NEXT_PUBLIC_*, so the API origin is never inlined into the
   client bundle. Anything that needs API data renders on the server. */

export class ApiError extends Error {
  readonly status: number;
  /* Parsed response body when the API returned JSON, otherwise undefined.
     DRF validation failures arrive here as { field: ["message", …] }. */
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

/* Thrown when API_BASE_URL is missing, so a misconfigured deploy fails loudly
   at the call site instead of quietly fetching "undefined/api/…". */
export class ApiNotConfiguredError extends Error {
  constructor() {
    super("API_BASE_URL is not set — see .env.example");
    this.name = "ApiNotConfiguredError";
  }
}

/* Trailing slash trimmed here so callers can always pass a leading-slash path;
   Django's APPEND_SLASH conventions mean the paths themselves keep their
   trailing slash ("/api/inquiries/"). */
function baseUrl(): string {
  const raw = process.env.API_BASE_URL?.trim();
  if (!raw) throw new ApiNotConfiguredError();
  return raw.replace(/\/+$/, "");
}

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  /* JSON-serialised automatically; set Content-Type for you. */
  json?: unknown;
  /* Seconds. Content reads should cache; mutations must not. */
  revalidate?: number | false;
};

export async function apiFetch<T>(
  path: string,
  { json, revalidate, headers, ...init }: ApiFetchOptions = {},
): Promise<T> {
  const url = `${baseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(json !== undefined ? { "Content-Type": "application/json" } : null),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : undefined,
    /* A mutation must never be served from the Next data cache, and must never
       be revalidated into one. */
    cache: revalidate === false ? "no-store" : init.cache,
    next: typeof revalidate === "number" ? { revalidate } : undefined,
  });

  /* Read the body once, then decide — an error response may be JSON (DRF field
     errors) or an HTML debug page, and we want both in the thrown error. */
  const text = await res.text();
  let payload: unknown;
  try {
    payload = text ? JSON.parse(text) : undefined;
  } catch {
    payload = text || undefined;
  }

  if (!res.ok) {
    throw new ApiError(`${res.status} ${res.statusText} for ${path}`, res.status, payload);
  }

  return payload as T;
}
