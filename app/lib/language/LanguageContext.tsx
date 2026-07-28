"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LOCALES, TRANSLATIONS, type Locale, type Translations } from "./translations";

const LOCALE_STORAGE_KEY = "eliteOneSpaLocale";
export const LANGUAGE_TRANSITION_MS = 220;

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  isTransitioning: boolean;
  setLocale: (next: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as readonly string[]).includes(value);
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Lecture ponctuelle de localStorage au montage — même schéma que
    // hasValidAgeVerification (évite un mismatch d'hydratation SSR/CSR).
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture ponctuelle post-montage, cf. commentaire ci-dessus.
        setLocaleState(stored);
      }
    } catch {
      // localStorage indisponible (navigation privée) — le français par défaut reste actif.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;

      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      } catch {
        // localStorage indisponible (navigation privée) — le choix ne persistera pas.
      }

      if (prefersReducedMotion()) {
        setLocaleState(next);
        return;
      }

      // Fondu enchaîné : on masque le contenu, on bascule la langue une fois
      // invisible, puis on réaffiche — pour un changement de langue en douceur.
      setIsTransitioning(true);
      window.setTimeout(() => {
        setLocaleState(next);
        window.setTimeout(() => setIsTransitioning(false), LANGUAGE_TRANSITION_MS);
      }, LANGUAGE_TRANSITION_MS);
    },
    [locale]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, t: TRANSLATIONS[locale], isTransitioning, setLocale }),
    [locale, isTransitioning, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      <title>{TRANSLATIONS[locale].seo.title}</title>
      <meta name="description" content={TRANSLATIONS[locale].seo.description} />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
