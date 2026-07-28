import { Cormorant_Garamond, Inter } from "next/font/google";
import IntroFlow from "./components/IntroFlow";
import AudioPlayer from "./components/audio/AudioPlayer";
import LanguageFadeWrapper from "./components/LanguageFadeWrapper";
import { LanguageProvider } from "./lib/language/LanguageContext";
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
        <LanguageProvider>
          <IntroFlow />
          <AudioPlayer />
          <LanguageFadeWrapper>{children}</LanguageFadeWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
