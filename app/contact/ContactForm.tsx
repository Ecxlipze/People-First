"use client";

import { useActionState, useId, useState } from "react";
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

/* Shared input chrome — white pill fields sitting on the card's grey fill,
   matching the mockup's form card.

   The focus treatment is a magenta border plus a soft ring, so the active field
   is unmistakable at a glance. `transition-[…]` (not transition-colors) is what
   lets the ring width animate rather than snap.

   Heights are fluid (`clamp`) rather than fixed: the whole panel has to fit the
   viewport without scrolling, so on short screens the fields give up a few
   pixels each instead of pushing the Submit button out of view. The floor still
   clears the 40px comfortable-tap minimum. */
const FIELD =
  "block h-[clamp(2.125rem,4.6vh,3rem)] w-full rounded-lg border border-transparent bg-white px-3.5 text-sm text-zinc-800 shadow-[0_1px_2px_rgba(16,16,20,0.05)] outline-none transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-zinc-400 focus:border-pf-magenta focus:ring-4 focus:ring-pf-magenta/20 [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:text-zinc-800";

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
    <div className="min-w-0">
      {/* On very short viewports (landscape phones) the visible label is dropped
          — each placeholder already repeats it — buying back the ~20px per field
          that otherwise pushes Submit out of a panel that must not scroll. The
          label stays in the DOM for screen readers, just visually hidden. */}
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-[0.8rem] font-semibold text-zinc-800 [@media(max-height:560px)]:sr-only"
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="animate-feedback-in mt-1 flex items-start gap-1.5 text-xs font-medium text-red-600"
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
  /* A <select> has no ::placeholder, so the "nothing chosen yet" grey has to be
     driven off the value — hence the tiny bit of state. The options themselves
     stay dark, or they'd be grey inside the open dropdown too. */
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby={id ? `${id}-error` : undefined}
        className={`${FIELD} peer cursor-pointer appearance-none pr-9 ${
          value === "" ? "text-zinc-400" : ""
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-zinc-800">
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
        className="pf-stagger flex h-full flex-col items-center justify-center px-6 py-10 text-center"
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
    /* Fluid gap + padding for the same reason the fields are fluid: the card has
       to fit the viewport without scrolling, so it tightens on short screens. */
    <form
      action={formAction}
      className="flex flex-col gap-[clamp(0.5rem,1.4vh,1rem)] p-[clamp(1rem,3vh,2.5rem)]"
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
          maxLength={120}
          autoComplete="name"
          placeholder="Full Name"
          defaultValue={v.fullName}
          aria-invalid={!!err.fullName}
          aria-describedby={err.fullName ? `${id("fullName")}-error` : undefined}
          className={`${FIELD} ${err.fullName ? "border-red-400" : ""}`}
        />
      </Field>

      <Field label="Email Address" htmlFor={id("email")} error={err.email}>
        <input
          id={id("email")}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="Email Address"
          defaultValue={v.email}
          aria-invalid={!!err.email}
          aria-describedby={err.email ? `${id("email")}-error` : undefined}
          className={`${FIELD} ${err.email ? "border-red-400" : ""}`}
        />
      </Field>

      <Field label="Phone" htmlFor={id("phone")} error={err.phone}>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          pattern="^[+()\d][\s()+\d-]{6,24}$"
          title="Please enter a valid phone number (e.g., +92 300 1231234)"
          maxLength={25}
          autoComplete="tel"
          placeholder="Phone Number"
          defaultValue={v.phone}
          aria-invalid={!!err.phone}
          aria-describedby={err.phone ? `${id("phone")}-error` : undefined}
          className={`${FIELD} ${err.phone ? "border-red-400" : ""}`}
        />
      </Field>

      {/* Label reads "I am a", not "Gender" — the options are roles, and the
          field submits as `role`. The mockup's "Gender" label was a stray. */}
      <Field label="I am a" htmlFor={id("role")} error={err.role}>
        <Select
          id={id("role")}
          name="role"
          defaultValue={v.role ?? defaultRole ?? ""}
          placeholder="Select an option"
          options={ROLES}
        />
      </Field>

      <Field
        label="How can we help you?"
        htmlFor={id("message")}
        error={err.message}
      >
        {/* The one field that isn't a single-line pill: it overrides FIELD's
            fixed height with its own (taller, still fluid) box and re-adds the
            vertical padding the pills get from centring their text.
            `resize-none` because a user-dragged textarea would grow the panel
            past the viewport — the very scrolling this layout avoids. */}
        <textarea
          id={id("message")}
          name="message"
          required
          maxLength={4000}
          placeholder="Your Message"
          defaultValue={v.message}
          aria-invalid={!!err.message}
          aria-describedby={err.message ? `${id("message")}-error` : undefined}
          className={`${FIELD} h-[clamp(3.25rem,11vh,7rem)] resize-none py-2 ${err.message ? "border-red-400" : ""}`}
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
        className="pf-interactive mt-1 h-[clamp(2.5rem,4.4vh,3rem)] w-full shrink-0 rounded-lg bg-[#8f1d3f] px-5 text-sm font-semibold text-white hover:bg-[#7a1836] hover:shadow-lg hover:shadow-[#8f1d3f]/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
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
