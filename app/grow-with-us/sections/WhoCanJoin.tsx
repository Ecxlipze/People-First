import { Reveal, Stagger } from "@/app/components/ScrollFx";

/* Grow With Us → "WHO CAN JOIN". Four tall coloured tiles whose oversized
   letters spell J-O-I-N; each carries a number and the audience it describes.
   The heading reads "WHO CAN" and the tiles complete the word — so the letters
   are aria-hidden and each tile exposes its audience text to screen readers. */
type Tile = {
  letter: string;
  n: number;
  label: string;
  top: string;
  bottom: string;
  accent: string;
};

const TILES: Tile[] = [
  {
    letter: "J",
    n: 1,
    label: "Women seeking flexible, remote work opportunities",
    top: "bg-[#a72cf3]",
    bottom: "bg-[#e5c5fb]",
    accent: "text-[#a72cf3]",
  },
  {
    letter: "O",
    n: 2,
    label: "Youth (18–30) seeking income-generating digital skills",
    top: "bg-[#29bdc3]",
    bottom: "bg-[#acf1f2]",
    accent: "text-[#16aeb5]",
  },
  {
    letter: "I",
    n: 3,
    label: "Institutions seeking training partnerships",
    top: "bg-[#4652e8]",
    bottom: "bg-[#c8cbfa]",
    accent: "text-[#4652e8]",
  },
  {
    letter: "N",
    n: 4,
    label: "SME employees wanting to upskill",
    top: "bg-[#ca2037]",
    bottom: "bg-[#fac1c8]",
    accent: "text-[#ca2037]",
  },
];

export default function WhoCanJoin() {
  return (
    <section className="bg-[#eefaf9] px-6 pb-40 pt-32 sm:px-10 sm:pb-48 sm:pt-36 lg:px-24 xl:px-28">
      <div className="mx-auto max-w-[820px]">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-[2.5rem]">
            WHO CAN <span className="sr-only">JOIN</span>
          </h2>
        </Reveal>

        {/* These four tiles spell J-O-I-N, so a left-to-right cascade lets the
            word assemble itself as the row scrolls in. Each tile is wrapped
            because <Stagger> transforms its direct children and .pf-card
            transforms on hover — one element cannot carry both. */}
        <Stagger
          className="mt-20 grid grid-cols-2 items-stretch gap-4 sm:grid-cols-4 sm:gap-5"
          step={70}
        >
          {TILES.map((t) => (
            <div key={t.letter} className="h-full">
              <div className="pf-card group flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl shadow-[0_16px_36px_-18px_rgba(60,60,110,0.5)]">
                <div className={`grid h-44 place-items-center ${t.top}`}>
                  <span
                    aria-hidden
                    className="pf-pop font-heading text-center text-7xl font-extrabold leading-none text-white sm:text-8xl"
                  >
                    {t.letter}
                  </span>
                </div>
                <div
                  className={`flex flex-1 flex-col px-4 pb-6 pt-7 ${t.bottom}`}
                >
                  <span className={`text-center text-lg font-bold ${t.accent}`}>
                    {t.n}
                  </span>
                  <p className="mt-7 text-sm font-semibold leading-snug text-zinc-950 sm:text-[0.95rem]">
                    {t.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
