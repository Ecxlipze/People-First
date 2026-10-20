"use client";

import { useState } from "react";
import Link from "next/link";
import { saveVentureAction } from "@/app/cms/actions";
import { useCmsForm } from "@/app/cms/useCmsForm";
import { INITIAL_CMS_STATE, VENTURE_PRESETS, type CmsVenture } from "@/app/cms/types";

const field =
  "mt-1.5 block min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-zinc-900 outline-none focus:border-[#a02f52] focus:ring-2 focus:ring-[#a02f52]/25 aria-[invalid=true]:border-red-500";
const label = "text-sm font-bold text-zinc-800";
const Err = ({ msg }: { msg?: string }) => (msg ? <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{msg}</p> : null);

function initialPreset(v?: CmsVenture): string {
  if (!v) return "crimson";
  const match = VENTURE_PRESETS.find((p) => p.accent.toLowerCase() === (v.accent || "").toLowerCase());
  return match ? match.key : v.accent ? "custom" : "crimson";
}

export default function VentureForm({ item, notice }: { item?: CmsVenture; notice?: string }) {
  const { state, pending, onSubmit } = useCmsForm(saveVentureAction, INITIAL_CMS_STATE);
  const errors = state.errors ?? {};
  const [preset, setPreset] = useState(initialPreset(item));
  const [accent, setAccent] = useState(item?.accent ?? "");
  const [gradient, setGradient] = useState(item?.border_gradient ?? "");
  const [preview, setPreview] = useState<string | null>(item?.logo ?? null);
  const shown = state.status === "success" ? state.message : notice === "saved" ? "Saved." : null;

  const chosen = VENTURE_PRESETS.find((p) => p.key === preset);
  const plateStyle = { background: chosen ? chosen.gradient : gradient || undefined, backgroundColor: chosen?.accent ?? (accent || "#a00017") };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <input type="hidden" name="id" value={item?.id ?? ""} />

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
          <label htmlFor="subtitle" className={label}>Tagline</label>
          <input id="subtitle" name="subtitle" defaultValue={item?.subtitle ?? ""} className={field} placeholder="e.g. Digital Commerce Solutions" />
        </div>
        <div>
          <label htmlFor="website_url" className={label}>Website</label>
          <input id="website_url" name="website_url" defaultValue={item?.website_url ?? ""} aria-invalid={!!errors.website_url} className={field} placeholder="https://  (leave empty if not live yet)" />
          <Err msg={errors.website_url} />
        </div>

        <fieldset>
          <legend className={label}>Card colour</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {VENTURE_PRESETS.map((p) => (
              <label key={p.key} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-bold ${preset === p.key ? "border-[#a02f52] bg-[#a02f52]/5" : "border-zinc-300"}`}>
                <input type="radio" name="preset" value={p.key} checked={preset === p.key} onChange={() => setPreset(p.key)} className="sr-only" />
                <span aria-hidden className="h-5 w-5 rounded-full border border-black/10" style={{ background: p.gradient }} />
                {p.label}
              </label>
            ))}
            <label className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-bold ${preset === "custom" ? "border-[#a02f52] bg-[#a02f52]/5" : "border-zinc-300"}`}>
              <input type="radio" name="preset" value="custom" checked={preset === "custom"} onChange={() => setPreset("custom")} className="sr-only" />
              Custom
            </label>
          </div>
          {preset === "custom" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="accent" className={label}>Accent colour</label>
                <input id="accent" name="accent" value={accent} onChange={(e) => setAccent(e.target.value)} aria-invalid={!!errors.accent} className={field} placeholder="#a00017" />
                <Err msg={errors.accent} />
              </div>
              <div>
                <label htmlFor="border_gradient" className={label}>Border gradient (CSS)</label>
                <input id="border_gradient" name="border_gradient" value={gradient} onChange={(e) => setGradient(e.target.value)} aria-invalid={!!errors.border_gradient} className={field} placeholder="radial-gradient(#fff, #a00017)" />
                <Err msg={errors.border_gradient} />
              </div>
            </div>
          )}
        </fieldset>
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
              {pending ? "Saving…" : item ? "Save changes" : "Add venture"}
            </button>
            <Link href="/cms/ventures" className="inline-flex min-h-11 items-center justify-center text-sm font-bold text-zinc-600 hover:text-zinc-950">← Back to ventures</Link>
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-lg font-extrabold text-[#171922]">Logo &amp; preview</h2>
          <div className="mt-3 grid h-28 place-items-center rounded-xl p-1.5" style={plateStyle}>
            <div className="grid h-full w-full place-items-center rounded-lg bg-white p-2">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-sm font-bold text-zinc-400">No logo</span>
              )}
            </div>
          </div>
          <input name="logo" type="file" accept="image/*" aria-invalid={!!errors.logo} className="mt-3 block w-full text-sm"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }} />
          <Err msg={errors.logo} />
          <p className="mt-2 text-xs text-zinc-500">A transparent PNG or WebP about 200×72 px works best.</p>
        </section>
      </aside>
    </form>
  );
}
