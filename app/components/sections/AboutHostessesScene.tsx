"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import About from "./About";
import Hostesses from "./Hostesses";
import Services from "./Services";
import { useIsMobile } from "@/app/lib/useIsMobile";
import type { HostessRecord } from "@/app/data/hostesses";
import type { HostessCardText } from "@/sanity/lib/getHostesses";

/**
 * Shared cinematic backdrop for the About + Hostesses + Services sections. A
 * single continuous background paints behind all three — there is no
 * per-section background, so there is no seam for a boundary line to form on.
 */
export default function AboutHostessesScene({
  hostesses,
  hostessText,
}: {
  hostesses: HostessRecord[];
  hostessText: Record<string, HostessCardText>;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const sceneRef = useRef<HTMLDivElement>(null);
  // This backdrop spans three full sections and runs 7 concurrent Infinity
  // animations — by far the densest cluster of continuous motion on the page.
  // Gate it on viewport presence (generous margin, so nothing pops mid-scroll)
  // so it stops driving frames while the user is up at the Hero or down at
  // the Footer. Also disabled outright on mobile: this many concurrently
  // animated blurred/screen-blended layers is a common trigger for mobile
  // Safari GPU-process crashes during scroll.
  const isInView = useInView(sceneRef, { margin: "400px 0px 400px 0px" });
  const animateBackdrop = !prefersReducedMotion && !isMobile && isInView;

  return (
    <div ref={sceneRef} className="relative overflow-hidden bg-[var(--color-black)]">
      {/* Fond de base — un seul dégradé continu du haut d'About jusqu'au bas de Hostesses */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 90% 32% at 50% 0%, rgba(74,22,38,0.4), transparent 75%)",
            "radial-gradient(ellipse 70% 26% at 84% 5%, rgba(42,20,32,0.32), transparent 68%)",
            "radial-gradient(ellipse 80% 30% at 20% 100%, rgba(42,20,32,0.3), transparent 68%)",
            "linear-gradient(180deg, var(--color-black) 0%, rgba(20,11,16,0.92) 10%, rgba(32,15,22,0.86) 20%, rgba(38,17,25,0.8) 26%, rgba(30,14,21,0.88) 34%, rgba(20,11,16,0.94) 55%, rgba(20,11,16,0.94) 92%, var(--color-black) 100%)",
          ].join(", "),
        }}
      />

      {/* Voile de continuité — fondu très léger reprenant la tombée du Hero en tête de scène */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-56 sm:h-80"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(5,4,5,0.55) 0%, rgba(5,4,5,0.2) 55%, transparent 100%)",
        }}
      />

      {/* Effets décoratifs — un seul groupe, libre de dériver sur toute la hauteur des deux sections */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {/* Halo prune — haut à droite, derrière l'accordéon d'About */}
        <motion.div
          className="absolute -right-[8%] -top-[6%] h-[38%] w-[46%] min-h-[420px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(100,40,72,0.54) 0%, rgba(100,40,72,0.29) 46%, transparent 74%)",
            borderRadius: "56% 44% 62% 38% / 46% 55% 45% 54%",
            filter: "blur(70px)",
          }}
          animate={
            animateBackdrop
              ? { x: ["0%", "-4%", "2%", "0%"], y: ["0%", "3%", "-2%", "0%"] }
              : undefined
          }
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Halo rose / bordeaux — bas d'About, dérive librement jusqu'en haut de Hostesses */}
        <motion.div
          className="absolute -left-[10%] top-[10%] h-[34%] w-[42%] min-h-[400px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(150,45,80,0.48) 0%, rgba(150,45,80,0.25) 46%, transparent 74%)",
            borderRadius: "44% 56% 38% 62% / 60% 40% 62% 38%",
            filter: "blur(66px)",
          }}
          animate={
            animateBackdrop
              ? { x: ["0%", "3%", "-3%", "0%"], y: ["0%", "-3%", "2%", "0%"] }
              : undefined
          }
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />

        {/* Voile bordeaux diffus — recouvre la jonction About/Hostesses, sans bord net */}
        <motion.div
          className="absolute left-1/2 top-[24%] h-[30%] w-[80%] min-h-[360px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(110,32,54,0.3) 0%, transparent 72%)",
            filter: "blur(60px)",
          }}
          animate={animateBackdrop ? { scale: [0.97, 1.05, 0.97] } : undefined}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Halo prune — derrière le titre "Who's Available Now", prolongement direct du halo du haut */}
        <motion.div
          className="absolute -right-[10%] top-[16%] h-[32%] w-[40%] min-h-[360px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(100,40,72,0.46) 0%, rgba(100,40,72,0.22) 46%, transparent 74%)",
            borderRadius: "54% 46% 60% 40% / 48% 54% 46% 52%",
            filter: "blur(74px)",
          }}
          animate={
            animateBackdrop
              ? { x: ["0%", "-3%", "2%", "0%"], y: ["0%", "2%", "-2%", "0%"] }
              : undefined
          }
          transition={{ duration: 27, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Halo prune — bas de la scène, derrière la grille d'hôtesses */}
        <motion.div
          className="absolute -right-[8%] bottom-[-4%] h-[34%] w-[42%] min-h-[380px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(100,40,72,0.5) 0%, rgba(100,40,72,0.24) 46%, transparent 74%)",
            borderRadius: "56% 44% 62% 38% / 46% 55% 45% 54%",
            filter: "blur(70px)",
          }}
          animate={
            animateBackdrop
              ? { x: ["0%", "-4%", "2%", "0%"], y: ["0%", "3%", "-2%", "0%"] }
              : undefined
          }
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />

        {/* Fumée douce — bandes larges qui traversent lentement toute la jonction */}
        {animateBackdrop && (
          <>
            <motion.div
              className="absolute left-[-45%] top-[6%] h-[46%] w-[90%] min-h-[460px] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(244,239,232,0.12) 0%, rgba(150,45,80,0.08) 45%, transparent 72%)",
                filter: "blur(70px)",
                mixBlendMode: "screen",
              }}
              animate={{ x: ["0%", "90%", "0%"] }}
              transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[-45%] top-[20%] h-[42%] w-[85%] min-h-[440px] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(232,201,171,0.1) 0%, rgba(100,40,72,0.08) 45%, transparent 72%)",
                filter: "blur(66px)",
                mixBlendMode: "screen",
              }}
              animate={{ x: ["0%", "-85%", "0%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 6 }}
            />
          </>
        )}

        {/* Fine grain texture for depth — un seul calque sur toute la scène */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      <About />
      <Hostesses hostesses={hostesses} hostessText={hostessText} />
      <Services />
    </div>
  );
}
