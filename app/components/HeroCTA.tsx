import Image from "next/image";
import ContactTrigger from "@/app/contact/ContactTrigger";
import { Recede } from "@/app/components/ScrollFx";

export default function HeroCTA({
  floating = false,
  className = "",
}: {
  floating?: boolean;
  className?: string;
}) {
  const content = (
    <>
      <div className="flex w-full flex-col gap-3 min-[450px]:flex-row sm:w-auto">
        <ContactTrigger
          href="/partner"
          role="Training Partner"
          className="inline-flex min-h-12 flex-1 items-center justify-center whitespace-nowrap rounded-md bg-[#a02f52] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#8c2946] sm:flex-none sm:px-5"
        >
          Partner with Us
        </ContactTrigger>
        <ContactTrigger
          href="/training"
          role="Student"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-md bg-zinc-200 px-4 py-3 text-center text-sm font-medium leading-tight text-zinc-700 transition-colors hover:bg-zinc-300 sm:flex-none sm:px-5"
        >
          Join Training Program
        </ContactTrigger>
      </div>
      <ContactTrigger
        href="/contact"
        aria-label="Say hello"
        className="hidden transition-transform duration-300 hover:-translate-y-1 hover:scale-110 sm:inline-flex"
      >
        <Image
          src="/images/icons/messages.png"
          alt=""
          width={40}
          height={40}
          className="h-8 w-8 select-none"
        />
      </ContactTrigger>
    </>
  );

  if (floating) {
    return (
      <Recede
        className={`absolute bottom-[max(2.5rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] z-20 flex flex-col items-end gap-3 sm:left-auto sm:right-[max(2rem,env(safe-area-inset-right))] lg:right-20 xl:right-32 sm:flex-row sm:items-center sm:gap-4 ${className}`}
      >
        {content}
      </Recede>
    );
  }

  return (
    <div
      className={`flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 ${className}`}
    >
      {content}
    </div>
  );
}
