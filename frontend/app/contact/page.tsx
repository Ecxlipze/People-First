import type { Metadata } from "next";
import ContactPageBody from "./ContactPageBody";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact People First about partnerships, training, ventures, and growth opportunities.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactPageBody />;
}
