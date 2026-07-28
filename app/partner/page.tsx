import type { Metadata } from "next";
import ContactPageBody from "@/app/contact/ContactPageBody";

export const metadata: Metadata = {
  title: "Partner with Us — People First",
  description:
    "Partner with People First. Tell us about your organisation and how we can build together.",
};

export default function PartnerPage() {
  return (
    <ContactPageBody eyebrow="Partner with Us" defaultRole="Training Partner" />
  );
}
