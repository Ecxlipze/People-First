/* Shared types/constants for the contact form.

   These live here rather than in actions.ts because a "use server" module may
   only export async functions — exporting the type and the initial-state object
   from there makes Next throw "A 'use server' file can only export async
   functions, found object." */

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  /* field name -> error, so the form can highlight the offending input */
  errors?: Partial<
    Record<
      "fullName" | "email" | "phone" | "gender" | "role" | "message",
      string
    >
  >;
  /* echoed back so a failed submit doesn't wipe what the user typed */
  values?: Record<string, string>;
};

export const initialContactState: ContactState = { status: "idle" };
