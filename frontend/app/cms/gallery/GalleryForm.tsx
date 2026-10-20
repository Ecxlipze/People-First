"use client";

import { useState } from "react";
import Link from "next/link";
import { saveGalleryItemAction } from "@/app/cms/actions";
import { useCmsForm } from "@/app/cms/useCmsForm";
import { INITIAL_CMS_STATE, type CmsGalleryItem } from "@/app/cms/types";

const field =
  "mt-1.5 block min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-zinc-900 outline-none focus:border-[#a02f52] focus:ring-2 focus:ring-[#a02f52]/25 aria-[invalid=true]:border-red-500";
const label = "text-sm font-bold text-zinc-800";

export default function GalleryForm({ item }: { item: CmsGalleryItem }) {
  const { state, pending, onSubmit } = useCmsForm(saveGalleryItemAction, INITIAL_CMS_STATE);
  const errors = state.errors ?? {};
  const [preview, setPreview] = useState<string | null>(item.image);

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <input type="hidden" name="id" value={item.id} />

      <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        {state.status !== "idle" && (
          <p role={state.status === "error" ? "alert" : "status"} className={`rounded-lg px-4 py-3 text-sm font-medium ${state.status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
            {state.message}
          </p>
        )}
        <div>
          <label htmlFor="alt_text" className={label}>Description for screen readers</label>
          <input id="alt_text" name="alt_text" defaultValue={item.alt_text} aria-invalid={!!errors.alt_text} className={field} placeholder="e.g. Guests seated for a studio interview" />
          <p className="mt-1.5 text-xs text-zinc-500">Read aloud to people who can&apos;t see the photo, and used by search engines.</p>
          {errors.alt_text && <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{errors.alt_text}</p>}
        </div>
        <div>
          <label htmlFor="title" className={label}>Title (internal)</label>
          <input id="title" name="title" defaultValue={item.title} className={field} />
        </div>
        <div>
          <label htmlFor="caption" className={label}>Caption / notes (internal)</label>
          <textarea id="caption" name="caption" rows={3} defaultValue={item.caption} className={`${field} py-2.5`} />
        </div>
        <div>
          <label htmlFor="display_order" className={label}>Position (lower = earlier)</label>
          <input id="display_order" name="display_order" type="number" min={0} defaultValue={item.display_order} className={field} />
        </div>
        <label className="flex min-h-11 items-center gap-3 text-sm font-bold text-zinc-800">
          <input type="checkbox" name="is_active" defaultChecked={item.is_active} className="h-5 w-5 accent-[#a02f52]" />
          Visible on the site
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#a02f52] px-6 font-display text-sm font-bold text-white hover:bg-[#8c2946] disabled:opacity-60">
            {pending ? "Saving…" : "Save changes"}
          </button>
          <Link href="/cms/gallery" className="inline-flex min-h-11 items-center text-sm font-bold text-zinc-600 hover:text-zinc-950">← Back to gallery</Link>
        </div>
      </div>

      <aside className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:self-start">
        <h2 className="font-display text-lg font-extrabold text-[#171922]">Photo</h2>
        <div className="mt-3 aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <label htmlFor="image" className={`${label} mt-4 block`}>Replace photo</label>
        <input
          id="image" name="image" type="file" accept="image/*" className="mt-1.5 block w-full text-sm"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }}
        />
        {errors.image && <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{errors.image}</p>}
      </aside>
    </form>
  );
}
