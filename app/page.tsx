import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import RadialNav from "@/app/components/RadialNav";
import ContactTrigger from "@/app/contact/ContactTrigger";

export default function Landing() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-[radial-gradient(ellipse_at_center_top,#2a2a30_0%,#141417_45%,#0b0b0d_100%)]">
      <main className="relative flex flex-1 flex-col items-center justify-center px-4">
        <RadialNav />

        <div className="animate-fade-in-up relative mt-16 flex flex-col items-center [@media(max-height:500px)]:mt-0">
          {/* soft pulsing glow behind the logo */}
          <div
            aria-hidden
            className="animate-glow-pulse pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(43,191,196,0.25)_0%,rgba(43,191,196,0)_70%)] sm:h-[460px] sm:w-[460px]"
          />
          <Image
            src="/images/peoplefirst.svg"
            alt="People First"
            width={619}
            height={505}
            priority
            className="animate-floaty w-[210px] max-w-[85vw] sm:w-[300px] lg:w-[480px] [@media(max-height:500px)]:w-[150px]"
          />
        </div>
      </main>

      <footer className="animate-fade-in-up flex flex-col gap-6 pb-[max(2rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] text-sm text-zinc-400 sm:flex-row sm:items-end sm:justify-between sm:pl-[max(3.5rem,env(safe-area-inset-left))] sm:pr-[max(3.5rem,env(safe-area-inset-right))]">
        <div className="space-y-1">
          <p className="font-semibold text-white">
            58-A2 Kickstart Tipu Road Gulberg, Lahore, PK
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              href="/privacy"
              className="pf-interactive pf-underline inline-flex min-h-11 items-center hover:text-white"
            >
              Privacy
            </Link>
            <span className="text-zinc-600">|</span>
            <Link
              href="/terms"
              className="pf-interactive pf-underline inline-flex min-h-11 items-center hover:text-white"
            >
              Terms of Service
            </Link>
            <span className="text-zinc-600">|</span>
            <Link
              href="/cookies"
              className="pf-interactive pf-underline inline-flex min-h-11 items-center hover:text-white"
            >
              Cookies
            </Link>
          </div>
        </div>

        <ContactTrigger
          href="/contact"
          className="pf-interactive group inline-flex min-h-11 items-center gap-3 self-start text-lg font-bold text-white hover:-translate-y-0.5 hover:text-accent sm:self-auto sm:text-xl"
        >
          Say Hello!
          <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 sm:h-7 sm:w-7" />
        </ContactTrigger>
      </footer>
    </div>
  );
}
