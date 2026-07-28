"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import ContactPanel from "./ContactPanel";

/* Site-wide contact modal.

   Mounted once in the root layout; any CTA opens it through `useContactModal()`
   (or the ready-made <ContactTrigger>). The mockup shows it floating over a
   dimmed version of whatever page you were on, which is exactly this — no
   navigation, the page behind stays put.

   /contact, /partner and /training still exist as real pages rendering the
   same <ContactPanel>, so direct links, sharing and no-JS all keep working. */

type ContactModalValue = {
  /* `role` preselects the "I am a" dropdown, e.g. from the Partner CTA. */
  open: (role?: string) => void;
  close: () => void;
  isOpen: boolean;
};

const Ctx = createContext<ContactModalValue | null>(null);

export function useContactModal() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useContactModal must be used inside <ContactModalProvider>",
    );
  return ctx;
}

export function ContactModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<{ open: boolean; role?: string }>({
    open: false,
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  // Element that had focus before opening, so we can hand it back on close.
  const restoreRef = useRef<HTMLElement | null>(null);

  const open = useCallback((role?: string) => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    setState({ open: true, role });
  }, []);

  const close = useCallback(() => setState({ open: false }), []);

  const isOpen = state.open;

  // Lock background scroll while open. Compensating for the scrollbar width
  // keeps the page behind from shifting sideways as it disappears.
  useEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [isOpen]);

  // Escape to close, and keep Tab inside the dialog while it's up.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      // Wrap around at both ends rather than escaping to the page behind.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Capture phase: the SideNav also listens for Escape on window and would
    // otherwise act on the same keypress.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [isOpen, close]);

  // Move focus into the dialog on open; hand it back to the trigger on close.
  useEffect(() => {
    if (isOpen) {
      // Focus the panel itself rather than the first input, so screen readers
      // announce the dialog before the user starts typing.
      dialogRef.current?.focus();
      return;
    }
    restoreRef.current?.focus?.();
    restoreRef.current = null;
  }, [isOpen]);

  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          {/* dimmed page behind */}
          <button
            type="button"
            aria-label="Close contact form"
            tabIndex={-1}
            onClick={close}
            className="animate-modal-backdrop absolute inset-0 cursor-default bg-black/45 backdrop-blur-[3px]"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            tabIndex={-1}
            className="animate-modal-panel relative max-h-[92dvh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] outline-none"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="pf-interactive absolute right-3 top-3 z-10 rounded-full bg-white/15 p-2 text-white/90 hover:bg-white/25 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <ContactPanel
              headingId="contact-modal-title"
              defaultRole={state.role}
              onSuccess={close}
            />
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
