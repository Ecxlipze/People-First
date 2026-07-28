import type { Metadata } from "next";
import ContactPageBody from "@/app/contact/ContactPageBody";

export const metadata: Metadata = {
  title: "Join a Training Program — People First",
  description:
    "Join a People First training program. Tell us about yourself and we'll match you to a track.",
};

export default function TrainingPage() {
  return (
    <ContactPageBody eyebrow="Join Training Program" defaultRole="Student" />
  );
}
