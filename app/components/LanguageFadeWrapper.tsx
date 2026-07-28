"use client";

import { LANGUAGE_TRANSITION_MS, useLanguage } from "@/app/lib/language/LanguageContext";

export default function LanguageFadeWrapper({ children }: { children: React.ReactNode }) {
  const { isTransitioning } = useLanguage();

  return (
    <div
      className="flex min-h-full flex-1 flex-col"
      style={{
        opacity: isTransitioning ? 0 : 1,
        transition: `opacity ${LANGUAGE_TRANSITION_MS}ms ease`,
      }}
    >
      {children}
    </div>
  );
}
