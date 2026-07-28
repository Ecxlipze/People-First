"use client";

import { useActionState, useId } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { submitContact } from "./actions";
import { initialContactState } from "./state";

/* The white form card from the "Get in Touch" mockup. Shared by the modal
   overlay and the standalone /contact page, so it owns no layout of its own
   beyond filling its parent. */

/* "I am a" — drives routing/segmentation on the receiving end. The modal
   preselects one of these when opened from a specific CTA. */
export const ROLES = [
  "Entrepreneur / Business Owner",
  "Student",
  "Job Seeker",
  "Training Partner",
  "Investor",
  "Media / Podcast Guest",
  "Other",
] as const;

const GENDERS = ["Female", "Male", "Prefer not to say"] as const;

/* Shared input chrome — flat light-grey fields with a magenta focus ring,
   matching the mockup's form card. */
const FIELD =
  "w-full rounded-md border bg-[#f2f2f4] px-3.5 py-2.5 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-pf-magenta focus:ring-2 focus:ring-pf-magenta/25";

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[0.8rem] font-semibold text-zinc-800"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({
  defaultRole,
  onSuccess,
}: {
  /* Preselects "I am a" — e.g. the /partner CTA opens the modal on
     "Training Partner". */
  defaultRole?: string;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialContactState,
  );
  // useId keeps label/input pairs unique even if the modal and the page form
  // are ever mounted at once.
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;

  const v = state.values ?? {};
  const err = state.errors ?? {};

  if (state.status === "success") {
    return (
      <div className="flex min-h-[22rem] flex-col items-center justify-center px-6 py-12 text-center">
        <CheckCircle2 className="h-14 w-14 text-pf-teal" aria-hidden />
        <h3 className="mt-5 text-xl font-bold text-zinc-900">Message sent</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-600">
          {state.message}
        </p>
        {onSuccess && (
          <button
            type="button"
            onClick={onSuccess}
            className="mt-7 rounded-md bg-[#8f1d3f] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7a1836]"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 p-6 sm:p-8"
      noValidate
    >
      {/* honeypot — hidden from users and assistive tech, catnip for bots */}
      <div aria-hidden className="hidden">
        <label htmlFor={id("company")}>Company</label>
        <input
          id={id("company")}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field label="Full Name" htmlFor={id("fullName")} error={err.fullName}>
        <input
          id={id("fullName")}
          name="fullName"
          type="text"
          required
          autoComplete="name"
          placeholder="Full Name"
          defaultValue={v.fullName}
          aria-invalid={!!err.fullName}
          className={`${FIELD} ${err.fullName ? "border-red-400" : "border-transparent"}`}
        />
      </Field>

      <Field label="Email Address" htmlFor={id("email")} error={err.email}>
        <input
          id={id("email")}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email Address"
          defaultValue={v.email}
          aria-invalid={!!err.email}
          className={`${FIELD} ${err.email ? "border-red-400" : "border-transparent"}`}
        />
      </Field>

      <Field label="Phone" htmlFor={id("phone")} error={err.phone}>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Phone Number"
          defaultValue={v.phone}
          aria-invalid={!!err.phone}
          className={`${FIELD} ${err.phone ? "border-red-400" : "border-transparent"}`}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Gender" htmlFor={id("gender")} error={err.gender}>
          {/* Native select + our own chevron; appearance-none kills the OS arrow
              so the control matches the flat fields around it. */}
          <div className="relative">
            <select
              id={id("gender")}
              name="gender"
              defaultValue={v.gender ?? ""}
              className={`${FIELD} appearance-none border-transparent pr-9`}
            >
              <option value="">Select</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            />
          </div>
        </Field>

        <Field label="I am a" htmlFor={id("role")} error={err.role}>
          <div className="relative">
            <select
              id={id("role")}
              name="role"
              defaultValue={v.role ?? defaultRole ?? ""}
              className={`${FIELD} appearance-none border-transparent pr-9`}
            >
              <option value="">I am a</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            />
          </div>
        </Field>
      </div>

      <Field
        label="How can we help you?"
        htmlFor={id("message")}
        error={err.message}
      >
        <textarea
          id={id("message")}
          name="message"
          required
          rows={4}
          placeholder="Your Message"
          defaultValue={v.message}
          aria-invalid={!!err.message}
          className={`${FIELD} resize-y ${err.message ? "border-red-400" : "border-transparent"}`}
        />
      </Field>

      {/* Form-level error. aria-live so screen readers hear it without the
          focus having to move. */}
      {state.status === "error" && state.message && (
        <p
          role="alert"
          aria-live="polite"
          className="text-sm font-medium text-red-600"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-full rounded-md bg-[#8f1d3f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7a1836] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
