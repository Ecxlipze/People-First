"use server";

/* Server Action backing the contact form (both the modal and the /contact
   page render the same <ContactForm>, so both post here).

   NOTE: this currently validates and logs. Swap the marked block for your
   email/CRM provider — everything above it is the validated payload. */

/* A "use server" module may only export async functions, so the ContactState
   type and its initial value live in ./state. */
import type { ContactState } from "./state";

/* Deliberately permissive — this only rejects input that clearly isn't an
   address. Real deliverability is confirmed by actually sending. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* Digits, spaces and + ( ) - are all fine; Pakistani numbers here are
   typically "+92 300 1231234". */
const PHONE_RE = /^[+()\d][\s()+\d-]{6,24}$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const get = (k: string) => (formData.get(k) ?? "").toString().trim();

  const values = {
    fullName: get("fullName"),
    email: get("email"),
    phone: get("phone"),
    gender: get("gender"),
    role: get("role"),
    message: get("message"),
  };

  // Honeypot: a hidden field real users never see, let alone fill in. If it
  // has content it's a bot — return the success shape so the bot can't tell.
  if (get("company"))
    return { status: "success", message: "Thanks! We'll be in touch shortly." };

  const errors: NonNullable<ContactState["errors"]> = {};
  if (!values.fullName) errors.fullName = "Please tell us your name.";
  else if (values.fullName.length > 120)
    errors.fullName = "That name is too long.";

  if (!values.email) errors.email = "We need an email to reply to.";
  else if (!EMAIL_RE.test(values.email))
    errors.email = "That doesn't look like a valid email.";

  // Phone is optional, but validate it when supplied.
  if (values.phone && !PHONE_RE.test(values.phone))
    errors.phone = "That doesn't look like a valid phone number.";

  if (!values.message) errors.message = "Let us know how we can help.";
  else if (values.message.length > 4000)
    errors.message = "Please keep it under 4000 characters.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
      values,
    };
  }

  // ── TODO: replace with a real delivery mechanism ──────────────────────
  // e.g. await resend.emails.send({ to: "info@techinsights.com", ... })
  // Keep the shape below — it's the fully validated payload.
  console.log("[contact] submission", {
    ...values,
    receivedAt: new Date().toISOString(),
  });
  // ──────────────────────────────────────────────────────────────────────

  return {
    status: "success",
    message:
      "Thanks! Your message is on its way — we'll get back to you shortly.",
  };
}
