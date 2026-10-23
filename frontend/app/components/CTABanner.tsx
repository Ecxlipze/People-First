import Image from "next/image";
import ContactTrigger from "@/app/contact/ContactTrigger";
import { Reveal } from "@/app/components/ScrollFx";

/* About → CTA banner. Rounded deep-purple band with a faint wireframe globe on
   the right; "Let's Get in Touch" copy on the left, the contact CTA on the right.
   Styled to match the CTA band already inside SiteFooter so the page reads as
   one system. */
export default function CTABanner() {
  return (
    <section className="bg-white px-6 pb-16 pt-8 sm:px-10 sm:pt-12 lg:px-24 xl:px-28">
      <div className="mx-auto w-full max-w-[1440px]">
        <Reveal
          y={36}
          scale={0.975}
          className="relative overflow-hidden rounded-[0.625rem] bg-[linear-gradient(100deg,#150065_0%,#340d5e_55%,#4f1a57_100%)]"
        >
          {/* wireframe globe, flush-left and clipped by the rounded corner */}
          <Image
            src="/images/icons/globe.webp"
            alt=""
            aria-hidden
            width={500}
            height={500}
            className="pointer-events-none absolute left-0 top-1/2 hidden h-[135%] w-auto -translate-x-[38%] -translate-y-1/2 select-none opacity-30 [filter:brightness(0)_invert(1)] sm:block"
          />

          <div className="relative flex flex-col gap-8 px-8 py-10 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-11">
            {/* copy */}
            <div className="lg:pl-52">
              <h2 className="font-[family-name:var(--font-cormorant)] text-[1.75rem] italic leading-tight text-white sm:text-[2rem]">
                Let&rsquo;s Get in Touch
              </h2>
              <p className="mt-2 text-base text-white sm:text-[1.0625rem]">
                Learn More about us and what you wanna do further.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex w-full flex-none flex-col gap-3.5 sm:w-[380px]">
              <ContactTrigger
                href="/contact"
                className="pf-interactive w-full rounded-md bg-white px-5 py-3 text-center text-[0.95rem] font-bold text-black hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-lg"
              >
                Contact us
              </ContactTrigger>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
