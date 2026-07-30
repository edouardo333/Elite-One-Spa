"use client";

import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useLanguage } from "@/app/lib/language/LanguageContext";

// Placeholder proving the (card) route group is wired into the same
// bilingual language system as the main site. Replace with the actual
// business card UI later.
export default function BusinessCardPlaceholder() {
  const { locale } = useLanguage();

  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center"
      style={{ color: "var(--color-text-primary)" }}
    >
      <LanguageSwitcher />
      <p
        className="text-sm uppercase tracking-[0.22em]"
        style={{ color: "var(--color-text-muted)" }}
      >
        {locale === "fr" ? "Carte de visite — à venir" : "Business card — coming soon"}
      </p>
    </main>
  );
}
