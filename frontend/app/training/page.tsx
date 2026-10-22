import { createPageMetadata } from "@/app/lib/seo";
import type { Metadata } from "next";
import ContactPageBody from "@/app/contact/ContactPageBody";

export const metadata: Metadata = createPageMetadata({
  title: "Join a Skills Training Program",
  description: "Inquire about People First skills training in freelancing, e-commerce, social media, AI tools, and business communication.",
  path: "/training",
  noIndex: true,
});

export default function TrainingPage() {
  return (
    <ContactPageBody
      eyebrow="Join Training Program"
      defaultRole="Student"
      inquiryType="join_training"
      pageTitle="Join a People First Training Program"
      pageDescription="Ready to level up your skills? Sign up for our industry-guided training programs designed to empower the next generation of builders, thinkers, and digital leaders."
    />
  );
}
