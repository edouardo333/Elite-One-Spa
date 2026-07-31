"use client";

import { useEffect } from "react";
import { clearScrollIntent, getScrollIntent } from "@/app/lib/scrollIntent";
import { isBodyScrollLocked } from "@/app/lib/useBodyScrollLock";

// Mirrors Navbar's own scrollToId gap so an intent-driven landing lines up
// with a normal in-page nav click.
const SCROLL_SPACING = 16;
// Poll cadence — deliberately not requestAnimationFrame: browsers fully
// suspend rAF callbacks on a hidden/backgrounded tab, which could stall the
// scroll indefinitely. A short timeout still only fires the check; it never
// scrolls on its own, so this isn't "an approximate timeout alone".
const POLL_INTERVAL_MS = 50;
// Safety net only — the real gate is the element existing and the body
// being unlocked, checked on every poll below. This just stops polling
// forever if an intent is somehow never satisfiable.
const MAX_WAIT_MS = 8000;

/**
 * Consumes a cross-navigation scroll intent (see app/lib/scrollIntent.ts) —
 * set by the Business Card's Book Now button — once the homepage has
 * mounted, the target section exists, and no overlay (Age Gate, music
 * consent) has the body scroll-locked. Performs exactly one scroll and
 * clears the intent so it never fires again, including on back navigation.
 */
export default function ScrollIntentHandler() {
  useEffect(() => {
    const targetId = getScrollIntent();
    if (!targetId) return;

    let cancelled = false;
    let timeoutId = 0;
    const startedAt = Date.now();

    const attempt = () => {
      if (cancelled) return;

      const target = document.getElementById(targetId);
      if (target && !isBodyScrollLocked()) {
        const header = document.querySelector("header");
        const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
        const top =
          target.getBoundingClientRect().top + window.scrollY - headerHeight - SCROLL_SPACING;

        // Force an instant jump regardless of the global smooth-scroll CSS
        // (see useBodyScrollLock.ts) so this single scroll can't be caught
        // mid-animation by a later layout shift and land somewhere else.
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, Math.max(top, 0));
        root.style.scrollBehavior = previousScrollBehavior;

        clearScrollIntent();
        return;
      }

      if (Date.now() - startedAt > MAX_WAIT_MS) {
        clearScrollIntent();
        return;
      }

      timeoutId = window.setTimeout(attempt, POLL_INTERVAL_MS);
    };

    attempt();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
