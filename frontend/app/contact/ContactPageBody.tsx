import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, Phone, MapPin, Clock, ChevronDown } from "lucide-react";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import ContactPanel from "./ContactPanel";
import type { InquiryType } from "./inquiry";

interface ContactPageBodyProps {
  defaultRole?: string;
  /* Which Inquiry.inquiry_type this route files submissions under; see ./inquiry.
     Defaults to contact_us further down the tree. */
  inquiryType?: InquiryType;
  /* Small label above the heading, e.g. "Get in Touch" or "Partner with Us". */
  eyebrow?: string;
  pageTitle?: string;
  pageDescription?: string;
}

const FAQS = [
  {
    question: "What happens after I submit this form?",
    answer:
      "Our team reviews every inquiry within 24 to 48 business hours. We will connect you directly with the domain specialist or venture lead best suited to discuss your needs and next steps.",
  },
  {
    question: "How can my organisation partner with People First?",
    answer:
      "We partner with academic institutions, enterprises, and grassroots initiatives across training, community events, and startup incubation. Select 'Training Partner' or 'Institutional Partner' in the form, and our partnerships team will reach out with collaboration models.",
  },
  {
    question: "Are your training programs open to remote participants?",
    answer:
      "Yes! While we run in-person cohorts and workshops in Lahore and Islamabad, our key courses and digital bootcamps feature comprehensive hybrid and remote tracks for participants nationwide and abroad.",
  },
  {
    question: "How do I pitch a startup idea to the Ideas Lab?",
    answer:
      "Choose 'Venture Founder' from the role dropdown and provide an overview of your concept, market traction, or current stage in the message box. We evaluate founders for mentorship, workspace, and venture support.",
  },
  {
    question: "Can I schedule an in-person meeting at your office?",
    answer:
      "We welcome visitors at our Lahore headquarters by prior appointment. Please send an inquiry or message us on WhatsApp in advance so we can prepare for your visit.",
  },
];

export default function ContactPageBody({
  defaultRole,
  inquiryType = "contact_us",
  eyebrow = "Get in Touch",
  pageTitle = "Contact People First",
  pageDescription = "Have a question, pitch, or partnership proposal? Reach out to our team and let's explore how we can create lasting impact together.",
}: ContactPageBodyProps) {

  return (
    <>
      <SideNav tone="light" />
      <div className="min-h-screen overflow-x-clip bg-[linear-gradient(165deg,#f7f6fd_0%,#f4f2fc_50%,#efeefb_100%)] text-zinc-800 selection:bg-pf-magenta selection:text-white">
        <header className="relative z-20 mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 lg:pt-12 xl:px-28 xl:pt-14 [@media(max-height:500px)]:pt-4">
          <Link href="/" aria-label="People First — Home" className="pf-interactive inline-flex min-h-11 items-center rounded-sm">
            <Image src="/images/logo.svg" alt="People First" width={398} height={100} priority className="h-10 w-auto sm:h-12 lg:h-[52px] [@media(max-height:500px)]:h-9" />
          </Link>
        </header>

        <main>
          <section aria-labelledby="contact-title" className="mx-auto max-w-[1600px] px-6 pb-10 pt-12 sm:px-10 sm:pb-12 sm:pt-16 lg:pl-24 lg:pr-32 xl:pl-28 xl:pr-36 [@media(max-height:500px)]:pt-8">
            <p className="mb-4 text-sm font-semibold text-[#6b215b]">{eyebrow}</p>
            <h1 id="contact-title" style={{ fontWeight: 700 }} className="max-w-[980px] font-display text-3xl font-bold leading-none tracking-normal text-[#612252] sm:text-4xl lg:text-[38px] xl:text-[42px]">
              {pageTitle}
            </h1>
            <p className="mt-6 max-w-[920px] text-[0.95rem] font-normal leading-relaxed text-[#6b215b] sm:text-lg">{pageDescription}</p>
          </section>

          <section aria-label="Contact form" className="mx-auto max-w-[1600px] px-6 pb-12 sm:px-10 sm:pb-16 lg:pl-24 lg:pr-32 xl:pl-28 xl:pr-36">
            {/* The same panel as the modal; standalone only adapts spacing for a scrollable page. */}
            <div className="overflow-hidden rounded-[1.75rem]">
              <ContactPanel
                defaultRole={defaultRole}
                inquiryType={inquiryType}
                headingId="contact-page-heading"
                standalone
              />
            </div>
          </section>

          <section aria-label="Contact details" className="border-y border-pf-purple/10 bg-white/50">
            <div className="mx-auto grid max-w-[1600px] gap-8 px-6 py-10 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:gap-6 lg:pl-24 lg:pr-32 xl:pl-28 xl:pr-36">
              <div>
                <Phone aria-hidden className="mb-4 h-5 w-5 text-pf-teal" />
                <h2 className="text-base">Call or WhatsApp</h2>
                <a href="https://wa.me/923061113337" target="_blank" rel="noopener noreferrer" className="pf-interactive mt-2 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-zinc-700 hover:text-pf-purple">Chat on WhatsApp <ArrowUpRight aria-hidden className="h-4 w-4" /></a>
              </div>
              <div>
                <Mail aria-hidden className="mb-4 h-5 w-5 text-pf-magenta" />
                <h2 className="text-base">Email Us</h2>
                <a href="mailto:info@peoplefirst.pk" className="pf-interactive mt-2 inline-flex min-h-11 items-center rounded-sm text-sm text-zinc-700 hover:text-pf-purple">info@peoplefirst.pk</a>
                <p className="text-xs text-zinc-600">We reply within 24–48 hours</p>
              </div>
              <div>
                <MapPin aria-hidden className="mb-4 h-5 w-5 text-pf-orange" />
                <h2 className="text-base">Headquarters</h2>
                <p className="mt-3 max-w-56 text-sm leading-relaxed text-zinc-700">58-A2 Kickstart, Tipu Road, Gulberg III, Lahore</p>
              </div>
              <div>
                <Clock aria-hidden className="mb-4 h-5 w-5 text-pf-gold" />
                <h2 className="text-base">Working Hours</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">Monday to Saturday<br />9:00 AM – 6:00 PM PKT</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="contact-faq-title" className="mx-auto grid max-w-[1600px] gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:py-24 lg:pl-24 lg:pr-32 xl:pl-28 xl:pr-36">
            <div>
              <h2 id="contact-faq-title" className="font-display text-3xl font-bold leading-tight tracking-tight text-[#612252] sm:text-4xl">Frequently Asked Questions</h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-700">Quick answers to common questions about inquiries, partnerships, and training programs.</p>
            </div>
            <div className="min-w-0 border-t border-pf-purple/15">
              {FAQS.map((faq, index) => (
                <details key={faq.question} className="group border-b border-pf-purple/15 py-2">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 rounded-sm py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pf-purple [&::-webkit-details-marker]:hidden">
                    <span aria-hidden className="text-xs text-pf-magenta-dark">0{index + 1}</span>
                    <span className="flex-1 text-sm font-semibold sm:text-base">{faq.question}</span>
                    <ChevronDown aria-hidden className="h-5 w-5 shrink-0 text-pf-purple group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 pl-8 pr-5 text-sm leading-relaxed text-zinc-700">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
        <SiteFooter showCta={false} />
      </div>
    </>
  );
}
