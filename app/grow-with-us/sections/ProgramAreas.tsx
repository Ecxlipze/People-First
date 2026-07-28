import Image from "next/image";
import { Reveal } from "@/app/components/ScrollFx";

/* Grow With Us → "Program Areas". Five white cards on a mint field, laid out
   3-up then 2-up and centred, each with its 3D illustration bleeding over the
   top-right corner. The middle card of each row sits slightly proud, matching
   the staggered rhythm of the mockup. */
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

function Card({ area, raised }: { area: Area; raised?: boolean }) {
  return (
    <div
      className={`group relative flex h-full flex-col rounded-xl bg-white px-6 pb-7 pt-8 shadow-[0_14px_40px_-18px_rgba(70,80,120,0.35)] transition-transform duration-300 hover:-translate-y-1.5 ${
        raised ? "lg:-translate-y-5 lg:hover:-translate-y-7" : ""
      }`}
    >
      {/* illustration — overlaps the card's top-right corner */}
      <Image
        src={area.icon}
        alt=""
        aria-hidden
        width={560}
        height={560}
        className={`pointer-events-none absolute -top-6 right-3 h-16 w-auto select-none drop-shadow-[0_10px_18px_rgba(60,60,110,0.28)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:-top-7 sm:h-[4.75rem] ${
          area.iconClass ?? ""
        }`}
      />

      {/* title is padded on the right so long headings clear the illustration */}
      <h3 className="max-w-[9.5rem] text-[1.0625rem] font-extrabold leading-snug text-[#1a1a2e] sm:text-lg">
        {area.title}
      </h3>
      {/* mt-auto pins the body to the card bottom so cards in a row stay level
          even when a title wraps to more lines than its neighbours */}
      <p className="mt-auto pt-5 text-[0.8rem] leading-relaxed text-zinc-500 sm:text-[0.85rem]">
        {area.body}
      </p>
    </div>
  );
}

export default function ProgramAreas() {
  return (
    <section className="relative overflow-hidden bg-[#e4f4ee] px-6 pb-24 pt-20 sm:px-12 sm:pb-28 sm:pt-24">
      {/* teal paper plane — decorative counterpart to the blue one in the hero */}
      <Image
        src="/images/grow/plane-teal.webp"
        alt=""
        aria-hidden
        width={253}
        height={500}
        className="animate-floaty pointer-events-none absolute left-6 top-24 hidden h-28 w-auto select-none opacity-80 lg:block xl:left-16"
      />

      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-[#1a1a2e] sm:text-[2rem]">
            PROGRAM AREAS
          </h2>
        </Reveal>

        {/* row 1 — three cards */}
        <Reveal className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {AREAS.slice(0, 3).map((a, i) => (
            <Card key={a.title} area={a} raised={i === 1} />
          ))}
        </Reveal>

        {/* row 2 — two cards, centred beneath the row above */}
        <Reveal className="mt-12 grid gap-6 sm:grid-cols-2 lg:mx-auto lg:mt-14 lg:w-2/3 lg:gap-7">
          {AREAS.slice(3).map((a, i) => (
            <Card key={a.title} area={a} raised={i === 1} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
