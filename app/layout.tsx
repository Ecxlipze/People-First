import type { Metadata } from "next";
import { Inter, Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { ContactModalProvider } from "./contact/ContactModal";

/* ---- The site's two typefaces ----
   Loaded once here, in the root layout, and handed to the rest of the site as
   CSS variables (see globals.css, which maps them onto `body` and the heading
   selectors). Nothing else in the app should import from next/font: a second
   call for the same family ships a second copy of the font files.

   Inter and Montserrat are variable fonts, so no `weight` array is passed — the
   full 100–900 range comes down in one file and every weight the design uses
   (Inter 400/500/600, Montserrat 600/700/800) is available without extra
   requests.

   Poppins is the exception and must enumerate its weights: Google serves it only
   as static instances, so `weight` is required. Just the one weight is listed —
   it is used in exactly one place (the landing page's radial nav labels, see
   RadialNav.tsx), and each extra entry is another font file over the wire. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300"],
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
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${poppins.variable} h-full antialiased`}
    >
      {/* ContactModalProvider mounts the site-wide "Get in Touch" overlay and
          lets any CTA open it via useContactModal()/<ContactTrigger>. */}
      <body className="min-h-full flex flex-col">
        <ContactModalProvider>{children}</ContactModalProvider>
      </body>
    </html>
  );
}
