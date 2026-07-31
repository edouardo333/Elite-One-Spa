"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useBodyScrollLock } from "@/app/lib/useBodyScrollLock";
import { useIsMobile } from "@/app/lib/useIsMobile";
import LanguageSwitcher from "./LanguageSwitcher";

const SCROLL_OFFSET_GAP = 16;
const MENU_TRANSITION_SECONDS = 0.28;

function BurgerIcon({ open, prefersReducedMotion }: { open: boolean; prefersReducedMotion: boolean }) {
  const barStyle: CSSProperties = { backgroundColor: "var(--color-offwhite)" };
  const duration = prefersReducedMotion ? 0 : 0.3;
  return (
    <span className="relative flex h-4 w-5 flex-col items-center justify-center" aria-hidden="true">
      <motion.span
        className="absolute h-px w-5 rounded-full"
        style={barStyle}
        animate={{ y: open ? 0 : -6, rotate: open ? 45 : 0 }}
        transition={{ duration, ease: [0.19, 1, 0.22, 1] }}
      />
      <motion.span
        className="absolute h-px w-5 rounded-full"
        style={barStyle}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration, ease: [0.19, 1, 0.22, 1] }}
      />
      <motion.span
        className="absolute h-px w-5 rounded-full"
        style={barStyle}
        animate={{ y: open ? 0 : 6, rotate: open ? -45 : 0 }}
        transition={{ duration, ease: [0.19, 1, 0.22, 1] }}
      />
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#accueil");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();
  const prefersReducedMotion = !!useReducedMotion();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setScrolled(window.scrollY > 40);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy — highlights whichever section's top has scrolled past the
  // navbar, so the active link always matches what's currently in view.
  // Throttled to one measurement per animation frame: native scroll events can
  // fire far more often than the screen repaints, and each pass here does a
  // getBoundingClientRect() per nav link, so uncapped it does redundant layout
  // work and redundant setState calls for the same visual frame.
  useEffect(() => {
    const ids = t.nav.links.map((link) => link.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const updateActive = () => {
      const navHeight = headerRef.current?.offsetHeight ?? 0;
      const probe = navHeight + 32;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top - probe <= 0) {
          current = section;
        }
      }
      setActiveHref(`#${current.id}`);
    };

    let ticking = false;
    const scheduleUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updateActive();
      });
    };

    updateActive();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [t.nav.links]);

  // Lock body scroll while the mobile menu is open
  useBodyScrollLock(mobileOpen);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !mobileOpen) return;
      setMobileOpen(false);
      // Closing the panel unmounts whatever link/button inside it currently
      // has focus, which would otherwise drop focus back to <body>.
      menuToggleRef.current?.focus();
    }
    function onResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  const scrollToId = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return false;
    const navHeight = headerRef.current?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - SCROLL_OFFSET_GAP;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  }, []);

  const handleAnchorClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      event.preventDefault();
      const id = href.slice(1);

      // When the mobile panel is open, useBodyScrollLock has pinned <body>
      // with `position: fixed`, so window.scrollTo() is a no-op right now —
      // worse, the lock's own cleanup (fired by the setMobileOpen(false)
      // below) restores the pre-open scroll position a moment later,
      // silently cancelling any scroll issued before that happens. Closing
      // the menu first and deferring the scroll two frames (mount effects
      // run after paint) lets the unlock finish before we move the page.
      if (mobileOpen) {
        setMobileOpen(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToId(id);
          });
        });
        return;
      }

      scrollToId(id);
    },
    [scrollToId, mobileOpen]
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
      style={{
        // The header repaints its backdrop-filter on every compositor frame
        // for whatever scrolls underneath it — it's fixed and always on
        // screen, so this runs for the entire length of every scroll. Radius
        // is cut down on mobile for the same reason as the glass cards
        // further down the page (see globals.css).
        backgroundColor: scrolled ? (isMobile ? "rgba(10,9,11,0.78)" : "rgba(10,9,11,0.6)") : "transparent",
        backdropFilter: scrolled ? (isMobile ? "blur(8px)" : "blur(20px) saturate(140%)") : "none",
        WebkitBackdropFilter: scrolled ? (isMobile ? "blur(8px)" : "blur(20px) saturate(140%)") : "none",
        borderBottom: scrolled
          ? "1px solid rgba(244,239,232,0.08)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 8px 32px rgba(5,4,5,0.28)" : "none",
      }}
    >
      <nav
        ref={headerRef}
        className="container flex items-center justify-between gap-4 px-6 py-4 sm:py-5"
      >
        <a
          href="#accueil"
          onClick={(e) => handleAnchorClick(e, "#accueil")}
          aria-label={t.nav.logoAria}
          className="group relative flex h-[59px] w-[202px] shrink-0 items-center"
          style={{ backgroundImage: "none" }}
        >
          <Image
            src="/logo/Logo-Elite-One-Spa.webp"
            alt="Elite One Spa"
            fill
            sizes="202px"
            priority
            className="origin-left object-contain object-left transition-[transform,filter] duration-[350ms] ease-out [filter:drop-shadow(0_0_0_rgba(232,120,150,0))_brightness(1)] group-hover:scale-[1.06] group-hover:[filter:drop-shadow(0_0_14px_rgba(232,120,150,0.5))_drop-shadow(0_0_26px_rgba(120,35,65,0.35))_brightness(1.08)]"
          />
        </a>

        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {t.nav.links.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  aria-current={isActive ? "true" : undefined}
                  data-active={isActive || undefined}
                  className="nav-link relative inline-block whitespace-nowrap py-1 text-[0.64rem] font-medium uppercase tracking-[0.16em] no-underline xl:text-[0.68rem] xl:tracking-[0.2em]"
                  style={{ backgroundImage: "none" }}
                >
                  {link.label}
                  <span aria-hidden="true" className="nav-link__line absolute inset-x-0 -bottom-1 h-px origin-center" />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 sm:gap-5">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <div className="hidden lg:block">
            <a
              href="tel:+15145438344"
              className="btn btn-secondary !px-6 !py-2.5 text-[0.66rem] xl:text-[0.68rem]"
            >
              {t.nav.reserve}
            </a>
          </div>

          <button
            ref={menuToggleRef}
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? t.nav.menuCloseAria : t.nav.menuOpenAria}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 lg:hidden"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "rgba(244,239,232,0.04)",
            }}
          >
            <BurgerIcon open={mobileOpen} prefersReducedMotion={prefersReducedMotion} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown panel — one transform+opacity transition only (no
          animated height/backdrop-filter, no per-link stagger): those were
          multiple simultaneous animations plus a forced layout reflow on
          every open/close, which is what made the menu feel heavy on
          mobile. The panel's full height is present from first paint; only
          its opacity/position animate, so there's nothing for the browser
          to reflow frame-by-frame. Links render immediately and stay
          clickable throughout — no entrance delay gating interactivity. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0 : MENU_TRANSITION_SECONDS, ease: [0.16, 1, 0.3, 1] }}
            className="origin-top border-t lg:hidden"
            style={{
              borderColor: "rgba(244,239,232,0.1)",
              backgroundColor: "rgba(10,9,11,0.97)",
            }}
          >
            <ul className="container flex flex-col gap-1 py-4">
              {t.nav.links.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      aria-current={isActive ? "true" : undefined}
                      className="flex items-center justify-between gap-4 border-b py-4 text-sm font-medium uppercase tracking-[0.14em] no-underline transition-colors duration-400"
                      style={{
                        backgroundImage: "none",
                        borderColor: "rgba(244,239,232,0.08)",
                        color: isActive ? "var(--color-champagne)" : "var(--color-offwhite)",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="container flex items-center justify-between gap-6 pb-8 pt-2">
              <LanguageSwitcher className="text-[0.72rem]" />
              <a
                href="tel:+15145438344"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary !px-6 !py-2.5 text-[0.68rem]"
              >
                {t.nav.reserve}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
