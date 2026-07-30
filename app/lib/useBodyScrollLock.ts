"use client";

import { useEffect } from "react";

// Module-level reference count so overlapping locks (e.g. the Age Gate fading
// out while the music consent modal is already mounted underneath it) don't
// stomp on each other — the scroll stays locked until the last lock releases.
let lockCount = 0;
let previousOverflow: string | null = null;

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow ?? "";
        previousOverflow = null;
      }
    };
  }, [active]);
}
