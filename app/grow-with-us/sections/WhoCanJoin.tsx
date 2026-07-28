import { Reveal } from "@/app/components/ScrollFx";

/* Grow With Us → "WHO CAN JOIN". Four tall coloured tiles whose oversized
   letters spell J-O-I-N; each carries a number and the audience it describes.
   The heading reads "WHO CAN" and the tiles complete the word — so the letters
   are aria-hidden and each tile exposes its audience text to screen readers. */
type Tile = {
  letter: string;
  n: number;
  label: string;
  bg: string;
  /* the small index number sits in the tile's own darker tint */
  num: string;
};

const TILES: Tile[] = [
  {
    letter: "J",
    n: 1,
    label: "Women seeking flexible, remote work opportunities",
    bg: "bg-[#b44cf0]",
    num: "text-[#7d2fae]",
  },
  {
    letter: "O",
    n: 2,
    label: "Youth (18–30) seeking income-generating digital skills",
    bg: "bg-[#2ec5b6]",
    num: "text-[#1c8b80]",
  },
  {
    letter: "I",
    n: 3,
    label: "Institutions seeking training partnerships",
    bg: "bg-[#8f7bf0]",
    num: "text-[#5a48b0]",
  },
  {
    letter: "N",
    n: 4,
    label: "SME employees wanting to upskill",
    bg: "bg-[#ef4444]",
    num: "text-[#a82b2b]",
  },
];

export default function WhoCanJoin() {
  return (
    <section className="bg-[#eef8f5] px-6 pb-28 pt-20 sm:px-12 sm:pb-32 sm:pt-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-[#1a1a2e] sm:text-[2rem]">
            WHO CAN <span className="sr-only">JOIN</span>
          </h2>
        </Reveal>

        <Reveal className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          {TILES.map((t) => (
            <div
              key={t.letter}
              className={`flex flex-col rounded-xl ${t.bg} px-4 pb-5 pt-6 shadow-[0_16px_36px_-18px_rgba(60,60,110,0.5)] transition-transform duration-300 hover:-translate-y-1.5`}
            >
              <span
                aria-hidden
                className="text-center text-6xl font-extrabold leading-none text-white sm:text-7xl"
              >
                {t.letter}
              </span>
              <span className={`mt-8 text-[0.7rem] font-bold ${t.num}`}>
                {t.n}
              </span>
              <p className="mt-2 text-[0.7rem] font-semibold leading-snug text-white sm:text-[0.75rem]">
                {t.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
