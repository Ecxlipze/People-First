import Image from "next/image";
import { Reveal } from "@/app/components/ScrollFx";

/* Podcasts → "Advanced Podcast Analytics". Two columns on a pale field: copy on
   the left, the phone + laptop dashboard illustration on the right. The two
   bolded phrases match the emphasis in the mockup. */
export default function Analytics() {
  return (
    <section className="bg-[#f4f4fc] px-6 py-20 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-6xl lg:pr-24">
        <Reveal className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-[#1a1a2e] sm:text-[1.75rem]">
              Advanced Podcast Analytics
            </h2>
            <p className="mt-5 max-w-md text-[0.8rem] leading-relaxed text-zinc-600 sm:text-[0.875rem]">
              Track your podcast&rsquo;s downloads with Buzz sprout&rsquo;s
              advanced podcast statistics. Filter by podcast episode, device
              type, date, podcast app, or location.{" "}
              <span className="font-bold text-[#1a1a2e]">
                Buzz sprout stats are IAB certified, and advanced analytics are
                included with all pricing plans.
              </span>
            </p>
          </div>

          <Image
            src="/images/podcast/analytics.webp"
            alt=""
            aria-hidden
            width={1200}
            height={683}
            className="w-full select-none"
          />
        </Reveal>
      </div>
    </section>
  );
}
