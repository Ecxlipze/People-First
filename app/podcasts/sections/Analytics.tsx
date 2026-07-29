import Image from "next/image";
import { Reveal } from "@/app/components/ScrollFx";

/* Podcasts → "Advanced Podcast Analytics". Two columns on a pale field: copy on
   the left, the phone + laptop dashboard illustration on the right. The two
   bolded phrases match the emphasis in the mockup. */
export default function Analytics() {
  return (
    <section className="flex min-h-[620px] items-center bg-[#f4f4fc] px-6 py-24 sm:px-10 sm:py-28">
      <div className="mx-auto w-full max-w-[1400px] lg:px-16 lg:pr-36">
        <Reveal className="grid min-w-0 items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-zinc-950 sm:text-[1.75rem]">
              Advanced Podcast Analytics
            </h2>
            <p className="mt-8 max-w-[32rem] text-[0.8rem] leading-relaxed text-zinc-800 sm:text-[1rem]">
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
            sizes="(max-width: 768px) 100vw, 52vw"
            className="w-full min-w-0 max-w-full justify-self-end select-none md:max-w-[600px]"
          />
        </Reveal>
      </div>
    </section>
  );
}
