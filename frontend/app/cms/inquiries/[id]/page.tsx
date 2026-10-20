import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ApiError } from "@/app/lib/api";
import { cmsFetch, requireSession } from "@/app/cms/session";
import { deleteInquiryAction } from "@/app/cms/actions";
import ConfirmDelete from "@/app/cms/ConfirmDelete";
import InquiryForm from "@/app/cms/inquiries/InquiryForm";
import type { CmsInquiry } from "@/app/cms/types";

const act =
  "pf-interactive inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 font-display text-sm font-bold text-zinc-700 hover:bg-zinc-50";

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireSession();
  if (!/^\d+$/.test(id)) notFound();
  const ctx = { render: `/cms/inquiries/${id}` };

  let inquiry = await cmsFetch<CmsInquiry>(`/api/inquiries/${id}/`, {}, ctx).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
  if (!inquiry) notFound();

  /* Opening a new message marks it read. */
  if (inquiry.status === "new") {
    inquiry = await cmsFetch<CmsInquiry>(`/api/inquiries/${id}/`, { method: "PATCH", json: { status: "read" } }, ctx);
  }

  const digits = inquiry.phone.replace(/\D/g, "");
  const subject = encodeURIComponent("Re: your enquiry to People First");

  return (
    <>
      <Link href="/cms/inquiries" className="inline-flex min-h-11 items-center text-sm font-bold text-[#a02f52]">← All inquiries</Link>
      <div className="mt-2 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wider">
            <span className="text-[#a02f52]">{inquiry.inquiry_type_label}</span>
            <span className="text-zinc-500">{inquiry.person_type_label}</span>
          </div>
          <h1 className="mt-2 break-words font-display text-3xl font-extrabold text-[#171922]">{inquiry.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Received {new Date(inquiry.created_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" })} UTC
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <a href={`mailto:${inquiry.email}?subject=${subject}`} className={act}><Mail className="h-4 w-4" aria-hidden /> Reply by email</a>
            {inquiry.phone && <a href={`tel:${inquiry.phone}`} className={act}><Phone className="h-4 w-4" aria-hidden /> Call</a>}
            {digits.length >= 7 && (
              <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className={act}><MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp</a>
            )}
          </div>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="font-bold text-zinc-500">Email</dt><dd className="mt-0.5 break-all text-zinc-900">{inquiry.email}</dd></div>
            <div><dt className="font-bold text-zinc-500">Phone</dt><dd className="mt-0.5 text-zinc-900">{inquiry.phone || "—"}</dd></div>
          </dl>

          <h2 className="mt-6 text-sm font-bold text-zinc-500">Message</h2>
          <p className="mt-1.5 whitespace-pre-wrap break-words text-base leading-relaxed text-zinc-900">{inquiry.message}</p>
        </section>

        <aside className="space-y-6 lg:self-start">
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <InquiryForm key={inquiry.id} inquiry={inquiry} />
          </section>
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-display text-lg font-extrabold text-[#171922]">Delete</h2>
            <p className="mt-1 text-sm text-zinc-600">Removes this message permanently. Archive it instead if you may need it later.</p>
            <div className="mt-3"><ConfirmDelete action={deleteInquiryAction} slug={String(inquiry.id)} title={`the message from ${inquiry.name}`} fieldName="id" /></div>
          </section>
        </aside>
      </div>
    </>
  );
}
