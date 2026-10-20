"use client";

import { useState } from "react";
import { updateInquiryAction } from "@/app/cms/actions";
import { useCmsForm } from "@/app/cms/useCmsForm";
import { INITIAL_CMS_STATE, INQUIRY_STATUS_LABEL, type CmsInquiry, type InquiryStatus } from "@/app/cms/types";

const field =
  "mt-1.5 block min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-zinc-900 outline-none focus:border-[#a02f52] focus:ring-2 focus:ring-[#a02f52]/25";

export default function InquiryForm({ inquiry }: { inquiry: CmsInquiry }) {
  const { state, pending, onSubmit } = useCmsForm(updateInquiryAction, INITIAL_CMS_STATE);
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="id" value={inquiry.id} />
      {state.status !== "idle" && (
        <p role={state.status === "error" ? "alert" : "status"} className={`rounded-lg px-3.5 py-2.5 text-sm font-medium ${state.status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
          {state.message}
        </p>
      )}
      <div>
        <label htmlFor="status" className="text-sm font-bold text-zinc-800">Status</label>
        <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value as InquiryStatus)} className={field}>
          {(Object.keys(INQUIRY_STATUS_LABEL) as InquiryStatus[]).map((s) => <option key={s} value={s}>{INQUIRY_STATUS_LABEL[s]}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="staff_notes" className="text-sm font-bold text-zinc-800">Private notes</label>
        <textarea id="staff_notes" name="staff_notes" rows={5} defaultValue={inquiry.staff_notes} className={`${field} py-2.5`} placeholder="Only staff can see this." />
      </div>
      <div className="flex flex-wrap gap-2">
        <button disabled={pending} className="inline-flex min-h-11 items-center rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946] disabled:opacity-60">
          {pending ? "Saving…" : "Save"}
        </button>
        {status !== "replied" && (
          <button type="button" disabled={pending} onClick={(e) => { setStatus("replied"); const f = e.currentTarget.form!; setTimeout(() => f.requestSubmit(), 0); }}
            className="inline-flex min-h-11 items-center rounded-lg border border-zinc-300 bg-white px-4 font-display text-sm font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60">
            Mark as replied
          </button>
        )}
      </div>
    </form>
  );
}
