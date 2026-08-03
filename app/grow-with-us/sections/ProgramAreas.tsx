import Image from "next/image";
import { Reveal, Stagger } from "@/app/components/ScrollFx";

/* Grow With Us → "Program Areas". Five white cards on a mint field, laid out
   three-up then two-up and centred, with the supplied 3D illustrations. */
type Area = {
  title: string;
  body: string;
  icon: string;
  /* the illustration is decorative — the title already names the program */
  iconClass?: string;
};

const AREAS: Area[] = [
  {
    title: "Freelancing & Remote Work",
    body: "How to earn online using global platforms.",
    icon: "/images/grow/prog-freelance.webp",
  },
  {
    title: "E commerce Operations",
    body: "How to run a successful online store.",
    icon: "/images/grow/prog-ecom.webp",
  },
  {
    title: "Social Media Training",
    body: "Content Creation, Social media, SEO & Advertising",
    icon: "/images/grow/prog-social.webp",
  },
  {
    title: "AI Tools for Work",
    body: "Using AI to increase productivity & Value",
    icon: "/images/grow/prog-ai.webp",
  },
  {
    title: "Business Communication & Professional Skills",
    body: "Work ready Digital Communication",
    icon: "/images/grow/prog-comms.webp",
  },
];

function Card({ area }: { area: Area }) {
  /* Wrapper absorbs <Stagger>'s scroll transform so .pf-card is free to own the
     hover lift — the two cannot share one element. */
  return (
    <div className="h-full">
      <div className="pf-card group relative flex h-full min-h-[240px] flex-col rounded-xl bg-white px-7 pb-8 pt-10 shadow-[0_18px_45px_-20px_rgba(70,80,120,0.35)]">
        {/* illustration — overlaps the card's top-right corner */}
        <Image
          src={area.icon}
          alt=""
          aria-hidden
          width={560}
          height={560}
          className={`pf-pop pointer-events-none absolute -top-5 right-3 h-24 w-auto select-none drop-shadow-[0_10px_18px_rgba(60,60,110,0.28)] sm:h-28 ${
            area.iconClass ?? ""
          }`}
        />

        {/* title is padded on the right so long headings clear the illustration */}
        <h3 className="max-w-[13rem] text-xl font-extrabold leading-snug text-zinc-950 sm:text-2xl">
          {area.title}
        </h3>
        {/* mt-auto pins the body to the card bottom so cards in a row stay level
            even when a title wraps to more lines than its neighbours */}
        <p className="mt-auto max-w-[14rem] pt-6 text-sm leading-relaxed text-zinc-900 sm:text-base">
          {area.body}
        </p>
      </div>
    </div>
  );
}

export default function ProgramAreas() {
  return (
    <section className="relative overflow-hidden bg-[#dcf5f3] px-6 pb-28 pt-24 sm:px-10 sm:pb-36 sm:pt-28 lg:px-24 xl:px-28">
      {/* teal paper plane — decorative counterpart to the blue one in the hero */}
      <Image
        src="/images/grow/plane-teal.webp"
        alt=""
        aria-hidden
        width={253}
        height={500}
        className="animate-floaty pointer-events-none absolute left-6 top-24 hidden h-28 w-auto select-none opacity-80 lg:block xl:left-16"
      />

      <div className="relative mx-auto max-w-[1240px]">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-[2.5rem]">
            PROGRAM AREAS
          </h2>
        </Reveal>

        {/* row 1 — three cards. Each row staggers on its own so the cascade
            restarts on row 2 rather than the two rows sharing one long ramp. */}
        <Stagger className="mt-20 grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.slice(0, 3).map((a) => (
            <Card key={a.title} area={a} />
          ))}
        </Stagger>

        {/* row 2 — two cards, centred beneath the row above */}
        <Stagger className="mt-20 grid items-stretch gap-8 sm:grid-cols-2 lg:mx-auto lg:w-2/3">
          {AREAS.slice(3).map((a) => (
            <Card key={a.title} area={a} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
