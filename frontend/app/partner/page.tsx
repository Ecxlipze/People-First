import { createPageMetadata } from "@/app/lib/seo";
import type { Metadata } from "next";
import ContactPageBody from "@/app/contact/ContactPageBody";

export const metadata: Metadata = createPageMetadata({
  title: "Partner with Us",
  description: "Connect with People First about partnership opportunities. Tell us about your organisation and how we can learn, collaborate, and build together.",
  path: "/partner",
  noIndex: true,
});

export default function PartnerPage() {
  return (
    <ContactPageBody
      eyebrow="Partner with Us"
      defaultRole="Training Partner"
      inquiryType="partner_with_us"
      pageTitle="Partner with People First"
      pageDescription="Join forces with People First. Tell us about your organisation and how we can co-create high-impact training, community programs, and innovative ventures."
    />
  );
}
