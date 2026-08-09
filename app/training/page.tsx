import type { Metadata } from "next";
import ContactPageBody from "@/app/contact/ContactPageBody";

export const metadata: Metadata = {
  title: "Join a Training Program",
  description: "Sign up for skills and business training from People First.",
  robots: {
    index: false,
  },
};

export default function TrainingPage() {
  return (
    <ContactPageBody eyebrow="Join Training Program" defaultRole="Student" />
  );
}
