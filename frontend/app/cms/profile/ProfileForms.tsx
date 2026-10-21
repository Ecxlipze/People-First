"use client";

import { changePasswordAction, saveProfileAction } from "@/app/cms/actions";
import PasswordField from "@/app/cms/PasswordField";
import { useCmsForm } from "@/app/cms/useCmsForm";
import { INITIAL_CMS_STATE, type CmsProfile } from "@/app/cms/types";

const field =
  "mt-1.5 block min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-zinc-900 outline-none focus:border-[#a02f52] focus:ring-2 focus:ring-[#a02f52]/25 aria-[invalid=true]:border-red-500";
const label = "text-sm font-bold text-zinc-800";
const card = "rounded-2xl bg-white p-5 shadow-sm sm:p-6";
const button =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white hover:bg-[#8c2946] disabled:opacity-60";

function Err({ msg }: { msg?: string }) {
  return msg ? <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{msg}</p> : null;
}

function Banner({ status, message }: { status: string; message?: string }) {
  if (status === "idle" || !message) return null;
  return (
    <p
      role={status === "error" ? "alert" : "status"}
      className={`rounded-lg px-3.5 py-2.5 text-sm font-medium ${status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}
    >
      {message}
    </p>
  );
}

export default function ProfileForms({ profile }: { profile: CmsProfile }) {
  const details = useCmsForm(saveProfileAction, INITIAL_CMS_STATE);
  const password = useCmsForm(changePasswordAction, INITIAL_CMS_STATE);
  const de = details.state.errors ?? {};
  const pe = password.state.errors ?? {};

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className={`${card} flex flex-col items-center text-center lg:sticky lg:top-24`}>
        <span
          aria-hidden
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#a02f52]/10 font-display text-2xl font-extrabold uppercase text-[#a02f52]"
        >
          {(profile.display_name || profile.username).slice(0, 2)}
        </span>
        <p className="mt-4 max-w-full break-words font-display text-lg font-extrabold text-[#171922]">{profile.display_name}</p>
        <p className="mt-1 max-w-full break-all text-sm text-zinc-500">@{profile.username}</p>
        <span className="mt-3 rounded-full bg-zinc-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-zinc-600">
          {profile.role === "staff" ? "Editor" : "Blog author"}
        </span>
        {profile.email && <p className="mt-3 max-w-full break-all text-sm text-zinc-600">{profile.email}</p>}
      </aside>

      <div className="grid min-w-0 gap-6">
      <form onSubmit={details.onSubmit} className={`${card} space-y-4`}>
        <h2 className="font-display text-lg font-extrabold text-[#171922]">Your details</h2>
        <Banner {...details.state} />
        <div>
          <label htmlFor="username" className={label}>Username</label>
          <input id="username" value={profile.username} readOnly className={`${field} bg-zinc-100 text-zinc-600`} />
          <p className="mt-1.5 text-xs text-zinc-500">Only an administrator can change this.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className={label}>First name</label>
            <input id="first_name" name="first_name" defaultValue={profile.first_name} autoComplete="given-name" aria-invalid={!!de.first_name} className={field} />
            <Err msg={de.first_name} />
          </div>
          <div>
            <label htmlFor="last_name" className={label}>Last name</label>
            <input id="last_name" name="last_name" defaultValue={profile.last_name} autoComplete="family-name" aria-invalid={!!de.last_name} className={field} />
            <Err msg={de.last_name} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" defaultValue={profile.email} autoComplete="email" aria-invalid={!!de.email} className={field} />
          <Err msg={de.email} />
        </div>
        {profile.role === "author" && (
          <p className="text-xs text-zinc-500">
            New posts and edited drafts use your name above as the author line. Already published posts keep the name they were published with.
          </p>
        )}
        <button disabled={details.pending} className={button}>{details.pending ? "Saving…" : "Save profile"}</button>
      </form>

      <form onSubmit={password.onSubmit} className={`${card} space-y-4`}>
        <h2 className="font-display text-lg font-extrabold text-[#171922]">Change password</h2>
        <Banner {...password.state} />
        <div>
          <label htmlFor="current_password" className={label}>Current password</label>
          <PasswordField id="current_password" name="current_password" required autoComplete="current-password" aria-invalid={!!pe.current_password} className={field} />
          <Err msg={pe.current_password} />
        </div>
        <div>
          <label htmlFor="new_password" className={label}>New password</label>
          <PasswordField id="new_password" name="new_password" required autoComplete="new-password" aria-invalid={!!pe.new_password} className={field} />
          <Err msg={pe.new_password} />
        </div>
        <div>
          <label htmlFor="confirm_password" className={label}>Confirm new password</label>
          <PasswordField id="confirm_password" name="confirm_password" required autoComplete="new-password" aria-invalid={!!pe.confirm_password} className={field} />
          <Err msg={pe.confirm_password} />
        </div>
        <button disabled={password.pending} className={button}>{password.pending ? "Saving…" : "Change password"}</button>
      </form>
      </div>
    </div>
  );
}
