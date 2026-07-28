export const MUSIC_CONSENT_STORAGE_KEY = "eliteOneSpaMusicConsent";

export type MusicConsentChoice = "accepted" | "declined";

export function getMusicConsentChoice(): MusicConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(MUSIC_CONSENT_STORAGE_KEY);
    return raw === "accepted" || raw === "declined" ? raw : null;
  } catch {
    return null;
  }
}

export function setMusicConsentChoice(choice: MusicConsentChoice) {
  try {
    window.sessionStorage.setItem(MUSIC_CONSENT_STORAGE_KEY, choice);
  } catch {
    // sessionStorage indisponible (navigation privée) — le choix ne persistera pas pour cette session.
  }
}
