import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import LanguageFadeWrapper from "@/app/components/LanguageFadeWrapper";
import SkipLink from "@/app/components/SkipLink";
import { LanguageProvider } from "@/app/lib/language/LanguageContext";
import "../globals.css";

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

// Standalone root layout for the /business-card and /c routes: same fonts
// and bilingual language system as the main site, but without the age
// gate, music consent modal, audio player, or floating booking CTA that
// app/(site)/layout.tsx applies to the marketing homepage.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function CardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorantGaramond.variable} ${inter.variable} h-full antialiased bg-[var(--color-black)]`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <SkipLink />
          <LanguageFadeWrapper>{children}</LanguageFadeWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
