import Link from "next/link";
import { requireSession } from "@/app/cms/session";
import PodcastForm from "@/app/cms/podcasts/PodcastForm";

export default async function NewPodcastPage() {
  await requireSession();
  return (
    <>
      <Link href="/cms/podcasts" className="inline-flex min-h-11 items-center text-sm font-bold text-[#a02f52]">← All episodes</Link>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-[#171922]">New episode</h1>
      <div className="mt-6"><PodcastForm /></div>
    </>
  );
}
