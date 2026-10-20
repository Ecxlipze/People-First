import Link from "next/link";
import { requireSession } from "@/app/cms/session";
import VentureForm from "@/app/cms/ventures/VentureForm";

export default async function NewVenturePage() {
  await requireSession();
  return (
    <>
      <Link href="/cms/ventures" className="inline-flex min-h-11 items-center text-sm font-bold text-[#a02f52]">← All ventures</Link>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-[#171922]">New venture</h1>
      <div className="mt-6"><VentureForm /></div>
    </>
  );
}
