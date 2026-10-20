"use client";

import { Trash2 } from "lucide-react";

/* A delete can't be undone, so the form submits only after the editor confirms. */
export default function ConfirmDelete({
  action,
  slug,
  title,
  fieldName = "slug",
}: {
  action: (formData: FormData) => void | Promise<void>;
  slug: string;
  title: string;
  /* name of the hidden field carrying the identifier */
  fieldName?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name={fieldName} value={slug} />
      <button
        type="submit"
        className="pf-interactive inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 text-sm font-bold text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" aria-hidden /> Delete
      </button>
    </form>
  );
}
