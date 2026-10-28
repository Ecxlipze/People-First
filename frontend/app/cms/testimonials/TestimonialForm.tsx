"use client";

import { useState } from "react";
import Link from "next/link";
import { saveTestimonialAction } from "@/app/cms/actions";
import { useCmsForm } from "@/app/cms/useCmsForm";
import { INITIAL_CMS_STATE, type CmsTestimonial } from "@/app/cms/types";

const field =
  "mt-1.5 block min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-zinc-900 outline-none focus:border-[#a02f52] focus:ring-2 focus:ring-[#a02f52]/25 aria-[invalid=true]:border-red-500";
const label = "text-sm font-bold text-zinc-800";
const Err = ({ msg }: { msg?: string }) => (msg ? <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{msg}</p> : null);

export default function TestimonialForm({ item, notice }: { item?: CmsTestimonial; notice?: string }) {
  const { state, pending, onSubmit } = useCmsForm(saveTestimonialAction, INITIAL_CMS_STATE);
  const errors = state.errors ?? {};
  const [preview, setPreview] = useState<string | null>(item?.avatar ?? null);
  const [removed, setRemoved] = useState(false);
  const shown = state.status === "success" ? state.message : notice === "saved" ? "Saved." : null;

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <input type="hidden" name="remove_avatar" value={removed ? "1" : ""} />

      <div className="min-w-0 space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        {(shown || state.status === "error") && (
          <p role={state.status === "error" ? "alert" : "status"} className={`rounded-lg px-4 py-3 text-sm font-medium ${state.status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
            {state.status === "error" ? state.message : shown}
          </p>
        )}
        <div>
          <label htmlFor="name" className={label}>Name</label>
          <input id="name" name="name" required defaultValue={item?.name ?? ""} aria-invalid={!!errors.name} className={field} />
          <Err msg={errors.name} />
        </div>
        <div>
          <label htmlFor="handle" className={label}>Role or social handle</label>
          <input id="handle" name="handle" defaultValue={item?.handle ?? ""} className={field} placeholder="e.g. CEO, Merchanity  or  @username" />
        </div>
        <div>
          <label htmlFor="body" className={label}>What they said</label>
          <textarea id="body" name="body" required rows={6} defaultValue={item?.body ?? ""} aria-invalid={!!errors.body} className={`${field} py-2.5`} />
          <Err msg={errors.body} />
        </div>
        <div>
          <label htmlFor="tags" className={label}>Tags</label>
          <input id="tags" name="tags" defaultValue={(item?.tags ?? []).join(", ")} className={field} placeholder="Separate with commas, e.g. training, growth" />
        </div>
      </div>

      <aside className="space-y-6 lg:self-start">
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-lg font-extrabold text-[#171922]">Publish</h2>
          <label className="mt-3 flex min-h-11 items-center gap-3 text-sm font-bold text-zinc-800">
            <input type="checkbox" name="is_active" defaultChecked={item ? item.is_active : true} className="h-5 w-5 accent-[#a02f52]" />
            Visible on the site
          </label>
          <label htmlFor="display_order" className={`${label} mt-2 block`}>Position (lower = earlier)</label>
          <input id="display_order" name="display_order" type="number" min={0} defaultValue={item?.display_order ?? 0} className={field} />
          <div className="mt-5 flex flex-col gap-2">
            <button disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946] disabled:opacity-60">
              {pending ? "Saving…" : item ? "Save changes" : "Add testimonial"}
            </button>
            <Link href="/cms/testimonials" className="inline-flex min-h-11 items-center justify-center text-sm font-bold text-zinc-600 hover:text-zinc-950">← Back to testimonials</Link>
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-lg font-extrabold text-[#171922]">Photo</h2>
          <div className="mt-3 grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-[#a02f52]/10">
            {preview && !removed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-3xl font-extrabold text-[#a02f52]">{(item?.name ?? "?").charAt(0).toUpperCase()}</span>
            )}
          </div>
          <input name="avatar" type="file" accept="image/*" aria-invalid={!!errors.avatar} className="mt-3 block w-full text-sm"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setPreview(URL.createObjectURL(f)); setRemoved(false); } }} />
          <Err msg={errors.avatar} />
          <p className="mt-2 text-xs text-zinc-500">Square works best. With no photo, a coloured initial is shown.</p>
          {item?.avatar && !removed && (
            <button type="button" onClick={() => { setRemoved(true); setPreview(null); }} className="mt-1 min-h-11 text-sm font-bold text-red-700">Remove photo</button>
          )}
        </section>
      </aside>
    </form>
  );
}
