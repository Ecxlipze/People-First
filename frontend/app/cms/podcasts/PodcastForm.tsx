"use client";

import { useState } from "react";
import Link from "next/link";
import { savePodcastAction } from "@/app/cms/actions";
import { useCmsForm } from "@/app/cms/useCmsForm";
import { INITIAL_CMS_STATE, type CmsPodcast } from "@/app/cms/types";

const field =
  "mt-1.5 block min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-zinc-900 outline-none focus:border-[#a02f52] focus:ring-2 focus:ring-[#a02f52]/25 aria-[invalid=true]:border-red-500";
const label = "text-sm font-bold text-zinc-800";
const card = "rounded-2xl bg-white p-5 shadow-sm sm:p-6";

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function Err({ msg }: { msg?: string }) {
  return msg ? <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{msg}</p> : null;
}

export default function PodcastForm({ episode, notice }: { episode?: CmsPodcast; notice?: string }) {
  const { state, pending, onSubmit } = useCmsForm(savePodcastAction, INITIAL_CMS_STATE);
  const errors = state.errors ?? {};

  const [title, setTitle] = useState(episode?.title ?? "");
  const [slug, setSlug] = useState(episode?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(episode));
  const [description, setDescription] = useState(episode?.description ?? "");
  const [videoUrl, setVideoUrl] = useState(episode?.video_url ?? "");
  const [metricValue, setMetricValue] = useState(episode?.metric_value ?? "");
  const [metricLabel, setMetricLabel] = useState(episode?.metric_label ?? "");
  const [preview, setPreview] = useState<string | null>(episode?.thumbnail ?? null);
  const [lookup, setLookup] = useState<{ busy: boolean; msg?: string; ok?: boolean }>({ busy: false });

  const shown = state.status === "success" ? state.message : notice === "saved" ? "Saved." : null;

  const fetchFromYouTube = async () => {
    if (!videoUrl.trim()) return setLookup({ busy: false, msg: "Paste a YouTube link first.", ok: false });
    setLookup({ busy: true });
    try {
      const res = await fetch(`/cms/youtube-lookup?url=${encodeURIComponent(videoUrl.trim())}`);
      const d = (await res.json()) as {
        success?: boolean; error?: string; title?: string; description?: string;
        thumbnail_url?: string; duration?: string;
      };
      if (!res.ok || !d.success) return setLookup({ busy: false, ok: false, msg: d.error ?? "Could not fetch that video." });
      if (d.title) {
        setTitle(d.title);
        if (!slugTouched) setSlug(slugify(d.title));
      }
      if (d.description && !description.trim()) setDescription(d.description);
      if (d.duration && !metricValue.trim()) {
        setMetricValue(d.duration);
        if (!metricLabel.trim()) setMetricLabel("Episode Duration");
      }
      if (d.thumbnail_url && !episode?.thumbnail) setPreview(d.thumbnail_url);
      setLookup({ busy: false, ok: true, msg: "Filled in from YouTube. The thumbnail is saved automatically." });
    } catch {
      setLookup({ busy: false, ok: false, msg: "Could not reach the server." });
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <input type="hidden" name="id" value={episode?.id ?? ""} />

      <div className="min-w-0 space-y-6">
        {(shown || state.status === "error") && (
          <p role={state.status === "error" ? "alert" : "status"} className={`rounded-lg px-4 py-3 text-sm font-medium ${state.status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
            {state.status === "error" ? state.message : shown}
          </p>
        )}

        <section className={card}>
          <label htmlFor="video_url" className={label}>YouTube link</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <input
              id="video_url" name="video_url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
              aria-invalid={!!errors.video_url} placeholder="https://www.youtube.com/watch?v=…"
              className={`${field} mt-0 min-w-0 flex-1`}
            />
            <button type="button" onClick={fetchFromYouTube} disabled={lookup.busy} className="min-h-11 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60">
              {lookup.busy ? "Fetching…" : "Fetch from YouTube"}
            </button>
          </div>
          <Err msg={errors.video_url} />
          {lookup.msg && <p role={lookup.ok ? "status" : "alert"} className={`mt-1.5 text-sm font-medium ${lookup.ok ? "text-emerald-700" : "text-red-700"}`}>{lookup.msg}</p>}

          <label htmlFor="title" className={`${label} mt-5 block`}>Title</label>
          <input
            id="title" name="title" required value={title} aria-invalid={!!errors.title}
            onChange={(e) => { setTitle(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }}
            className={`${field} font-display text-lg font-extrabold`}
          />
          <Err msg={errors.title} />

          <label htmlFor="description" className={`${label} mt-5 block`}>Description</label>
          <textarea id="description" name="description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={!!errors.description} className={`${field} py-2.5`} />
          <Err msg={errors.description} />

          <label htmlFor="slug" className={`${label} mt-5 block`}>Page address (URL)</label>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="shrink-0 text-sm text-zinc-500">/podcasts#</span>
            <input id="slug" name="slug" required value={slug} aria-invalid={!!errors.slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} className={`${field} mt-0`} />
          </div>
          <Err msg={errors.slug} />
        </section>

        <section className={card}>
          <h2 className="font-display text-lg font-extrabold text-[#171922]">Highlights (optional)</h2>
          <p className="mt-1 text-sm text-zinc-600">Two short facts shown under the description, e.g. “45 min — Episode Duration”.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="metric_value" className={label}>Highlight 1 heading</label>
              <input id="metric_value" name="metric_value" value={metricValue} onChange={(e) => setMetricValue(e.target.value)} className={field} />
            </div>
            <div>
              <label htmlFor="metric_label" className={label}>Highlight 1 text</label>
              <input id="metric_label" name="metric_label" value={metricLabel} onChange={(e) => setMetricLabel(e.target.value)} className={field} />
            </div>
            <div>
              <label htmlFor="supporting_title" className={label}>Highlight 2 heading</label>
              <input id="supporting_title" name="supporting_title" defaultValue={episode?.supporting_title ?? ""} className={field} />
            </div>
            <div>
              <label htmlFor="supporting_content" className={label}>Highlight 2 text</label>
              <input id="supporting_content" name="supporting_content" defaultValue={episode?.supporting_content ?? ""} className={field} />
            </div>
            <div>
              <label htmlFor="badge" className={label}>Badge text</label>
              <input id="badge" name="badge" defaultValue={episode?.badge ?? ""} className={field} />
            </div>
            <div>
              <label htmlFor="badge_colour" className={label}>Badge colour (e.g. #2dbe9e)</label>
              <input id="badge_colour" name="badge_colour" defaultValue={episode?.badge_colour ?? ""} aria-invalid={!!errors.badge_colour} className={field} />
              <Err msg={errors.badge_colour} />
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto lg:pb-1">
        <section className={card}>
          <h2 className="font-display text-lg font-extrabold text-[#171922]">Publish</h2>
          <label className="mt-4 flex min-h-11 items-center gap-3 text-sm font-bold text-zinc-800">
            <input type="checkbox" name="is_active" defaultChecked={episode ? episode.is_active : true} className="h-5 w-5 accent-[#a02f52]" />
            Visible on the site
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-bold text-zinc-800">
            <input type="checkbox" name="is_featured" defaultChecked={episode?.is_featured ?? false} className="h-5 w-5 accent-[#a02f52]" />
            Featured on Media / Events
          </label>
          <label htmlFor="order" className={`${label} mt-2 block`}>Order (lower = earlier)</label>
          <input id="order" name="order" type="number" min={0} defaultValue={episode?.order ?? 0} className={field} />

          <div className="mt-5 flex flex-col gap-2">
            <button disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946] disabled:opacity-60">
              {pending ? "Saving…" : episode ? "Save changes" : "Add episode"}
            </button>
            <Link href="/cms/podcasts" className="inline-flex min-h-11 items-center justify-center text-sm font-bold text-zinc-600 hover:text-zinc-950">← Back to podcasts</Link>
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display text-lg font-extrabold text-[#171922]">Thumbnail</h2>
          {preview ? (
            <div className="mt-3 aspect-video overflow-hidden rounded-lg bg-zinc-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <p className="mt-3 rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">No thumbnail yet</p>
          )}
          <input
            name="thumbnail" type="file" accept="image/*" className="mt-3 block w-full text-sm"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }}
          />
          <p className="mt-2 text-xs text-zinc-500">Leave empty to use the YouTube thumbnail automatically.</p>
        </section>
      </aside>
    </form>
  );
}
