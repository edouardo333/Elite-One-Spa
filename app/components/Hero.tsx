"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/lib/language/LanguageContext";
import { useIsMobile } from "@/app/lib/useIsMobile";

const SLIDE_SOURCES = [
  "/hero/desktop-01.webp",
  "/hero/desktop-02.webp",
  "/hero/desktop-03.webp",
  "/hero/desktop-04.webp",
];
const MOBILE_SLIDE_SOURCES = [
  "/hero/mobile-01.webp",
  "/hero/mobile-02.webp",
  "/hero/mobile-03.webp",
  "/hero/mobile-04.webp",
];

const DISPLAY_SECONDS = 8;
const FADE_SECONDS = 1.8;
const CYCLE_SECONDS = DISPLAY_SECONDS + FADE_SECONDS;

const PARTICLE_COUNT = 16;

// Integer-only PRNG (mulberry32): bit-identical across every JS engine, unlike
// Math.sin-based approaches whose least-significant bits can drift between the
// server (Node) and client (browser) runtimes and trip a hydration mismatch.
function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

function generateParticles() {
  const rand = mulberry32(1337);
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: round(4 + rand() * 92),
    size: round(2 + rand() * 3),
    duration: round(12 + rand() * 10),
    delay: round(rand() * 10),
    drift: round(rand() * 40 - 20),
  }));
}

const PARTICLES = generateParticles();

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const { t } = useLanguage();

 const currentSources = isMobile
  ? MOBILE_SLIDE_SOURCES
  : SLIDE_SOURCES;
const mobilePositions = [
  "50% 50%",
  "50% 45%",
  "50% 50%",
  "50% 45%",
];
const slides = currentSources.map((src, i) => ({
  src,
  alt: t.hero.slideAlts[i],
}));
useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, CYCLE_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, slides.length]);

  return (
    <section
      id="accueil"
      className="relative isolate flex min-h-[max(560px,100dvh)] w-full items-center justify-center overflow-hidden bg-[var(--color-black)] xl:h-[100dvh] xl:min-h-[560px]"
    >
      {/* Crossfading Ken Burns background */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, i) => {
          const isActive = i === activeIndex;
          return (
            <motion.div
              key={slide.src}
              className="absolute inset-0"
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : FADE_SECONDS,
                ease: [0.45, 0, 0.2, 1],
              }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ scale: isActive ? 1.08 : 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : CYCLE_SECONDS,
                  ease: "linear",
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  quality={90}
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  style={{
  objectPosition: isMobile
    ? mobilePositions[i]
    : "50% 50%",
}}
                  className={`object-cover ${
isMobile ? "object-center" : "object-center"
}`}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Cinematic multi-layer overlay */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Layer 1 — black gradient for legibility */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(5,4,5,0.58) 0%, rgba(5,4,5,0.34) 32%, rgba(5,4,5,0.6) 78%, rgba(5,4,5,0.93) 100%)",
          }}
        />
        {/* Layer 2 — subtle rose/violet colour wash */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 80% 60% at 50% 8%, rgba(74,22,38,0.34), transparent 60%)",
              "radial-gradient(ellipse 70% 55% at 84% 100%, rgba(42,20,32,0.46), transparent 62%)",
              "radial-gradient(ellipse 60% 50% at 10% 92%, rgba(74,22,38,0.3), transparent 60%)",
            ].join(", "),
          }}
        />
        {/* Layer 3 — elegant vignette */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 78% 72% at 50% 46%, transparent 40%, rgba(5,4,5,0.52) 100%)",
          }}
        />
        {/* Layer 4 — cinematic bloom. Static on mobile: one fewer perpetual
            compositor animation running behind the whole hero at all times. */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 46% 38% at 50% 18%, rgba(242,221,195,0.16), transparent 68%)",
            mixBlendMode: "screen",
          }}
          animate={
            prefersReducedMotion || isMobile ? undefined : { opacity: [0.5, 0.85, 0.5] }
          }
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Ambiance — fog, lens flare, dust. Skipped on mobile: a dozen+
          concurrently-animating blurred/screen-blended layers is one of the
          heaviest compositing patterns for mobile Safari's GPU process and a
          common trigger for tab crashes during scroll. */}
      {!prefersReducedMotion && !isMobile && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {/* Drifting fog banks */}
          <motion.div
            className="absolute -bottom-1/4 left-[-10%] h-[55%] w-[70%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(244,239,232,0.05) 0%, transparent 70%)",
              filter: "blur(40px)",
              mixBlendMode: "screen",
            }}
            animate={{ x: [0, 60, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-1/3 right-[-15%] h-[60%] w-[75%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(232,201,171,0.05) 0%, transparent 70%)",
              filter: "blur(48px)",
              mixBlendMode: "screen",
            }}
            animate={{ x: [0, -50, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />

          {/* Extremely subtle lens flare */}
          <motion.div
            className="absolute left-[68%] top-[16%] h-[3px] w-[3px] rounded-full"
            style={{
              boxShadow: "0 0 60px 30px rgba(244,239,232,0.12)",
              mixBlendMode: "screen",
            }}
            animate={{ opacity: [0.2, 0.55, 0.2], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating dust particles */}
          {PARTICLES.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.left}%`,
                bottom: "-4%",
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background:
                  "radial-gradient(circle, rgba(232,201,171,0.75) 0%, rgba(232,201,171,0) 70%)",
              }}
              animate={{
                y: ["0%", "-115vh"],
                x: [0, particle.drift],
                opacity: [0, 0.5, 0.5, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="container relative z-20 flex flex-col items-center px-6 pt-20 pb-32 text-center sm:pt-28 sm:pb-36 xl:py-40">
        {/* Central legibility overlay — deepens only behind the content block */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 62% 58% at 50% 42%, rgba(5,4,5,0.4), transparent 72%)",
          }}
        />

        {/* Logo — premium centrepiece, breathing gently, glowing rose */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mb-12 flex items-center justify-center"
        >
          {/* Ambient rose glow — slow breathing. Animating scale on a
              blur()'d element forces the browser to re-rasterize the blur
              every frame, so this stays static on mobile. */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 340,
              height: 340,
              background:
                "radial-gradient(circle, rgba(232,120,150,0.4) 0%, rgba(232,201,171,0.25) 38%, rgba(74,22,38,0.18) 60%, transparent 74%)",
              filter: "blur(30px)",
            }}
            animate={
              prefersReducedMotion || isMobile
                ? undefined
                : { opacity: [0.6, 0.95, 0.6], scale: [0.95, 1.05, 0.95] }
            }
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Hover-intensified glow */}
          <div
            className="absolute rounded-full opacity-0 blur-[36px] transition-opacity duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100"
            style={{
              width: 380,
              height: 380,
              background:
                "radial-gradient(circle, rgba(232,120,150,0.56) 0%, rgba(232,201,171,0.32) 42%, transparent 74%)",
            }}
          />

          {/* Hover scale + rotate wrapper */}
          <div className="relative transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08] group-hover:rotate-1">
            {/* Slow breathing wrapper */}
            <motion.div
              className="relative aspect-[3/2] w-[213px] sm:w-[251px] md:w-[283px]"
              animate={
                prefersReducedMotion || isMobile
                  ? undefined
                  : { scale: [1, 1.025, 1] }
              }
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/logo/Logo-Elite-One-Spa.webp"
                alt="Elite One Spa"
                fill
                sizes="283px"
                priority
                className="object-contain"
                style={{
                  filter: "drop-shadow(0 10px 32px rgba(5,4,5,0.5))",
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        <div className="-translate-y-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow mb-8"
          >
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl text-balance leading-[1.28]"
            style={{ letterSpacing: "0.015em" }}
          >
            {t.hero.titleLine1}
            <br />
            {t.hero.titleLine2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-9 max-w-xl text-balance text-sm sm:text-base"
            style={{ letterSpacing: "0.01em" }}
          >
            {t.hero.paragraph}
          </motion.p>
        </div>

        <div className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          <motion.a
            href="tel:+15145438344"
            className="btn btn-primary min-w-[230px]"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.9, delay: 0.6, ease: [0.19, 1, 0.22, 1] },
            }}
            whileHover={{
              scale: 1.02,
              y: -2,
              transition: { type: "spring", stiffness: 400, damping: 20 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            {t.hero.ctaPrimary}
          </motion.a>
          <motion.a
            href="#soins"
            className="btn btn-secondary min-w-[230px]"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.9, delay: 0.74, ease: [0.19, 1, 0.22, 1] },
            }}
            whileHover={{
              scale: 1.02,
              y: -2,
              transition: { type: "spring", stiffness: 400, damping: 20 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            {t.hero.ctaSecondary}
          </motion.a>
        </div>
      </div>

      {/* Scroll indicator — fine line, descending point of light */}
      <motion.a
        href="#soins"
        aria-label={t.hero.scrollAria}
        className="group absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.3 }}
      >
        <span className="text-[0.62rem] font-medium uppercase tracking-[0.34em] text-[var(--color-text-muted)] transition-colors duration-500 group-hover:text-[var(--color-champagne)]">
          {t.hero.scrollLabel}
        </span>
        <span
          className="relative h-11 w-px overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, transparent, rgba(244,239,232,0.3) 20%, rgba(244,239,232,0.3) 80%, transparent)",
          }}
        >
          <motion.span
            className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
            style={{
              background: "var(--color-champagne)",
              boxShadow: "0 0 6px rgba(232,201,171,0.8)",
            }}
            animate={
              prefersReducedMotion || isMobile
                ? undefined
                : { y: [0, 34, 0], opacity: [0, 1, 1, 0] }
            }
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
