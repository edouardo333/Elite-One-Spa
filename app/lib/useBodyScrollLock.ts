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
// Read-only escape hatch for code outside the lock/unlock pair (e.g. the
// homepage's post-navigation scroll handler) that needs to know whether any
// overlay — Age Gate, music consent, mobile nav — currently has the body
// pinned, without itself taking part in the lock.
export function isBodyScrollLocked(): boolean {
  return lockCount > 0;
}

function applyLockStyles() {
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

function releaseLockStyles(restoreScroll: boolean) {
  document.body.style.position = previousPosition ?? "";
  document.body.style.top = previousTop ?? "";
  document.body.style.width = previousWidth ?? "";
  document.body.style.overflow = previousOverflow ?? "";
  previousPosition = null;
  previousTop = null;
  previousWidth = null;
  previousOverflow = null;

  if (!restoreScroll) return;

  // `html { scroll-behavior: smooth }` (globals.css) applies to this
  // restore too, since window.scrollTo(x, y) is shorthand for
  // behavior: "auto", which defers to the CSS property. Left alone,
  // the page would visibly animate from 0 (where the fixed-position
  // trick pins scrollTop while locked) up to savedScrollY — a
  // down/up flash — instead of landing instantly. Toggling the CSS
  // property to "auto" for just this call forces an instant jump.
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, savedScrollY);
  root.style.scrollBehavior = previousScrollBehavior;
}

/** Imperative counterpart to the hook below, for callers that need the lock
 * released synchronously within a click handler instead of waiting on a
 * React effect (see Navbar's mobile link navigation). */
export function lockBodyScroll() {
  if (lockCount === 0) applyLockStyles();
  lockCount += 1;
}

interface UnlockBodyScrollOptions {
  // Skip restoring the saved scroll position — used when the caller is
  // about to navigate to a specific section itself, so the lock's own
  // restore can't race with (and override) that destination scroll.
  skipRestore?: boolean;
}

export function unlockBodyScroll(options?: UnlockBodyScrollOptions) {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount === 0) releaseLockStyles(!options?.skipRestore);
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [active]);
}
