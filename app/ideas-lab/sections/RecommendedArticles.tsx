import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import SmartImage from "@/app/components/SmartImage";
import { CountUp, Reveal } from "@/app/components/ScrollFx";
import { ARTICLES, type Article } from "@/app/ideas-lab/articles";

/* Ideas Lab → "Recommended Article" (SECTION 2).

   The covering half of the swipe-over pattern: opaque background, rounded top,
   upward shadow, higher z-index and a small negative top margin, so it rises up
   over the pinned hero — the same treatment FeaturedWork uses on /home.

   Three rows alternate sides: copy left / media right, then media left / copy
   right. Each media block is a video still with a play button, a teal stat card
   overlapping its lower-left, a soft rainbow glow behind it, and a paper-plane
   accent at one corner.

   The stills in /public/images/insights/ were extracted from the
   `insights 4.pdf` mockup. Their source frames have three different aspect
   ratios, so each carries its own `thumbPosition` — see articles.ts. */

/* The multi-hued wash behind each thumbnail. Four offset radial gradients read
   as one soft rainbow bloom, matching the mockup without needing a raster. */
function RainbowGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-8 -z-10 select-none blur-3xl sm:-inset-10"
      style={{
        background: `
          radial-gradient(circle at 20% 28%, rgba(90,205,180,1) 0%, rgba(90,205,180,0) 65%),
          radial-gradient(circle at 80% 20%, rgba(130,140,245,1) 0%, rgba(130,140,245,0) 65%),
          radial-gradient(circle at 26% 84%, rgba(245,105,195,1) 0%, rgba(245,105,195,0) 65%),
          radial-gradient(circle at 72% 80%, rgba(255,175,90,1) 0%, rgba(255,175,90,0) 65%),
          radial-gradient(circle at 52% 55%, rgba(190,120,240,0.85) 0%, rgba(190,120,240,0) 70%)
        `,
      }}
    />
  );
}

function Media({
  article,
  plane,
}: {
  article: Article;
  plane: "left" | "right";
}) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <RainbowGlow />

      {/* paper plane accent — sits above the frame, opposite the copy */}
      <Image
        src={
          plane === "right"
            ? "/images/ideas-lab/plane-teal.webp"
            : "/images/ideas-lab/plane-blue.webp"
        }
        alt=""
        aria-hidden
        width={253}
        height={500}
        className={`animate-floaty pointer-events-none absolute -top-14 z-20 hidden h-20 w-auto select-none sm:block ${
          plane === "right" ? "-right-4" : "-left-4"
        }`}
      />

      {/* video still + play button. The still fades up once decoded rather than
          snapping in — see SmartImage. The shadow deepens with the row's hover
          so the whole card reads as one target. */}
      <div className="relative ml-auto aspect-[16/10] w-[85%] overflow-hidden bg-zinc-800 shadow-[0_20px_50px_-24px_rgba(40,40,80,0.6)] transition-shadow duration-300 group-hover:shadow-[0_30px_60px_-22px_rgba(40,40,80,0.75)]">
        <SmartImage
          src={article.thumb}
          alt={article.thumbAlt}
          fill
          sizes="(max-width: 768px) 85vw, 24rem"
          skeleton
          style={{ objectPosition: article.thumbPosition ?? "center" }}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:ring-4 group-hover:ring-white/40">
            <Play
              className="ml-0.5 h-4 w-4 text-zinc-800"
              fill="currentColor"
            />
          </span>
        </span>
      </div>

      {/* Teal stat card, clipping the still's lower-left CORNER. It hangs below
          the frame's bottom edge and well past its left edge on purpose: the
          stills are photographs of people, and a card sitting inside the frame
          covers the subjects' faces. */}
      <div className="absolute -bottom-5 left-0 z-10 w-[8.5rem] bg-[#6cb5a6] px-4 py-4 text-white shadow-[0_14px_30px_-14px_rgba(40,80,70,0.7)] sm:w-[9.5rem] sm:py-5">
        <CountUp
          value={article.cardValue}
          className="block text-lg font-extrabold leading-none sm:text-xl"
        />
        <p className="mt-1.5 whitespace-pre-line text-[0.65rem] font-semibold leading-tight sm:text-[0.7rem]">
          {article.cardLabel}
        </p>
      </div>
    </div>
  );
}

function Copy({ article }: { article: Article }) {
  return (
    <div className="max-w-sm">
      {/* The row is a link, so the title picks up the brand colour on hover to
          signal that — the row's group-hover drives it. */}
      <h3 className="text-xl font-display font-extrabold leading-snug tracking-tight text-[#1a1a2e] transition-colors duration-200 group-hover:text-[#e0325a] sm:text-[1.4rem]">
        {article.title}
      </h3>
      <p className="mt-3 text-[0.7rem] leading-relaxed text-zinc-500 sm:text-[0.75rem]">
        {article.blurb}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <CountUp
          value={article.metric}
          className="text-2xl font-extrabold text-[#e0325a] sm:text-[1.75rem]"
        />
        <span className="whitespace-pre-line text-[0.65rem] font-medium leading-tight text-zinc-500">
          {article.metricLabel}
        </span>
      </div>
    </div>
  );
}

export default function RecommendedArticles() {
  return (
    <section className="relative z-10 rounded-t-[2rem] bg-white pb-24 pt-20 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:rounded-t-[3rem] sm:pb-28 sm:pt-24">
      <Reveal className="px-6 text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-[#1a1a2e] sm:text-[1.6rem]">
          Recommended Article
        </h2>
      </Reveal>

      <div className="mx-auto mt-16 flex max-w-5xl flex-col gap-24 px-6 sm:mt-20 sm:gap-28 sm:px-10 lg:pr-28">
        {ARTICLES.map((article, i) => {
          /* rows alternate: even rows put the copy first, odd rows the media */
          const mediaFirst = i % 2 === 1;
          return (
            <Reveal key={`${article.title}-${i}`}>
              <Link
                href={article.href}
                className="group grid items-center gap-10 md:grid-cols-2 md:gap-14"
              >
                <div className={mediaFirst ? "md:order-2" : ""}>
                  <Copy article={article} />
                </div>
                <div className={mediaFirst ? "md:order-1" : ""}>
                  <Media
                    article={article}
                    plane={mediaFirst ? "left" : "right"}
                  />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
