import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ContactModalProvider } from "./contact/ContactModal";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "People First",
  description: "People First — putting people first.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      {/* ContactModalProvider mounts the site-wide "Get in Touch" overlay and
          lets any CTA open it via useContactModal()/<ContactTrigger>. */}
      <body className="min-h-full flex flex-col">
        <ContactModalProvider>{children}</ContactModalProvider>
      </body>
    </html>
  );
}
