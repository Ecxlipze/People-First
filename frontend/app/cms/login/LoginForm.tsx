"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/cms/actions";
import PasswordField from "@/app/cms/PasswordField";
import { INITIAL_CMS_STATE } from "@/app/cms/types";

const input =
  "mt-1.5 block min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-base text-zinc-900 outline-none focus:border-[#a02f52] focus:ring-2 focus:ring-[#a02f52]/25";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL_CMS_STATE);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="username" className="text-sm font-bold text-zinc-800">Username</label>
        <input id="username" name="username" autoComplete="username" required className={input} />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-bold text-zinc-800">Password</label>
        <PasswordField id="password" name="password" autoComplete="current-password" required className={input} />
      </div>
      {state.status === "error" && (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#a02f52] px-5 font-display text-sm font-bold text-white transition-colors hover:bg-[#8c2946] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
