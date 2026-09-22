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
    title: "Freelancing &\nRemote Work",
    body: "How to earn online using global platforms.",
    icon: "/images/grow/prog-freelance.webp",
    iconClass: "h-20 sm:h-24 right-0 -top-2",
  },
  {
    title: "E commerce\nOperations",
    body: "How to run a successful online store.",
    icon: "/images/grow/prog-ecom.webp",
    iconClass: "h-20 sm:h-24 right-0 -top-2",
  },
  {
    title: "Social Media\nTraining",
    body: "Content Creation, Social media, SEO & Advertising",
    icon: "/images/grow/prog-social.webp",
    iconClass: "h-20 sm:h-24 right-0 -top-2 scale-x-[-1]",
  },
  {
    title: "AI Tools for\nWork",
    body: "Using AI to increase productivity & Value",
    icon: "/images/grow/prog-ai.webp",
    iconClass: "h-20 sm:h-24 right-0 top-0",
  },
  {
    title: "Business\nCommunication &\nProfessional Skills",
    body: "Work ready Digital Communication",
    icon: "/images/grow/prog-comms.webp",
    iconClass: "h-20 sm:h-24 -right-2 top-0",
  },
];

function Card({ area }: { area: Area }) {
  /* Wrapper owns <Stagger>'s entrance transform so .pf-card is free to own the
     hover lift during that entrance. */
  return (
    <div className="h-full">
      <div className="pf-card group relative flex h-full min-h-[220px] flex-col rounded-[1.25rem] bg-white px-7 pb-8 pt-8 shadow-[0_15px_40px_-15px_rgba(70,80,120,0.15)] sm:pt-10">
        {/* illustration — overlaps the card's top-right corner slightly */}
        <Image
          src={area.icon}
          alt=""
          aria-hidden
          width={560}
          height={560}
          className={`pf-pop pointer-events-none absolute w-auto select-none drop-shadow-[0_8px_16px_rgba(60,60,110,0.2)] ${
            area.iconClass ?? ""
          }`}
        />

        {/* title is padded on the right so long headings clear the illustration */}
        <h3 className="whitespace-pre-line pr-16 font-display text-[1.1rem] font-bold leading-tight text-zinc-950 sm:text-xl">
          {area.title}
        </h3>
        {/* mt-auto pins the body to the card bottom so cards in a row stay level
            even when a title wraps to more lines than its neighbours */}
        <p className="mt-auto max-w-[14rem] pt-5 text-[0.85rem] font-normal leading-relaxed text-zinc-800 sm:text-[0.9rem]">
          {area.body}
        </p>
      </div>
    </div>
  );
}

export default function ProgramAreas() {
  return (
    <section className="relative overflow-hidden bg-[#E8F8F5] px-6 pb-28 pt-20 sm:px-10 sm:pb-36 sm:pt-24 lg:px-24 xl:px-28">
      {/* teal paper plane — decorative counterpart to the blue one in the hero */}
      <Image
        src="/images/grow/plane-teal.webp"
        alt=""
        aria-hidden
        width={253}
        height={500}
        className="animate-floaty pointer-events-none absolute left-6 top-16 hidden h-24 w-auto select-none opacity-80 lg:block xl:left-16"
      />

      <div className="relative mx-auto max-w-[1240px]">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            PROGRAM AREAS
          </h2>
        </Reveal>

        {/* row 1 — three cards. Each row staggers on its own so the cascade
            restarts on row 2 rather than the two rows sharing one long ramp. */}
        <Stagger className="mt-16 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.slice(0, 3).map((a) => (
            <Card key={a.title} area={a} />
          ))}
        </Stagger>

        {/* row 2 — two cards, centred beneath the row above */}
        <Stagger className="mt-6 grid items-stretch gap-6 sm:grid-cols-2 lg:mx-auto lg:w-2/3">
          {AREAS.slice(3).map((a) => (
            <Card key={a.title} area={a} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
