import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import IntroFlow from "./components/IntroFlow";
import AudioPlayer from "./components/audio/AudioPlayer";
import FloatingBookButton from "./components/FloatingBookButton";
import LanguageFadeWrapper from "./components/LanguageFadeWrapper";
import SkipLink from "./components/SkipLink";
import { LanguageProvider } from "./lib/language/LanguageContext";
import { TRANSLATIONS } from "./lib/language/translations";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://eliteonespa.ca";
const { title: seoTitle, description: seoDescription } = TRANSLATIONS.fr.seo;

// The <title> and <meta name="description"> tags themselves are rendered
// dynamically per-locale by LanguageProvider (React 19 head hoisting), so
// they are intentionally left out here to avoid emitting duplicate tags —
// this export only covers the metadata that has no client-side equivalent.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: SITE_URL,
    siteName: "Elite One Spa",
    locale: "fr_CA",
    alternateLocale: "en_CA",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: seoTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: ["/opengraph-image"],
  },
};

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: "Elite One Spa",
  image: `${SITE_URL}/logo/Logo-Elite-One-Spa.webp`,
  url: SITE_URL,
  telephone: "+1-514-543-8344",
  email: "info@eliteonespa.ca",
  priceRange: "$40–$120",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1621 boul. Saint-Laurent",
    addressLocality: "Montréal",
    addressRegion: "QC",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.511256,
    longitude: -73.566292,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorantGaramond.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
        />
        <LanguageProvider>
          <SkipLink />
          <IntroFlow />
          <LanguageFadeWrapper>{children}</LanguageFadeWrapper>
          <AudioPlayer />
          <FloatingBookButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
