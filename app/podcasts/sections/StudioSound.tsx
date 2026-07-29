import Image from "next/image";
import { Reveal } from "@/app/components/ScrollFx";

/* Podcasts → "Studio-quality sound without the studio". A centred lavender band:
   heading and copy stacked above the full-width audio-waveform illustration. */
export default function StudioSound() {
  return (
    <section className="bg-[#eee8ff] px-6 py-24 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <Reveal className="w-full min-w-0">
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-zinc-950 sm:text-[1.75rem]">
            Studio-Quality Sound Without The Studio
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-[0.8rem] font-medium capitalize leading-relaxed text-zinc-900 sm:text-[0.95rem]">
            Magic Mastering will remove background noise, balance levels, remove
            filler words, and help you achieve studio-quality sound. It&rsquo;s
            like an Instagram filter for your audio.
          </p>
        </Reveal>

        <Reveal className="mt-14 w-full min-w-0 sm:mt-20">
          <Image
            src="/images/podcast/waveform.webp"
            alt=""
            aria-hidden
            width={1400}
            height={444}
            className="mx-auto w-full min-w-0 max-w-full select-none sm:max-w-4xl"
          />
        </Reveal>
      </div>
    </section>
  );
}
