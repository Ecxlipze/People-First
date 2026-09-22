"use server";

/* Server Action backing the contact form (both the modal and the /contact,
   /partner and /training pages render the same <ContactForm>, so all of them
   post here).

   The validated submission is POSTed to the Django API's public inquiry
   endpoint, POST /api/inquiries/ (backend/inquiry/). That endpoint also emails
   a confirmation to the submitter. */

/* A "use server" module may only export async functions, so the ContactState
   type and its initial value live in ./state, and the API enum mapping lives in
   ./inquiry. */
import type { ContactState } from "./state";
import { ApiError, ApiNotConfiguredError, apiFetch } from "@/app/lib/api";
import {
  DEFAULT_INQUIRY_TYPE,
  isInquiryType,
  personTypeForRole,
  type InquiryPayload,
} from "./inquiry";

/* Deliberately permissive — this only rejects input that clearly isn't an
   address. Real deliverability is confirmed by actually sending. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* Digits, spaces and + ( ) - are all fine; Pakistani numbers here are
   typically "+92 300 1231234". */
const PHONE_RE = /^[+()\d][\s()+\d-]{6,24}$/;

/* Shown when the API is unreachable or errors. Deliberately vague about the
   cause — the visitor can't act on a 502, but they can use the fallback. */
const DELIVERY_FAILED =
  "Sorry, we couldn't send that just now. Please try again, or email us directly.";

/* DRF returns { field: ["message", …] }. Map the few fields the form actually
   renders back onto their inputs so a server-side rejection highlights the
   offending control instead of only showing a banner. */
const FIELD_BY_API_KEY: Record<string, keyof NonNullable<ContactState["errors"]>> = {
  name: "fullName",
  email: "email",
  phone: "phone",
  person_type: "role",
  message: "message",
};

function apiFieldErrors(payload: unknown): NonNullable<ContactState["errors"]> | undefined {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return undefined;

  const errors: NonNullable<ContactState["errors"]> = {};
  for (const [key, field] of Object.entries(FIELD_BY_API_KEY)) {
    const raw = (payload as Record<string, unknown>)[key];
    const message = Array.isArray(raw) ? raw[0] : raw;
    if (typeof message === "string" && message) errors[field] = message;
  }
  return Object.keys(errors).length > 0 ? errors : undefined;
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const get = (k: string) => (formData.get(k) ?? "").toString().trim();

  const values = {
    fullName: get("fullName"),
    email: get("email"),
    phone: get("phone"),
    role: get("role"),
    message: get("message"),
  };

  // Honeypot: a hidden field real users never see, let alone fill in. If it
  // has content it's a bot — return the success shape so the bot can't tell,
  // and never touch the API.
  if (get("company"))
    return { status: "success", message: "Thanks! We'll be in touch shortly." };

  const errors: NonNullable<ContactState["errors"]> = {};
  if (!values.fullName) errors.fullName = "Please tell us your name.";
  else if (values.fullName.length > 120)
    errors.fullName = "That name is too long.";

  if (!values.email) errors.email = "We need an email to reply to.";
  else if (values.email.length > 254)
    errors.email = "That email address is too long.";
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

  // inquiry_type is a hidden field, so it is client-supplied: anything we don't
  // recognise is filed as a plain contact rather than trusted through.
  const submitted = get("inquiryType");
  const inquiryType = isInquiryType(submitted) ? submitted : DEFAULT_INQUIRY_TYPE;

  const payload: InquiryPayload = {
    name: values.fullName,
    email: values.email,
    phone: values.phone,
    message: values.message,
    person_type: personTypeForRole(values.role),
    inquiry_type: inquiryType,
  };

  try {
    await apiFetch<unknown>("/api/inquiries/", {
      method: "POST",
      json: payload,
      // A submission must never be cached or replayed from the data cache.
      revalidate: false,
    });
  } catch (error) {
    if (error instanceof ApiNotConfiguredError) {
      console.error("[contact] API_BASE_URL is not set — submission dropped");
      return { status: "error", message: DELIVERY_FAILED, values };
    }

    if (error instanceof ApiError) {
      // 400 is the API rejecting the content; surface it on the fields when we
      // can, since the visitor can actually fix that.
      if (error.status === 400) {
        const fieldErrors = apiFieldErrors(error.payload);
        if (fieldErrors) {
          return {
            status: "error",
            message: "Please fix the highlighted fields.",
            errors: fieldErrors,
            values,
          };
        }
      }
      console.error("[contact] inquiry POST failed", error.status, error.payload);
    } else {
      console.error("[contact] inquiry POST failed", error);
    }

    return { status: "error", message: DELIVERY_FAILED, values };
  }

  return {
    status: "success",
    message: "Thanks! Your message has been received.",
  };
}
