import Link from "next/link";
import Image from "next/image";

/* Same logo header the other long-form pages (/media-events, /about) open with. */
export default function BlogHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10 lg:px-24 lg:pt-12 xl:px-28 xl:pt-14 [@media(max-height:500px)]:pt-4">
      <Link
        href="/"
        aria-label="People First — landing"
        className="group inline-flex min-h-11 items-center"
      >
        <Image
          src="/images/logo.svg"
          alt="People First"
          width={398}
          height={100}
          priority
          className="h-10 w-auto sm:h-12 lg:h-[52px] [@media(max-height:500px)]:h-9"
        />
      </Link>
    </header>
  );
}

export const BLOG_PAGE_BG =
  "relative overflow-x-clip bg-[linear-gradient(150deg,#f2fbfb_0%,#fbf8ff_45%,#fcf8ff_100%)]";

export function formatPostDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
