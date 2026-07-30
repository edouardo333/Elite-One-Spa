"use client";

import { useLanguage } from "@/app/lib/language/LanguageContext";

export default function SkipLink() {
  const { t } = useLanguage();

  return (
    <a href="#main-content" className="skip-link">
      {t.nav.skipToContent}
    </a>
  );
}
