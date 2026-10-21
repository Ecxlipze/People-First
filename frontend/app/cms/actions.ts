"use server";

/* Server Actions behind the blog CMS (/cms). Every write is re-validated here
   and sent to the Django API with the editor's own JWT, so Django remains the
   authority on who may publish. */

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, ApiNotConfiguredError, apiFetch } from "@/app/lib/api";
import { clearTokens, cmsFetch, getRole, setDisplayName, storeTokens } from "@/app/cms/session";
import { SLUG_RE, VENTURE_PRESETS, type CmsCategory, type CmsFormState, type CmsGalleryItem, type CmsPost, type CmsProfile } from "@/app/cms/types";

const GENERIC = "Something went wrong talking to the server. Please try again.";

/* DRF answers { field: ["message"] }; flatten to the first message per field. */
function fieldErrors(payload: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    for (const [key, raw] of Object.entries(payload as Record<string, unknown>)) {
      const message = Array.isArray(raw) ? raw[0] : raw;
      if (typeof message === "string") out[key] = message;
    }
  }
  return out;
}

/* A change to a post must show on the public pages straight away rather than
   after the 5-minute content cache. */
function refreshPublicPages(slug?: string) {
  revalidatePath("/media-events");
  revalidatePath("/ideas-lab");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/media-events/${slug}`);
}

export async function loginAction(_prev: CmsFormState, formData: FormData): Promise<CmsFormState> {
  const username = (formData.get("username") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();
  if (!username || !password) return { status: "error", message: "Enter your username and password." };

  try {
    const tokens = await apiFetch<{ access: string; refresh: string }>("/api/token/", {
      method: "POST",
      json: { username, password },
      revalidate: false,
    });
    /* A valid login is not enough: only staff and Blog Authors may use the CMS. */
    const who = await apiFetch<{ role: "staff" | "author"; display_name: string }>("/api/blog-session/", {
      headers: { Authorization: `Bearer ${tokens.access}` },
      revalidate: false,
    });
    await storeTokens(tokens.access, tokens.refresh, { role: who.role, name: who.display_name });
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return { status: "error", message: "Too many attempts. Please wait a minute and try again." };
    }
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return {
        status: "error",
        message:
          error.status === 403
            ? "This account is not allowed to edit content."
            : "That username or password is not right.",
      };
    }
    if (error instanceof ApiNotConfiguredError) return { status: "error", message: "The content server is not configured." };
    return { status: "error", message: GENERIC };
  }
  redirect("/cms");
}

/* ── Profile ──────────────────────────────────────────────────────────────── */

export async function saveProfileAction(_prev: CmsFormState, formData: FormData): Promise<CmsFormState> {
  const get = (k: string) => (formData.get(k) ?? "").toString().trim();
  try {
    const saved = await cmsFetch<CmsProfile>(
      "/api/profile/",
      { method: "PATCH", json: { first_name: get("first_name"), last_name: get("last_name"), email: get("email") } },
      "action",
    );
    await setDisplayName(saved.display_name);
    revalidatePath("/cms", "layout");
    return { status: "success", message: "Profile saved." };
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(error.payload) };
    }
    return { status: "error", message: GENERIC };
  }
}

export async function changePasswordAction(_prev: CmsFormState, formData: FormData): Promise<CmsFormState> {
  const get = (k: string) => (formData.get(k) ?? "").toString();
  const next = get("new_password");
  if (next !== get("confirm_password")) {
    return { status: "error", message: "Please fix the highlighted fields.", errors: { confirm_password: "The two new passwords don't match." } };
  }
  try {
    await cmsFetch("/api/profile/password/", { method: "POST", json: { current_password: get("current_password"), new_password: next } }, "action");
    return { status: "success", message: "Password changed. Use it next time you sign in." };
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return { status: "error", message: "Too many attempts. Please wait a minute and try again." };
    }
    if (error instanceof ApiError && error.status === 400) {
      return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(error.payload) };
    }
    return { status: "error", message: GENERIC };
  }
}

export async function logoutAction() {
  await clearTokens();
  redirect("/cms/login");
}

export async function createCategoryAction(name: string): Promise<{ category?: CmsCategory; error?: string }> {
  const clean = name.trim();
  if (!clean) return { error: "Enter a category name." };
  const slug = clean
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) return { error: "Use letters or numbers in the name." };
  try {
    const category = await cmsFetch<CmsCategory>(
      "/api/blog-categories/",
      { method: "POST", json: { name: clean, slug } },
      "action",
    );
    return { category };
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) return { error: "A category with that name already exists." };
    return { error: GENERIC };
  }
}

const TEXT_FIELDS = [
  "title", "slug", "excerpt", "content", "featured_image_alt", "author_name",
  "meta_title", "meta_description",
  "metric", "metric_label", "card_value", "card_label", "video_url", "studio_image_alt",
] as const;

/* intent: "draft" | "publish" | "unpublish" | "save" (keep current status) */
export async function savePostAction(_prev: CmsFormState, formData: FormData): Promise<CmsFormState> {
  const get = (k: string) => (formData.get(k) ?? "").toString();
  const originalSlug = get("originalSlug");
  /* Authors can only save drafts; Django enforces it, this just keeps the UI honest. */
  const author = (await getRole()) !== "staff";
  const intent = author ? "draft" : get("intent");

  const title = get("title").trim();
  const slug = get("slug").trim();
  const content = get("content");
  const errors: Record<string, string> = {};
  if (!title) errors.title = "Give the post a title.";
  if (!slug) errors.slug = "The URL can't be empty.";
  else if (!SLUG_RE.test(slug)) errors.slug = "Use lowercase letters, numbers and hyphens only.";
  if (intent === "publish" && !content.replace(/<[^>]*>/g, "").trim() && !content.includes("<img")) {
    errors.content = "Write something before publishing.";
  }
  if (get("meta_title").length > 70) errors.meta_title = "Keep the meta title to 70 characters.";
  if (get("meta_description").length > 160) errors.meta_description = "Keep the meta description to 160 characters.";
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const body = new FormData();
  for (const key of TEXT_FIELDS) if (!(author && key === "author_name")) body.set(key, get(key));
  body.set("title", title);
  body.set("slug", slug);
  body.set("category", get("category"));
  if (!author) body.set("order", get("order") || "0");

  /* The editor's current status is posted as `status`; the button decides. */
  const current = get("status") === "published" ? "published" : "draft";
  const status = author ? "draft" : intent === "publish" ? "published" : intent === "unpublish" ? "draft" : current;
  body.set("status", status);
  /* Empty publish date = "now" (the model stamps it on first publish). */
  const when = get("published_at");
  if (status === "published" && when) body.set("published_at", when);

  const image = formData.get("featured_image");
  if (image instanceof File && image.size > 0) body.set("featured_image", image);
  else if (get("remove_image") === "1") body.set("featured_image", "");
  const studio = formData.get("studio_image");
  if (studio instanceof File && studio.size > 0) body.set("studio_image", studio);

  try {
    const saved = originalSlug
      ? await cmsFetch<CmsPost>(`/api/blog-posts/${encodeURIComponent(originalSlug)}/`, { method: "PATCH", formData: body }, "action")
      : await cmsFetch<CmsPost>("/api/blog-posts/", { method: "POST", formData: body }, "action");

    refreshPublicPages(saved.slug);
    if (originalSlug && originalSlug !== saved.slug) refreshPublicPages(originalSlug);

    const notice = intent === "publish" ? "published" : intent === "unpublish" ? "unpublished" : "saved";
    if (!originalSlug || originalSlug !== saved.slug) {
      redirect(`/cms/posts/${saved.slug}?notice=${notice}`);
    }
    return {
      status: "success",
      message:
        notice === "published" ? "Published — it is live on the site now."
        : notice === "unpublished" ? "Moved back to drafts."
        : "Saved.",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      const fields = fieldErrors(error.payload);
      if (error.status === 400 && Object.keys(fields).length > 0) {
        if (fields.slug) fields.slug = "That URL is already used by another post.";
        return { status: "error", message: "Please fix the highlighted fields.", errors: fields };
      }
    }
    throw error;
  }
}

export async function setStatusAction(formData: FormData) {
  const slug = (formData.get("slug") ?? "").toString();
  const status = formData.get("status") === "published" ? "published" : "draft";
  if (!slug) return;
  const body = new FormData();
  body.set("status", status);
  await cmsFetch(`/api/blog-posts/${encodeURIComponent(slug)}/`, { method: "PATCH", formData: body }, "action");
  refreshPublicPages(slug);
  revalidatePath("/cms");
}

export async function deletePostAction(formData: FormData) {
  const slug = (formData.get("slug") ?? "").toString();
  if (!slug) return;
  await cmsFetch(`/api/blog-posts/${encodeURIComponent(slug)}/`, { method: "DELETE" }, "action");
  refreshPublicPages(slug);
  redirect("/cms?notice=deleted");
}

/* ── Podcasts ─────────────────────────────────────────────────────────────── */

function refreshPodcastPages() {
  revalidatePath("/podcasts");
  revalidatePath("/media-events");
  revalidatePath("/cms/podcasts");
}

const PODCAST_TEXT = [
  "title", "slug", "description", "video_url", "badge", "badge_colour",
  "metric_value", "metric_label", "supporting_title", "supporting_content",
] as const;

export async function savePodcastAction(_prev: CmsFormState, formData: FormData): Promise<CmsFormState> {
  const get = (k: string) => (formData.get(k) ?? "").toString();
  const id = get("id");

  const title = get("title").trim();
  const slug = get("slug").trim();
  const colour = get("badge_colour").trim();
  const errors: Record<string, string> = {};
  if (!title) errors.title = "Give the episode a title.";
  if (!slug) errors.slug = "The URL can't be empty.";
  else if (!SLUG_RE.test(slug)) errors.slug = "Use lowercase letters, numbers and hyphens only.";
  if (!get("description").trim()) errors.description = "Add a short description.";
  if (colour && !/^#[0-9a-fA-F]{6}$/.test(colour)) errors.badge_colour = "Use a colour like #2dbe9e, or leave blank.";
  if (get("video_url") && !/^https?:\/\//i.test(get("video_url"))) errors.video_url = "Paste the full link, starting with https://";
  if (Object.keys(errors).length > 0) return { status: "error", message: "Please fix the highlighted fields.", errors };

  const body = new FormData();
  for (const key of PODCAST_TEXT) body.set(key, get(key));
  body.set("title", title);
  body.set("slug", slug);
  body.set("order", get("order") || "0");
  body.set("is_featured", get("is_featured") === "on" ? "true" : "false");
  body.set("is_active", get("is_active") === "on" ? "true" : "false");
  const image = formData.get("thumbnail");
  if (image instanceof File && image.size > 0) body.set("thumbnail", image);

  try {
    const saved = id
      ? await cmsFetch<{ id: number }>(`/api/podcasts/${encodeURIComponent(id)}/`, { method: "PATCH", formData: body }, "action")
      : await cmsFetch<{ id: number }>("/api/podcasts/", { method: "POST", formData: body }, "action");
    refreshPodcastPages();
    if (!id) redirect(`/cms/podcasts/${saved.id}?notice=saved`);
    return { status: "success", message: "Saved." };
  } catch (error) {
    if (error instanceof ApiError) {
      const fields = fieldErrors(error.payload);
      if (error.status === 400 && Object.keys(fields).length > 0) {
        if (fields.slug) fields.slug = "That URL is already used by another episode.";
        return { status: "error", message: "Please fix the highlighted fields.", errors: fields };
      }
    }
    throw error;
  }
}

export async function setPodcastActiveAction(formData: FormData) {
  const id = (formData.get("id") ?? "").toString();
  if (!id) return;
  const body = new FormData();
  body.set("is_active", formData.get("is_active") === "true" ? "true" : "false");
  await cmsFetch(`/api/podcasts/${encodeURIComponent(id)}/`, { method: "PATCH", formData: body }, "action");
  refreshPodcastPages();
}

export async function deletePodcastAction(formData: FormData) {
  const id = (formData.get("id") ?? "").toString();
  if (!id) return;
  await cmsFetch(`/api/podcasts/${encodeURIComponent(id)}/`, { method: "DELETE" }, "action");
  refreshPodcastPages();
  redirect("/cms/podcasts?notice=deleted");
}

export async function syncPodcastsAction() {
  let notice: string;
  try {
    const r = await cmsFetch<{ created: number; updated: number }>("/api/podcasts/sync/", { method: "POST", json: {} }, "action");
    notice = `synced-${r.created}`;
  } catch (error) {
    if (error instanceof ApiError && error.status === 502) notice = "sync-failed";
    else throw error;
  }
  refreshPodcastPages();
  redirect(`/cms/podcasts?notice=${notice}`);
}

/* ── Gallery ──────────────────────────────────────────────────────────────── */

function refreshGalleryPages() {
  revalidatePath("/home");
  revalidatePath("/cms/gallery");
}

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/* "IMG_2041-team photo.JPG" -> "IMG 2041 team photo": a readable starting title. */
function titleFromFilename(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}

export async function uploadGalleryAction(formData: FormData) {
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) redirect("/cms/gallery?notice=no-files");
  if (files.some((f) => !f.type.startsWith("image/"))) redirect("/cms/gallery?notice=bad-type");
  if (files.some((f) => f.size > MAX_PHOTO_BYTES)) redirect("/cms/gallery?notice=too-big");

  /* New photos go to the end of the carousel. */
  const existing = await cmsFetch<CmsGalleryItem[]>("/api/gallery/", {}, "action");
  let next = existing.reduce((m, g) => Math.max(m, g.display_order), -1) + 1;

  let added = 0;
  for (const file of files) {
    const body = new FormData();
    body.set("image", file);
    body.set("title", titleFromFilename(file.name));
    body.set("display_order", String(next++));
    body.set("is_active", "true");
    try {
      await cmsFetch("/api/gallery/", { method: "POST", formData: body }, "action");
      added += 1;
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 400)) throw error;
    }
  }
  refreshGalleryPages();
  redirect(`/cms/gallery?notice=${added === files.length ? `added-${added}` : `partial-${added}`}`);
}

export async function saveGalleryItemAction(_prev: CmsFormState, formData: FormData): Promise<CmsFormState> {
  const get = (k: string) => (formData.get(k) ?? "").toString();
  const id = get("id");
  if (!/^\d+$/.test(id)) return { status: "error", message: "Unknown photo." };

  const body = new FormData();
  body.set("title", get("title").trim());
  body.set("caption", get("caption").trim());
  body.set("alt_text", get("alt_text").trim());
  body.set("display_order", get("display_order") || "0");
  body.set("is_active", get("is_active") === "on" ? "true" : "false");
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) return { status: "error", message: "Choose an image file.", errors: { image: "Choose an image file." } };
    if (image.size > MAX_PHOTO_BYTES) return { status: "error", message: "That image is over 10 MB.", errors: { image: "Images must be 10 MB or smaller." } };
    body.set("image", image);
  }

  try {
    await cmsFetch(`/api/gallery/${id}/`, { method: "PATCH", formData: body }, "action");
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(error.payload) };
    }
    throw error;
  }
  refreshGalleryPages();
  return { status: "success", message: "Saved." };
}

export async function setGalleryActiveAction(formData: FormData) {
  const id = (formData.get("id") ?? "").toString();
  if (!id) return;
  const body = new FormData();
  body.set("is_active", formData.get("is_active") === "true" ? "true" : "false");
  await cmsFetch(`/api/gallery/${encodeURIComponent(id)}/`, { method: "PATCH", formData: body }, "action");
  refreshGalleryPages();
}

/* Swap a photo with its neighbour. Orders are rewritten as 0..n-1 so ties and
   gaps from older data can't make a move look like it did nothing. */
export async function moveGalleryAction(formData: FormData) {
  const id = Number((formData.get("id") ?? "").toString());
  const dir = formData.get("dir") === "up" ? -1 : 1;
  const items = await cmsFetch<CmsGalleryItem[]>("/api/gallery/", {}, "action");
  const order = [...items].sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const from = order.findIndex((g) => g.id === id);
  const to = from + dir;
  if (from < 0 || to < 0 || to >= order.length) return;
  [order[from], order[to]] = [order[to], order[from]];

  for (const [index, item] of order.entries()) {
    if (item.display_order === index) continue;
    const body = new FormData();
    body.set("display_order", String(index));
    await cmsFetch(`/api/gallery/${item.id}/`, { method: "PATCH", formData: body }, "action");
  }
  refreshGalleryPages();
}

export async function deleteGalleryItemAction(formData: FormData) {
  const id = (formData.get("id") ?? "").toString();
  if (!id) return;
  await cmsFetch(`/api/gallery/${encodeURIComponent(id)}/`, { method: "DELETE" }, "action");
  refreshGalleryPages();
  redirect("/cms/gallery?notice=deleted");
}

/* ── Inquiries ────────────────────────────────────────────────────────────── */

const INQUIRY_STATUSES = ["new", "read", "replied", "archived"];

export async function updateInquiryAction(_prev: CmsFormState, formData: FormData): Promise<CmsFormState> {
  const id = (formData.get("id") ?? "").toString();
  const status = (formData.get("status") ?? "").toString();
  if (!/^\d+$/.test(id) || !INQUIRY_STATUSES.includes(status)) return { status: "error", message: "Unknown inquiry or status." };

  await cmsFetch(
    `/api/inquiries/${id}/`,
    { method: "PATCH", json: { status, staff_notes: (formData.get("staff_notes") ?? "").toString().trim() } },
    "action",
  );
  revalidatePath("/cms/inquiries");
  return { status: "success", message: "Saved." };
}

export async function deleteInquiryAction(formData: FormData) {
  const id = (formData.get("id") ?? "").toString();
  if (!/^\d+$/.test(id)) return;
  await cmsFetch(`/api/inquiries/${id}/`, { method: "DELETE" }, "action");
  revalidatePath("/cms/inquiries");
  redirect("/cms/inquiries?notice=deleted");
}

/* ── Testimonials & ventures (same shape as the gallery) ──────────────────── */

type Orderable = { id: number; display_order: number };

/* Swap an item with its neighbour, rewriting orders as 0..n-1 so gaps and ties
   in older data can't make a move look like it did nothing. */
async function moveOrdered(resource: "testimonials" | "ventures", formData: FormData) {
  const id = Number((formData.get("id") ?? "").toString());
  const dir = formData.get("dir") === "up" ? -1 : 1;
  const items = await cmsFetch<Orderable[]>(`/api/${resource}/`, {}, "action");
  const order = [...items].sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const from = order.findIndex((g) => g.id === id);
  const to = from + dir;
  if (from < 0 || to < 0 || to >= order.length) return;
  [order[from], order[to]] = [order[to], order[from]];
  for (const [index, item] of order.entries()) {
    if (item.display_order === index) continue;
    const body = new FormData();
    body.set("display_order", String(index));
    await cmsFetch(`/api/${resource}/${item.id}/`, { method: "PATCH", formData: body }, "action");
  }
}

async function setActive(resource: "testimonials" | "ventures", formData: FormData) {
  const id = (formData.get("id") ?? "").toString();
  if (!/^\d+$/.test(id)) return;
  const body = new FormData();
  body.set("is_active", formData.get("is_active") === "true" ? "true" : "false");
  await cmsFetch(`/api/${resource}/${id}/`, { method: "PATCH", formData: body }, "action");
}

async function remove(resource: "testimonials" | "ventures", formData: FormData) {
  const id = (formData.get("id") ?? "").toString();
  if (!/^\d+$/.test(id)) return;
  await cmsFetch(`/api/${resource}/${id}/`, { method: "DELETE" }, "action");
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function imageProblem(file: unknown): string | null {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!file.type.startsWith("image/")) return "Choose an image file.";
  if (file.size > MAX_IMAGE_BYTES) return "Images must be 10 MB or smaller.";
  return null;
}

const HTTP_URL = /^https?:\/\/\S+$/i;

export async function moveTestimonialAction(formData: FormData) {
  await moveOrdered("testimonials", formData);
  revalidatePath("/home");
  revalidatePath("/cms/testimonials");
}
export async function setTestimonialActiveAction(formData: FormData) {
  await setActive("testimonials", formData);
  revalidatePath("/home");
  revalidatePath("/cms/testimonials");
}
export async function deleteTestimonialAction(formData: FormData) {
  await remove("testimonials", formData);
  revalidatePath("/home");
  redirect("/cms/testimonials?notice=deleted");
}

export async function saveTestimonialAction(_prev: CmsFormState, formData: FormData): Promise<CmsFormState> {
  const get = (k: string) => (formData.get(k) ?? "").toString().trim();
  const id = get("id");

  const errors: Record<string, string> = {};
  if (!get("name")) errors.name = "Enter the person's name.";
  if (!get("body")) errors.body = "Enter what they said.";
  if (get("social_url") && !HTTP_URL.test(get("social_url"))) errors.social_url = "Paste the full link, starting with https://";
  const avatarProblem = imageProblem(formData.get("avatar"));
  if (avatarProblem) errors.avatar = avatarProblem;
  if (Object.keys(errors).length > 0) return { status: "error", message: "Please fix the highlighted fields.", errors };

  const tags = get("tags").split(",").map((t) => t.trim().replace(/^#+/, "")).filter(Boolean);
  const body = new FormData();
  body.set("name", get("name"));
  body.set("handle", get("handle"));
  body.set("body", get("body"));
  /* A JSON field in a multipart request must be sent as a JSON string. */
  body.set("tags", JSON.stringify(tags));
  body.set("social_url", get("social_url"));
  body.set("display_order", get("display_order") || "0");
  body.set("is_active", get("is_active") === "on" ? "true" : "false");
  const avatar = formData.get("avatar");
  if (avatar instanceof File && avatar.size > 0) body.set("avatar", avatar);
  else if (get("remove_avatar") === "1") body.set("avatar", "");

  try {
    const saved = id
      ? await cmsFetch<{ id: number }>(`/api/testimonials/${id}/`, { method: "PATCH", formData: body }, "action")
      : await cmsFetch<{ id: number }>("/api/testimonials/", { method: "POST", formData: body }, "action");
    revalidatePath("/home");
    revalidatePath("/cms/testimonials");
    if (!id) redirect(`/cms/testimonials/${saved.id}?notice=saved`);
    return { status: "success", message: "Saved." };
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      const fields = fieldErrors(error.payload);
      if (Object.keys(fields).length > 0) return { status: "error", message: "Please fix the highlighted fields.", errors: fields };
    }
    throw error;
  }
}

export async function moveVentureAction(formData: FormData) {
  await moveOrdered("ventures", formData);
  revalidatePath("/home");
  revalidatePath("/cms/ventures");
}
export async function setVentureActiveAction(formData: FormData) {
  await setActive("ventures", formData);
  revalidatePath("/home");
  revalidatePath("/cms/ventures");
}
export async function deleteVentureAction(formData: FormData) {
  await remove("ventures", formData);
  revalidatePath("/home");
  redirect("/cms/ventures?notice=deleted");
}

/* A custom gradient ends up in an inline style, so only plain CSS gradients
   made of colours and percentages are accepted. */
const GRADIENT_RE = /^(radial|linear)-gradient\([#0-9a-zA-Z%.,\s()-]{3,200}\)$/;

export async function saveVentureAction(_prev: CmsFormState, formData: FormData): Promise<CmsFormState> {
  const get = (k: string) => (formData.get(k) ?? "").toString().trim();
  const id = get("id");
  const preset = get("preset");

  const errors: Record<string, string> = {};
  if (!get("name")) errors.name = "Enter the venture's name.";
  if (get("website_url") && !HTTP_URL.test(get("website_url"))) errors.website_url = "Paste the full link, starting with https://";
  const logoProblem = imageProblem(formData.get("logo"));
  if (logoProblem) errors.logo = logoProblem;

  let accent = get("accent");
  let gradient = get("border_gradient");
  const chosen = VENTURE_PRESETS.find((p) => p.key === preset);
  if (chosen) {
    accent = chosen.accent;
    gradient = chosen.gradient;
  } else {
    if (!/^#[0-9a-fA-F]{6}$/.test(accent)) errors.accent = "Use a colour like #a00017.";
    if (gradient && !GRADIENT_RE.test(gradient)) errors.border_gradient = "Enter a CSS gradient such as radial-gradient(#fff, #a00017).";
  }
  if (Object.keys(errors).length > 0) return { status: "error", message: "Please fix the highlighted fields.", errors };

  const body = new FormData();
  body.set("name", get("name"));
  body.set("subtitle", get("subtitle"));
  body.set("website_url", get("website_url"));
  body.set("accent", accent);
  body.set("border_gradient", gradient);
  body.set("display_order", get("display_order") || "0");
  body.set("is_active", get("is_active") === "on" ? "true" : "false");
  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) body.set("logo", logo);

  try {
    const saved = id
      ? await cmsFetch<{ id: number }>(`/api/ventures/${id}/`, { method: "PATCH", formData: body }, "action")
      : await cmsFetch<{ id: number }>("/api/ventures/", { method: "POST", formData: body }, "action");
    revalidatePath("/home");
    revalidatePath("/cms/ventures");
    if (!id) redirect(`/cms/ventures/${saved.id}?notice=saved`);
    return { status: "success", message: "Saved." };
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      const fields = fieldErrors(error.payload);
      if (Object.keys(fields).length > 0) return { status: "error", message: "Please fix the highlighted fields.", errors: fields };
    }
    throw error;
  }
}
