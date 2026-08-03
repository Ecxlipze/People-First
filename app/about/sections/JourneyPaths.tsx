import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import ContactTrigger from "@/app/contact/ContactTrigger";
import { Reveal, Stagger } from "@/app/components/ScrollFx";

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
    border: "border-pf-teal",
    button: "bg-pf-teal text-[#40205a] hover:brightness-105",
  },
  {
    title: "GROW",
    lead: "I want to scale my business/career",
    audiences: ["Professionals", "Entrepreneurs", "Businesses"],
    href: "/grow-with-us",
    labelText: "text-pf-orange",
    border: "border-pf-orange",
    button: "bg-pf-orange text-white hover:brightness-105",
  },
  {
    title: "LEAD",
    lead: "I want to build skills and opportunities",
    audiences: ["Founders", "Investors", "Institutions"],
    href: "/partner",
    contactRole: "Training Partner",
    labelText: "text-pf-lead",
    border: "border-pf-lead",
    button: "bg-pf-lead text-white hover:brightness-105",
  },
];

export default function JourneyPaths() {
  return (
    /* Shares the hero's #491557 background — the mockup reads this as a
       continuation of the hero, with white copy and the cards floating on it. */
    <section className="bg-pf-purple px-6 pb-24 pt-10 sm:px-10 sm:pb-32 sm:pt-14 lg:px-24 xl:px-28">
      <div className="mx-auto max-w-[1280px]">
        <Reveal className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#f6d9ff] sm:text-[2.65rem]">
            WHERE ARE YOU IN YOUR JOURNEY
          </h2>
          <p className="mt-5 text-base text-white/90 sm:text-xl">
            Choose your path and let us help you grow.
          </p>
        </Reveal>

        <Stagger
          className="mt-16 grid items-stretch gap-8 md:grid-cols-3"
          step={75}
        >
          {PATHS.map((p) => (
            <div key={p.title} className="h-full">
              <div
                className={`pf-card pf-sheen group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border ${p.border} bg-[#4b1858] px-10 py-9 shadow-[0_18px_45px_-24px_rgba(0,0,0,0.55)]`}
              >
                <h3
                  className={`text-center text-2xl font-extrabold tracking-[0.08em] ${p.labelText}`}
                >
                  {p.title}
                </h3>
                <p className="mt-1 text-center text-xs text-white/65">
                  {p.lead}
                </p>

                <ul className="mx-auto mt-10 flex w-full max-w-[260px] flex-1 flex-col gap-4">
                  {p.audiences.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-4 text-base font-medium text-white sm:text-lg"
                    >
                      <Check
                        className="pf-pop h-4 w-4 shrink-0 text-white"
                        strokeWidth={2.5}
                      />
                      {a}
                    </li>
                  ))}
                </ul>

                {/* Contact-CTA cards open the modal in place; GROW is a real
                    page, so it stays an ordinary link. */}
                {(() => {
                  const cls = `pf-interactive group mx-auto mt-8 inline-flex min-h-11 w-full max-w-[210px] items-center justify-between gap-2 rounded-full px-6 py-2.5 text-sm font-medium ${p.button}`;
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
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
