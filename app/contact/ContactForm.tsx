"use client";

import { useActionState, useId } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";
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

/* Shared input chrome — flat light-grey fields with a magenta focus ring,
   matching the mockup's form card. */
/* The focus treatment does more than change a border colour: the field lifts
   off its grey fill to white and the magenta ring grows, so the active field is
   unmistakable at a glance. `transition-[…]` (not transition-colors) is what
   lets the ring width animate rather than snap. */
const FIELD =
  "min-h-11 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-zinc-800 outline-none transition-[background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-zinc-400 hover:bg-[#fafafa] focus:bg-white focus:border-pf-magenta focus:ring-4 focus:ring-pf-magenta/20";

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
        <p
          role="alert"
          className="animate-feedback-in mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 flex-none" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

/* Native <select> plus our own chevron — `appearance-none` kills the OS arrow so
   the control matches the flat fields around it.

   Extracted because both dropdowns need identical chrome; previously the markup
   (and now the chevron's focus animation) was duplicated. The chevron flips and
   turns magenta while the control has focus, giving the dropdown the same "this
   one is active" signal the text inputs get. `peer`/`peer-focus` does it in CSS
   with no state. */
function Select({
  id,
  name,
  defaultValue,
  placeholder,
  options,
}: {
  id: string;
  name: string;
  defaultValue: string;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className={`${FIELD} peer appearance-none border-transparent pr-9`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-[rotate,color] duration-200 peer-focus:rotate-180 peer-focus:text-pf-magenta"
      />
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
      /* role=status + aria-live so a screen reader announces the outcome; the
         visual celebration is decorative on top of that. pf-stagger cascades
         tick → heading → message → button. */
      <div
        role="status"
        aria-live="polite"
        className="pf-stagger flex min-h-[22rem] flex-col items-center justify-center px-6 py-12 text-center"
      >
        <span className="relative inline-flex">
          {/* a single soft pulse ringing out from behind the tick */}
          <span
            aria-hidden
            className="animate-glow-pulse absolute inset-0 rounded-full bg-pf-teal/25"
          />
          <CheckCircle2
            className="animate-success-in relative h-14 w-14 text-pf-teal"
            aria-hidden
          />
        </span>
        <h3 className="mt-5 text-xl font-bold text-zinc-900">Message sent</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-600">
          {state.message}
        </p>
        {onSuccess && (
          <button
            type="button"
            onClick={onSuccess}
            className="pf-interactive mt-7 min-h-11 rounded-md bg-[#8f1d3f] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#7a1836]"
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
      className="flex flex-col gap-4 p-5 sm:p-10"
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

      <Field label="Gender" htmlFor={id("role")} error={err.role}>
        <Select
          id={id("role")}
          name="role"
          defaultValue={v.role ?? defaultRole ?? ""}
          placeholder="I am a"
          options={ROLES}
        />
      </Field>

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
          className="animate-feedback-in flex items-start gap-2 rounded-md bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 ring-1 ring-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden />
          {state.message}
        </p>
      )}

      {/* aria-busy tells assistive tech the control is working; the spinner is
          the visual half of the same message. The button keeps its full size in
          both states so the form never reflows on submit. */}
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="pf-interactive mt-1 min-h-11 w-full rounded-md bg-[#8f1d3f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7a1836] hover:shadow-lg hover:shadow-[#8f1d3f]/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
      >
        {pending ? (
          <span className="inline-flex items-center justify-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            Sending…
          </span>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
