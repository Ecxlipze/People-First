import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Reveal } from "@/app/components/ScrollFx";
import { EPISODES } from "@/app/podcasts/episodes";

/* Insights → the featured podcast card that closes the mockup
   (public/images/Studio.pdf).

   One wide white card on the page's tinted field: still with a play overlay and
   a teal corner badge on the left, title and two stat columns on the right —
   the same card /podcasts renders per episode.

   The episode is imported from /podcasts' own EPISODES rather than restated
   here. The two mockups specify the same episode, so duplicating its title,
   still, badge and stats would mean four strings that have to be kept in step by
   hand — and the copy on this page would silently go stale the first time
   /podcasts was edited. EPISODES[0] is the mockup's episode; see episodes.ts.

   A Server Component: unlike the /podcasts list this card has no pager, so
   nothing here needs client JS. The card is a Link to /podcasts rather than a
   play <button>, because there is no inline player on this page — it sends the
   reader to where the episode actually plays. */

const FEATURED = EPISODES[0];

export default function FeaturedPodcast() {
  return (
    <section className="px-6 pb-28 sm:px-10 sm:pb-32 lg:px-20 xl:px-28 xl:pb-44">
      <Reveal className="mx-auto max-w-[70rem]">
        <Link
          href="/podcasts"
          className="group pf-card grid w-full min-w-0 gap-8 bg-white p-5 shadow-[0_18px_44px_-22px_rgba(80,80,120,0.3)] md:grid-cols-[minmax(0,22rem)_1fr] md:items-center md:p-8 lg:min-h-[40rem] lg:grid-cols-[minmax(0,27rem)_1fr] lg:gap-16 lg:px-14 lg:py-16"
        >
          {/* thumbnail + play overlay + corner badge. The negative left margin
              pulls the still past the card's padding, as in the mockup. */}
          <div className="relative aspect-square w-full min-w-0 md:-ml-12 md:self-center lg:-ml-24">
            <div className="absolute inset-0 overflow-hidden bg-zinc-900">
              <Image
                src={FEATURED.thumb}
                alt={FEATURED.thumbAlt}
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 22rem, 27rem"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white lg:h-20 lg:w-20">
                  <Play
                    className="ml-1 h-7 w-7 text-[#2d0b4e] lg:h-9 lg:w-9"
                    fill="currentColor"
                  />
                </span>
              </span>
            </div>
            <span
              className={`absolute bottom-0 left-0 max-w-[14rem] px-5 py-4 text-sm font-bold leading-tight text-white lg:-left-12 lg:max-w-[17rem] lg:px-7 lg:py-7 lg:text-xl ${FEATURED.badgeBg}`}
            >
              {FEATURED.badge}
            </span>
          </div>

          {/* title + the two stat columns */}
          <div className="min-w-0 md:py-3">
            <h2 className="max-w-[34rem] break-words text-lg font-display font-extrabold leading-[1.45] text-[#171922] transition-colors duration-200 group-hover:text-[#c64047] sm:text-xl lg:text-[2rem]">
              {FEATURED.title}
            </h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:mt-10 lg:gap-12">
              {FEATURED.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-base font-display font-extrabold text-[#171922] lg:text-2xl">
                    {s.label}
                  </p>
                  <p className="mt-3 text-[0.72rem] leading-relaxed text-zinc-500 lg:text-sm">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
