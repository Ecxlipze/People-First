import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/app/lib/api";
import { cmsFetch, requireSession } from "@/app/cms/session";
import VentureForm from "@/app/cms/ventures/VentureForm";
import type { CmsVenture } from "@/app/cms/types";

export default async function EditVenturePage({
  params, searchParams,
}: { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> }) {
  const { id } = await params;
  const { notice } = await searchParams;
  await requireSession();
  if (!/^\d+$/.test(id)) notFound();
  const item = await cmsFetch<CmsVenture>(`/api/ventures/${id}/`, {}, { render: `/cms/ventures/${id}` }).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
  if (!item) notFound();
  return (
    <>
      <Link href="/cms/ventures" className="inline-flex min-h-11 items-center text-sm font-bold text-[#a02f52]">← All ventures</Link>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-[#171922]">Edit venture</h1>
      <div className="mt-6"><VentureForm key={item.id} item={item} notice={notice} /></div>
    </>
  );
}
