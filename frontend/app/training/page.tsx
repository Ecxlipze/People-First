import type { Metadata } from "next";
import ContactPageBody from "@/app/contact/ContactPageBody";

export const metadata: Metadata = {
  title: "Join a Training Program",
  description: "Sign up for skills and business training from People First.",
  robots: {
    index: false,
  },
  alternates: {
    canonical: "/training",
  },
};

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
