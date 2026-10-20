import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/app/lib/api";
import { cmsFetch, requireSession } from "@/app/cms/session";
import PodcastForm from "@/app/cms/podcasts/PodcastForm";
import type { CmsPodcast } from "@/app/cms/types";

export default async function EditPodcastPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { id } = await params;
  const { notice } = await searchParams;
  await requireSession();
  if (!/^\d+$/.test(id)) notFound();

  const episode = await cmsFetch<CmsPodcast>(`/api/podcasts/${id}/`, {}, { render: `/cms/podcasts/${id}` }).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
  if (!episode) notFound();

  return (
    <>
      <Link href="/cms/podcasts" className="inline-flex min-h-11 items-center text-sm font-bold text-[#a02f52]">← All episodes</Link>
      <h1 className="mt-1 break-words font-display text-3xl font-extrabold text-[#171922]">Edit episode</h1>
      <div className="mt-6"><PodcastForm key={episode.id} episode={episode} notice={notice} /></div>
    </>
  );
}
