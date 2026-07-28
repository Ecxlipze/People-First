import Image from "next/image";
import { Reveal } from "@/app/components/ScrollFx";

/* Podcasts → "Studio-quality sound without the studio". A centred lavender band:
   heading and copy stacked above the full-width audio-waveform illustration. */
export default function StudioSound() {
  return (
    <section className="bg-[#e9e4fb] px-6 py-20 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-[#1a1a2e] sm:text-[1.75rem]">
            Studio-Quality Sound Without The Studio
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[0.8rem] font-medium leading-relaxed text-zinc-600 sm:text-[0.9rem]">
            Magic Mastering will remove background noise, balance levels, remove
            filler words, and help you achieve studio-quality sound. It&rsquo;s
            like an Instagram filter for your audio.
          </p>
        </Reveal>

        <Reveal className="mt-12 sm:mt-16">
          <Image
            src="/images/podcast/waveform.webp"
            alt=""
            aria-hidden
            width={1400}
            height={444}
            className="mx-auto w-full max-w-3xl select-none"
          />
        </Reveal>
      </div>
    </section>
  );
}
