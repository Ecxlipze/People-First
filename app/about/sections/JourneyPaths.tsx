import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import ContactTrigger from "@/app/contact/ContactTrigger";

/* About → "Where Are You In Your Journey". Three path cards (Learn / Grow /
   Lead), each with a coloured top-left accent, a lead line, a checked list of
   audiences, and a coloured "Explore Path" button. Data-driven so the accent
   colour threads through the label, bullets, border, and button. */
type Path = {
  title: string;
  lead: string;
  audiences: string[];
  href: string;
  /* Set on the cards whose href is a contact CTA (/training, /partner) — those
     open the contact modal instead of navigating, preselecting this "I am a"
     value. GROW points at a real content page, so it has none. */
  contactRole?: string;
  /* Tailwind classes carrying this card's accent colour. */
  labelText: string;
  border: string;
  check: string;
  button: string;
};

const PATHS: Path[] = [
  {
    title: "LEARN",
    lead: "I want to build skills and opportunities",
    audiences: ["Students", "Young Professionals", "Beginners"],
    href: "/training",
    contactRole: "Student",
    labelText: "text-pf-teal",
    border: "border-t-pf-teal",
    check: "text-pf-teal",
    button: "bg-pf-teal hover:brightness-95",
  },
  {
    title: "GROW",
    lead: "I want to scale my business/career",
    audiences: ["Professionals", "Entrepreneurs", "Businesses"],
    href: "/grow-with-us",
    labelText: "text-pf-orange",
    border: "border-t-pf-orange",
    check: "text-pf-orange",
    button: "bg-pf-orange hover:brightness-95",
  },
  {
    title: "LEAD",
    lead: "I want to build skills and opportunities",
    audiences: ["Founders", "Investors", "Institutions"],
    href: "/partner",
    contactRole: "Training Partner",
    labelText: "text-pf-lead",
    border: "border-t-pf-lead",
    check: "text-pf-lead",
    button: "bg-pf-lead hover:brightness-95",
  },
];

export default function JourneyPaths() {
  return (
    /* Shares the hero's #491557 background — the mockup reads this as a
       continuation of the hero, with white copy and the cards floating on it. */
    <section className="bg-pf-purple px-6 pb-20 pt-4 sm:px-10 sm:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            WHERE ARE YOU IN YOUR JOURNEY
          </h2>
          <p className="mt-3 text-base text-white/60 sm:text-lg">
            Choose your path and let us help you grow.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PATHS.map((p, i) => (
            <div
              key={p.title}
              className={`flex flex-col rounded-2xl border border-black/[0.06] border-t-4 ${p.border} bg-white p-7 shadow-[0_14px_40px_-18px_rgba(80,80,120,0.3)] transition-transform duration-300 hover:-translate-y-1 ${
                // the middle card sits slightly proud, matching the mockup
                i === 1 ? "md:-translate-y-3" : ""
              }`}
            >
              <h3
                className={`text-xl font-extrabold tracking-[0.15em] ${p.labelText}`}
              >
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-500">{p.lead}</p>

              <ul className="mt-6 flex flex-1 flex-col gap-3.5">
                {p.audiences.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-3 text-[0.95rem] font-medium text-zinc-700"
                  >
                    <Check
                      className={`h-5 w-5 shrink-0 ${p.check}`}
                      strokeWidth={2.5}
                    />
                    {a}
                  </li>
                ))}
              </ul>

              {/* Contact-CTA cards open the modal in place; GROW is a real
                  page, so it stays an ordinary link. */}
              {(() => {
                const cls = `group mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all ${p.button}`;
                const inner = (
                  <>
                    Explore Path
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                );
                return p.contactRole ? (
                  <ContactTrigger
                    href={p.href}
                    role={p.contactRole}
                    className={cls}
                  >
                    {inner}
                  </ContactTrigger>
                ) : (
                  <Link href={p.href} className={cls}>
                    {inner}
                  </Link>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
