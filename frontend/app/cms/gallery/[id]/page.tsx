import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/app/lib/api";
import { cmsFetch, requireSession } from "@/app/cms/session";
import GalleryForm from "@/app/cms/gallery/GalleryForm";
import type { CmsGalleryItem } from "@/app/cms/types";

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireSession();
  if (!/^\d+$/.test(id)) notFound();

  const item = await cmsFetch<CmsGalleryItem>(`/api/gallery/${id}/`, {}, { render: `/cms/gallery/${id}` }).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
  if (!item) notFound();

  return (
    <>
      <Link href="/cms/gallery" className="inline-flex min-h-11 items-center text-sm font-bold text-[#a02f52]">← Gallery</Link>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-[#171922]">Edit photo</h1>
      <div className="mt-6"><GalleryForm key={item.id} item={item} /></div>
    </>
  );
}
