import ContactForm from "./ContactForm";

/* The two-column "Get in Touch" block from the mockup: plum panel with the
   contact details on the left, white form card on the right. Used as the body
   of both the modal and the standalone /contact page. */

/* This lucide-react version dropped all brand glyphs (see the note in
   SiteFooter.tsx), so WhatsApp/Gmail and the socials are inlined SVG.
   Each keeps its real brand colour, as in the design. */
type IconProps = { className?: string };

function WhatsappIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.78 9.78 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.81-9.8 2.62 0 5.08 1.02 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.4-4.4 9.81-9.8 9.81zM20.52 3.45A11.75 11.75 0 0 0 12.05 0C5.55 0 .26 5.29.26 11.79c0 2.08.54 4.11 1.58 5.9L.16 24l6.45-1.69a11.76 11.76 0 0 0 5.44 1.38h.01c6.5 0 11.79-5.29 11.79-11.79 0-3.15-1.23-6.11-3.45-8.34z" />
    </svg>
  );
}

/* Gmail's four-colour envelope. Split into paths so each keeps its own fill
   rather than inheriting currentColor. */
function GmailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 18" className={className} aria-hidden>
      <path
        fill="#4285f4"
        d="M1.64 18h3.27V9.95L0 6.14v10.23C0 17.27.73 18 1.64 18z"
      />
      <path
        fill="#34a853"
        d="M19.09 18h3.27c.9 0 1.64-.73 1.64-1.64V6.14l-4.91 3.81z"
      />
      <path
        fill="#fbbc04"
        d="M19.09 1.64v8.31L24 6.14V2.45c0-2.02-2.31-3.18-3.93-1.96z"
      />
      <path
        fill="#ea4335"
        d="M4.91 9.95V1.64L12 6.96l7.09-5.32v8.31L12 15.27z"
      />
      <path
        fill="#c5221f"
        d="M0 2.45v3.69l4.91 3.81V1.64L3.93.49C2.31-.73 0 .43 0 2.45z"
      />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function TwitterBird({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.23 13.23 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.65 4.65 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.7 4.7 0 0 1-2.104.08 4.66 4.66 0 0 0 4.352 3.234 9.35 9.35 0 0 1-5.786 1.995 9 9 0 0 1-1.112-.065 13.19 13.19 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.5 9.5 0 0 0 2.323-2.41z" />
    </svg>
  );
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285aeb" />
        </radialGradient>
      </defs>
      <path
        fill="url(#ig-grad)"
        d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.12 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.12.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.12-1.38 5.9 5.9 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.12A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"
      />
    </svg>
  );
}

const PHONES = ["+92 300 1231234", "+92 300 1231234"];
const EMAILS = ["info@techinsights.com", "tech@insights.com"];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: FacebookIcon,
    className: "text-[#1877f2]",
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: TwitterBird,
    className: "text-[#1da1f2]",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: LinkedinIcon,
    className: "text-[#0a66c2]",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: InstagramIcon,
    className: "",
  },
] as const;

export default function ContactPanel({
  defaultRole,
  onSuccess,
  headingId,
}: {
  defaultRole?: string;
  onSuccess?: () => void;
  /* Lets the modal point its aria-labelledby at the panel's own heading. */
  headingId?: string;
}) {
  return (
    /* Fluid padding/gaps throughout: this panel has to fit the viewport without
       scrolling in both the modal and the page, so every vertical measurement
       compresses on short screens rather than overflowing. */
    <div className="grid min-h-0 min-w-0 gap-[clamp(0.75rem,3vh,2.5rem)] bg-[#69205b] px-[clamp(1rem,3.5vh,2.5rem)] py-[clamp(0.75rem,3.5vh,2.5rem)] lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12 lg:px-16 lg:py-[clamp(2rem,6vh,5rem)]">
      {/* Below lg: the heading alone. Every row above the form costs a form row
          out of a short viewport, and the panel must fit without scrolling — so
          the phone/email/social details drop out entirely on mobile rather than
          being squeezed in. They live on in the full column at lg+, and in the
          site footer everywhere.

          This owns `headingId` at every width — the modal's aria-labelledby must
          never point at a display:none element, or the dialog loses its name. */}
      <h2
        id={headingId}
        className="min-w-0 text-[clamp(1.25rem,3vh,1.6rem)] font-bold uppercase leading-tight tracking-wide text-white lg:hidden [@media(max-height:560px)]:sr-only"
      >
        Get in Touch
      </h2>

      {/* ── left: get in touch ──
          Hidden below lg. Stacked on a phone this column plus the form is far
          more content than a viewport holds, and since the whole panel must fit
          without scrolling, something has to give — the form is the reason the
          panel exists, so the details step aside. They stay reachable: the
          heading is kept for context, and /contact's own footer carries the same
          phone/email/social links. */}
      <div className="pf-stagger hidden text-white lg:block">
        <h2 className="text-[clamp(1.5rem,4vh,2.15rem)] font-bold uppercase leading-tight tracking-wide">
          Get in Touch
        </h2>
        <p className="mt-2 max-w-sm text-[clamp(0.875rem,1.9vh,1.125rem)] leading-relaxed text-white/85">
          Share your thoughts we will help you make it real!
        </p>

        <div className="mt-[clamp(1.25rem,4vh,2.5rem)] space-y-[clamp(0.75rem,2.5vh,1.75rem)]">
          {/* phones — one icon, both numbers, as in the design */}
          <div className="group flex items-start gap-3.5">
            <WhatsappIcon className="mt-0.5 pf-pop h-6 w-6 text-[#25d366]" />
            <div className="flex flex-col">
              {PHONES.map((p, i) => (
                <a
                  key={`${p}-${i}`}
                  href={`tel:${p.replace(/\s/g, "")}`}
                  className="inline-flex min-h-8 items-center text-sm text-white/90 transition-colors hover:text-white sm:text-base"
                >
                  {p}
                </a>
              ))}
            </div>
          </div>

          <div className="group flex items-start gap-3.5">
            <GmailIcon className="mt-0.5 pf-pop h-6 w-6" />
            <div className="flex flex-col">
              {EMAILS.map((e) => (
                <a
                  key={e}
                  href={`mailto:${e}`}
                  className="inline-flex min-h-8 items-center text-sm text-white/90 transition-colors hover:text-white sm:text-base"
                >
                  {e}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-[clamp(1.25rem,4vh,2.5rem)] flex items-center gap-5">
          {SOCIALS.map(({ label, href, icon: Icon, className }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="pf-interactive flex h-11 w-11 items-center justify-center rounded-xl hover:-translate-y-1 hover:scale-110 hover:bg-white/10"
            >
              <Icon className={`h-7 w-7 ${className}`} />
            </a>
          ))}
        </div>
      </div>

      {/* ── right: form card ── */}
      <div className="animate-fade-in-up min-w-0 overflow-hidden rounded-[1.75rem] bg-[#eeeeef] shadow-2xl">
        <ContactForm defaultRole={defaultRole} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
