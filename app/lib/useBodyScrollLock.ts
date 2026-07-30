"use client";

import { useEffect } from "react";

// Module-level reference count so overlapping locks (e.g. the Age Gate fading
// out while the music consent modal is already mounted underneath it) don't
// stomp on each other — the scroll stays locked until the last lock releases.
let lockCount = 0;
let savedScrollY = 0;
let previousPosition: string | null = null;
let previousTop: string | null = null;
let previousWidth: string | null = null;
let previousOverflow: string | null = null;

// iOS Safari keeps scrolling the page behind a `overflow: hidden` body (touch
// scrolling ignores it, and momentum scrolling in particular can carry on
// once the gesture starts) — the standard workaround is to additionally pin
// the body in place with `position: fixed` at its current scroll offset,
// then restore the real scroll position on unlock. Without this, closing a
// modal on iOS can leave the page scrolled to the top or the view visually
// "stuck" even though overflow is no longer hidden.
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      savedScrollY = window.scrollY;
      previousPosition = document.body.style.position;
      previousTop = document.body.style.top;
      previousWidth = document.body.style.width;
      previousOverflow = document.body.style.overflow;

      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.position = previousPosition ?? "";
        document.body.style.top = previousTop ?? "";
        document.body.style.width = previousWidth ?? "";
        document.body.style.overflow = previousOverflow ?? "";
        previousPosition = null;
        previousTop = null;
        previousWidth = null;
        previousOverflow = null;
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [active]);
}
