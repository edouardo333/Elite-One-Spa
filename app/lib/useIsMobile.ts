"use client";

import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 768px)";

/**
 * Mirrors the viewport breakpoint used across the site to gate expensive,
 * continuous effects (blurred parallax halos, infinite framer-motion loops)
 * on mobile Safari, where many concurrently-animated `filter`/`backdrop-filter`
 * layers are a common cause of jank and tab crashes. Starts `false` (matches
 * SSR) and resolves post-mount, same hydration-safe pattern used elsewhere
 * in this codebase.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
}
