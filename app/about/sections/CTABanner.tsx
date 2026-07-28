import Image from "next/image";
import ContactTrigger from "@/app/contact/ContactTrigger";

/* About → CTA banner. Rounded deep-purple band with a faint wireframe globe on
   the right; "Let's Get in Touch" copy on the left, the three CTAs on the right.
   Styled to match the CTA band already inside SiteFooter so the page reads as
   one system. */
export default function CTABanner() {
  return (
    <section className="bg-white px-6 pb-16 sm:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[linear-gradient(115deg,#26095f_0%,#3a1268_50%,#5a1e6d_100%)]">
          {/* wireframe globe, right side, clipped by the rounded corner */}
          <Image
            src="/images/icons/globe.webp"
            alt=""
            aria-hidden
            width={500}
            height={500}
            className="pointer-events-none absolute right-0 top-1/2 h-[150%] w-auto -translate-y-1/2 translate-x-[30%] select-none opacity-25 [filter:brightness(0)_invert(1)]"
          />

          <div className="relative flex flex-col gap-8 px-8 py-10 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            {/* copy */}
            <div>
              <h2 className="font-serif text-[1.75rem] italic leading-tight text-white sm:text-[2rem]">
                Let&rsquo;s Get in Touch
              </h2>
              <p className="mt-2 text-base text-white/85 sm:text-[1.0625rem]">
                Learn More about us and what you wanna do further.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex w-full flex-none flex-col gap-3.5 sm:w-[29rem]">
              <div className="flex flex-col gap-3.5 sm:flex-row">
                <ContactTrigger
                  href="/contact"
                  className="flex-1 whitespace-nowrap rounded-lg border border-white/50 px-5 py-3 text-center text-[0.95rem] font-medium text-white transition-colors hover:bg-white/10"
                >
                  Book a Consultation
                </ContactTrigger>
                <ContactTrigger
                  href="/training"
                  role="Student"
                  className="flex-1 whitespace-nowrap rounded-lg bg-[#dfd3ef] px-5 py-3 text-center text-[0.95rem] font-medium text-[#3f2a6b] transition-colors hover:bg-white"
                >
                  Join a Training Program
                </ContactTrigger>
              </div>
              <ContactTrigger
                href="/partner"
                role="Training Partner"
                className="w-full rounded-lg bg-white px-5 py-3 text-center text-[0.95rem] font-bold text-[#1a1a2e] transition-colors hover:bg-white/90"
              >
                Partner With Us
              </ContactTrigger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
