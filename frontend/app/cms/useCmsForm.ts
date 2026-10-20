"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import type { CmsFormState } from "@/app/cms/types";

/* Wraps a Server Action for a CMS form WITHOUT using <form action={…}>.

   React 19 resets a form's uncontrolled fields after every `action` — including
   a failed validation, which would throw away what the editor just typed. Here
   the form is submitted by hand, so the fields keep their values and only the
   state (messages, field errors) changes. The submitter is passed to FormData so
   a clicked button's name/value (e.g. intent=publish) is still sent. */
export function useCmsForm(
  action: (prev: CmsFormState, formData: FormData) => Promise<CmsFormState>,
  initial: CmsFormState,
) {
  const [state, formAction, pending] = useActionState(action, initial);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const formData = new FormData(event.currentTarget, submitter);
    startTransition(() => formAction(formData));
  };

  return { state, pending, onSubmit };
}
