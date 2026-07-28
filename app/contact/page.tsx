import type { Metadata } from "next";
import ContactPageBody from "./ContactPageBody";

export const metadata: Metadata = {
  title: "Contact — People First",
  description:
    "Share your thoughts and we will help you make it real. Get in touch with the People First team.",
};

export default function ContactPage() {
  return <ContactPageBody />;
}
