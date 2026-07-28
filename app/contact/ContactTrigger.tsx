"use client";

import Link from "next/link";
import { useContactModal } from "./ContactModal";

/* Drop-in replacement for the CTA <Link>s that used to navigate to
   /contact, /partner or /training.

   It stays a real anchor, so middle-click, cmd-click, "copy link address",
   crawlers and no-JS all behave exactly as before — but a plain left-click is
   intercepted and opens the modal over the current page instead. */
export default function ContactTrigger({
  href = "/contact",
  role,
  className,
  children,
  ...rest
}: {
  /* Where a real navigation would go — also the no-JS fallback. */
  href?: string;
  /* Preselects the "I am a" dropdown. */
  role?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<
  React.ComponentProps<typeof Link>,
  "href" | "onClick" | "className" | "children"
>) {
  const { open } = useContactModal();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        // Let the browser handle any click that means "open somewhere else".
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        e.preventDefault();
        open(role);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
