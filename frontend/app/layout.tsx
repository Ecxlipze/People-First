import type { Metadata } from "next";
import { Inter, Montserrat, Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ContactModalProvider } from "./contact/ContactModal";
import { getBaseUrl } from "@/app/lib/seo";

/* ---- The site's font setup ----
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
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    template: "%s | People First",
    default: "People First",
  },
  description: "People First — putting people first.",
  applicationName: "People First",
  openGraph: {
    title: "People First",
    description: "People First — putting people first.",
    siteName: "People First",
    locale: "en_US",
    type: "website",
    // TODO: A dedicated Open Graph image is required.
    // Uncomment this line once /public/images/og/people-first-og.png is added.
    // images: [{ url: '/images/og/people-first-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "People First",
    description: "People First — putting people first.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${poppins.variable} ${cormorant.variable} h-full antialiased`}
    >
      {/* ContactModalProvider mounts the site-wide "Get in Touch" overlay and
          lets any CTA open it via useContactModal()/<ContactTrigger>. */}
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "People First",
                  url: getBaseUrl(),
                },
                {
                  "@type": "Organization",
                  name: "People First",
                  url: getBaseUrl(),
                  logo: `${getBaseUrl()}/icon.svg`,
                },
              ],
            }),
          }}
        />
        <ContactModalProvider>{children}</ContactModalProvider>
      </body>
    </html>
  );
}
