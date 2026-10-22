import type { Metadata } from "next";
import { Inter, Montserrat, Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ContactModalProvider } from "./contact/ContactModal";
import { absoluteSiteUrl, createPageMetadata, getBaseUrl, serializeJsonLd } from "@/app/lib/seo";

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
  // Only radial-nav labels use this face; other routes should not preload it.
  preload: false,
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  // The footer's italic CTA can request its face without preloading both styles
  // on every route, including the standalone radial landing page.
  preload: false,
});

const siteMetadata = createPageMetadata({
  title: "Ventures, Partnerships & Growth",
  description: "Discover People First: an ecosystem connecting people with ventures, partnerships, mentorship, training, and opportunities to learn, grow, and lead.",
  path: "/",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    template: "%s | People First",
    default: "People First",
  },
  description: siteMetadata.description,
  openGraph: siteMetadata.openGraph,
  twitter: siteMetadata.twitter,
  applicationName: "People First",
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
            __html: serializeJsonLd({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": absoluteSiteUrl("/#website"),
                  name: "People First",
                  url: getBaseUrl(),
                  publisher: { "@id": absoluteSiteUrl("/#organization") },
                },
                {
                  "@type": "Organization",
                  "@id": absoluteSiteUrl("/#organization"),
                  name: "People First",
                  url: getBaseUrl(),
                  logo: {
                    "@type": "ImageObject",
                    "@id": absoluteSiteUrl("/#logo"),
                    url: absoluteSiteUrl("/images/logo.png"),
                  },
                  founder: {
                    "@type": "Person",
                    name: "Rai Salahuddin Ahmad",
                  },
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
