"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-700"
      style={{
        backgroundColor: scrolled ? "rgba(10,9,11,0.55)" : "transparent",
        backdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(244,239,232,0.1)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 8px 32px rgba(5,4,5,0.28)" : "none",
      }}
    >
      <nav className="container flex items-center justify-between px-6 py-4 sm:py-5">
        <a
          href="#accueil"
          aria-label={t.nav.logoAria}
          className="relative flex h-[49px] w-[168px] shrink-0 items-center"
        >
          <Image
            src="/logo/Logo-Elite-One-Spa.webp"
            alt="Elite One Spa"
            fill
            sizes="168px"
            preload
            className="object-contain object-left"
          />
        </a>

        <ul className="hidden items-center gap-10 sm:flex">
          {t.nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[0.68rem] font-medium uppercase tracking-[0.22em] no-underline transition-colors duration-500 hover:text-[var(--color-champagne)]"
                style={{ backgroundImage: "none", color: "rgba(244,239,232,0.9)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5 sm:gap-6">
          <LanguageSwitcher />
          <a href="#reservation" className="btn btn-secondary !px-6 !py-2.5 text-[0.68rem]">
            {t.nav.reserve}
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
