import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/app/lib/api";
import { cmsFetch, requireSession } from "@/app/cms/session";
import TestimonialForm from "@/app/cms/testimonials/TestimonialForm";
import type { CmsTestimonial } from "@/app/cms/types";

export default async function EditTestimonialPage({
  params, searchParams,
}: { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> }) {
  const { id } = await params;
  const { notice } = await searchParams;
  await requireSession();
  if (!/^\d+$/.test(id)) notFound();
  const item = await cmsFetch<CmsTestimonial>(`/api/testimonials/${id}/`, {}, { render: `/cms/testimonials/${id}` }).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
  if (!item) notFound();
  return (
    <>
      <Link href="/cms/testimonials" className="inline-flex min-h-11 items-center text-sm font-bold text-[#a02f52]">← All testimonials</Link>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-[#171922]">Edit testimonial</h1>
      <div className="mt-6"><TestimonialForm key={item.id} item={item} notice={notice} /></div>
    </>
  );
}
