import Link from "next/link";
import { requireSession } from "@/app/cms/session";
import TestimonialForm from "@/app/cms/testimonials/TestimonialForm";

export default async function NewTestimonialPage() {
  await requireSession();
  return (
    <>
      <Link href="/cms/testimonials" className="inline-flex min-h-11 items-center text-sm font-bold text-[#a02f52]">← All testimonials</Link>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-[#171922]">New testimonial</h1>
      <div className="mt-6"><TestimonialForm /></div>
    </>
  );
}
