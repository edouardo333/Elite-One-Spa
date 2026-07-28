"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import type { Locale } from "@/app/lib/language/translations";

interface LanguageSwitcherProps {
  className?: string;
  layoutId?: string;
}

export default function LanguageSwitcher({
  className = "text-[0.68rem]",
  layoutId = "language-switch-underline",
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();

  const renderOption = (loc: Locale, label: string, ariaLabel: string) => (
    <button
      type="button"
      onClick={() => setLocale(loc)}
      aria-pressed={locale === loc}
      aria-label={ariaLabel}
      className="relative pb-1 transition-colors duration-500"
      style={{
        color: locale === loc ? "var(--color-champagne)" : "rgba(244,239,232,0.55)",
      }}
    >
      {label}
      {locale === loc && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-x-0 -bottom-0.5 h-px"
          style={{ background: "var(--color-champagne)" }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        />
      )}
    </button>
  );

  return (
    <div
      role="group"
      aria-label={t.nav.languageLabel}
      className={`flex items-center gap-2 font-medium uppercase tracking-[0.22em] ${className}`}
    >
      {renderOption("fr", "FR", t.nav.switchToFr)}
      <span aria-hidden="true" style={{ color: "rgba(244,239,232,0.35)" }}>
        ·
      </span>
      {renderOption("en", "EN", t.nav.switchToEn)}
    </div>
  );
}
