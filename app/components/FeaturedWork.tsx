import Image from "next/image";
import { Reveal } from "@/app/components/ScrollFx";
import { MediaFrame, StatCard } from "@/app/components/media";
import MediaShowcase from "@/app/components/MediaShowcase";
import PinnedRecede from "@/app/components/PinnedRecede";

const SKILLS = [
  "Seminars",
  "Round Talks",
  "Table Talks",
  "Conferences",
  "Tech Talks",
];

export default function FeaturedWork() {
  return (
    <section className="relative z-10 -mt-6 rounded-t-[2rem] bg-[linear-gradient(135deg,#eef1fb_0%,#f4f1fc_50%,#f8f6fd_100%)] pb-24 pt-32 shadow-[0_-24px_60px_-20px_rgba(80,80,120,0.35)] sm:-mt-8 sm:rounded-t-[3rem] sm:pt-44 md:-mt-[100vh]">
      {/* heading */}
      <Reveal className="px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
          Featured Work
        </h2>
        <p className="mt-3 text-lg text-zinc-500 sm:text-2xl">
          Let&rsquo;s give you exceptional reasons to choose us.
        </p>
      </Reveal>

      {/* ── Block 1: pinned cinematic stage (media scales through the pin) ── */}
      <MediaShowcase />

      {/* ── Block 2: media left, text right ──
          Pinned full-viewport and recedes as Section 3 rises over it — same
          swipe-over mechanism as the hero (Section 1 → 2). */}
      <PinnedRecede className="mx-auto max-w-6xl px-6 sm:px-10 lg:pr-32">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* media */}
          <div className="relative order-1">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_40%_50%,rgba(150,200,190,0.5)_0%,rgba(150,200,190,0)_65%)]"
            />
            {/* crystal accent, top-left */}
            <Image
              src="/images/pattern.png"
              alt=""
              aria-hidden
              width={1923}
              height={462}
              className="pointer-events-none absolute -left-4 -top-12 hidden h-16 w-auto -rotate-[8deg] select-none object-contain object-left opacity-90 sm:block"
            />
            <MediaFrame
              src="/images/featured/feature2.webp"
              alt="Rai Salahuddin Ahmad in conversation with Khuram Schezad, Advisor to the Finance Minister, at a conference"
              caption={
                <>
                  Khuram Schezad — Advisor to Finance Minister
                  <br />
                  Salahuddin Ahmad
                </>
              }
            />
            <StatCard
              value="5%"
              className="absolute -bottom-6 -right-4 sm:-right-8"
            >
              activity events all Pakistan
            </StatCard>
          </div>

          {/* text */}
          <div className="order-2">
            <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
              Tech Events Management&nbsp;.
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-500">
              We are strategy consultants who work with startup strategies and
              help promote and sell your products, including helping marketing.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="text-4xl font-extrabold text-[#e0325a] sm:text-5xl">
                30%
              </span>
              <span className="text-sm font-medium leading-tight text-zinc-500">
                management skills
              </span>
            </div>

            <ul className="mt-8 grid max-w-md grid-cols-2 gap-x-8 gap-y-4">
              {SKILLS.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center gap-2.5 text-base font-semibold text-zinc-700"
                >
                  <Image
                    src="/images/icons/task-icon.png"
                    alt=""
                    aria-hidden
                    width={26}
                    height={30}
                    className="h-5 w-auto shrink-0 select-none"
                  />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PinnedRecede>
    </section>
  );
}
