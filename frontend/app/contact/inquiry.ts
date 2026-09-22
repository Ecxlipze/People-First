/* The contact form's choices and their Django inquiry API equivalents
   (backend/inquiry/models.py).

   A plain module, imported by both the Client Component form and the Server
   Action: actions.ts is "use server" so it may only export async functions, and
   ContactForm.tsx is "use client" so a Server Action cannot read plain values
   out of it. This file belongs to neither boundary, so both can use it. */

/* "I am a" — drives routing/segmentation on the receiving end. The modal
   preselects one of these when opened from a specific CTA.

   Declared as the keys of the person_type map so the two can never drift: a
   renamed option is a type error, not a silent post of "other". */
export const PERSON_TYPE_BY_ROLE = {
  "Entrepreneur / Business Owner": "entrepreneur",
  Student: "student",
  "Job Seeker": "job_seeker",
  "Training Partner": "training_partner",
  Investor: "investor",
  "Media / Podcast Guest": "media_guest",
  Other: "other",
} as const satisfies Record<string, string>;

export type Role = keyof typeof PERSON_TYPE_BY_ROLE;

/* Order here is the order rendered in the <select>. */
export const ROLES = Object.keys(PERSON_TYPE_BY_ROLE) as readonly Role[];

/* Inquiry.INQUIRY_TYPES. Which one is sent depends on the route the form was
   rendered from — /partner posts partner_with_us, /training posts
   join_training, everything else posts contact_us. */
export const INQUIRY_TYPES = [
  "contact_us",
  "partner_with_us",
  "book_consultation",
  "join_training",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const DEFAULT_INQUIRY_TYPE: InquiryType = "contact_us";

/* inquiry_type reaches the action as a hidden form field, so it is
   client-supplied and has to be re-checked before it reaches the API. */
export function isInquiryType(value: string): value is InquiryType {
  return (INQUIRY_TYPES as readonly string[]).includes(value);
}

/* An unrecognised role falls back to "other" rather than failing the submit —
   the person's message matters more than the segmentation. */
export function personTypeForRole(role: string): string {
  return PERSON_TYPE_BY_ROLE[role as Role] ?? "other";
}

/* The POST body for /api/inquiries/. */
export type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  person_type: string;
  inquiry_type: InquiryType;
};
