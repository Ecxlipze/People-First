import { createPageMetadata } from "@/app/lib/seo";
import type { Metadata } from "next";
import ContactPageBody from "./ContactPageBody";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us: Training, Ventures & Partnerships",
  description: "Get in touch with People First about training, partnerships, ventures, and growth opportunities. Share your inquiry with our team.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageBody />;
}
