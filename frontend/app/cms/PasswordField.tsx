"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/* A password input with a show/hide toggle. Native `type` switching keeps
   password-manager and autofill behaviour; the button is a real, labelled,
   44px control that keeps the field focus order intact. */
export default function PasswordField({
  id,
  name,
  className,
  ...rest
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { id: string; name: string }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input id={id} name={name} type={shown ? "text" : "password"} className={`${className ?? ""} pr-12`} {...rest} />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        className="absolute inset-y-0 right-0 mt-1.5 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-[#a02f52]"
      >
        {shown ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
      </button>
    </div>
  );
}
