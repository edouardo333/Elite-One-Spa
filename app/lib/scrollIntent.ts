const SCROLL_INTENT_STORAGE_KEY = "eliteOneSpaScrollIntent";

/**
 * Cross-navigation scroll target, e.g. set by the Business Card's Book Now
 * button before a hard navigation to "/" so the homepage knows where to
 * land once it has mounted — deliberately not a URL hash, so there is no
 * native hash-scroll to fight the homepage's own controlled scroll.
 */
export function setScrollIntent(sectionId: string) {
  try {
    window.sessionStorage.setItem(SCROLL_INTENT_STORAGE_KEY, sectionId);
  } catch {
    // sessionStorage unavailable (e.g. private browsing) — navigation still
    // succeeds, the homepage just lands at the top instead of auto-scrolling.
  }
}

export function getScrollIntent(): string | null {
  try {
    return window.sessionStorage.getItem(SCROLL_INTENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearScrollIntent() {
  try {
    window.sessionStorage.removeItem(SCROLL_INTENT_STORAGE_KEY);
  } catch {
    // sessionStorage unavailable — nothing to clear.
  }
}
