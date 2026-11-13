"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme, BackgroundIntensity } from "@/contexts/ThemeContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ThemeDecorativeLayer() {
  const { theme, bgIntensity } = useTheme();
  const prefersReduced = useReducedMotion();
  const [hoveredArtifact, setHoveredArtifact] = useState<string | null>(null);

  // Mouse tilt tracking for subtle 3D depth in the background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2.5, -2.5]), {
    stiffness: 80,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), {
    stiffness: 80,
    damping: 20,
  });
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 80,
    damping: 20,
  });
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]), {
    stiffness: 80,
    damping: 20,
  });

  useEffect(() => {
    if (prefersReduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      const xPct = e.clientX / window.innerWidth - 0.5;
      const yPct = e.clientY / window.innerHeight - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, prefersReduced]);

  // Opacity mapping for background 3D images
  const intensityOpacityMap: Record<BackgroundIntensity, number> = {
    cinematic: 0.48,
    balanced: 0.32,
    subtle: 0.18,
  };

  const currentOpacity = intensityOpacityMap[bgIntensity] || 0.38;

  return (
    <>
      {/* ============================================================== */}
      {/* MASTER 3D BACKGROUND STAGE */}
      {/* ============================================================== */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ perspective: 1200 }}
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            style={
              prefersReduced
                ? {}
                : {
                    rotateX,
                    rotateY,
                    x: translateX,
                    y: translateY,
                    transformStyle: "preserve-3d",
                  }
            }
          >
            {/* 1. Theme Color Gradient Wash Base */}
            <div
              className="absolute inset-0 transition-colors duration-1000"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.bgStart} 0%, ${theme.colors.bgEnd} 100%)`,
              }}
            />

            {/* 2. Full-Bleed 3D Cultural Landscape Image */}
            {theme.artwork3D?.image3D && (
              <motion.div
                className="absolute inset-0 w-full h-full"
                animate={
                  prefersReduced
                    ? {}
                    : {
                        scale: [1, 1.025, 1],
                      }
                }
                transition={{
                  duration: 22,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={theme.artwork3D.image3D}
                  alt={theme.artwork3D.monumentTitle}
                  className="w-full h-full object-cover object-center filter saturate-[1.12] contrast-[1.05] transition-opacity duration-700"
                  style={{
                    opacity: currentOpacity,
                  }}
                />
              </motion.div>
            )}

            {/* 3. Dynamic Ambient Radial Lights */}
            <div
              className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full blur-[130px] transition-all duration-1000 mix-blend-screen pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${theme.artwork3D?.ambientGlowColor || theme.colors.primary} 0%, transparent 65%)`,
                opacity: bgIntensity === "cinematic" ? 0.35 : 0.22,
              }}
            />
            <div
              className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[140px] transition-all duration-1000 mix-blend-screen pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${theme.colors.secondary} 0%, transparent 65%)`,
                opacity: bgIntensity === "cinematic" ? 0.3 : 0.18,
              }}
            />
            <div
              className="absolute top-[35%] left-[25%] w-[45vw] h-[45vw] rounded-full blur-[140px] transition-all duration-1000 mix-blend-screen pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${theme.colors.accent} 0%, transparent 65%)`,
                opacity: bgIntensity === "cinematic" ? 0.22 : 0.12,
              }}
            />

            {/* 4. Repeating Authentic Cultural SVG Pattern Motif Overlay */}
            {theme.motif?.svgMotifData && (
              <div
                className="absolute inset-0 mix-blend-screen transition-opacity duration-700 pointer-events-none"
                style={{
                  opacity: theme.motif.opacity * 0.9,
                  backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
                    theme.motif.svgMotifData.replace(
                      /currentColor/g,
                      theme.colors.primary
                    )
                  )}")`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "55px 55px",
                }}
              />
            )}

            {/* 5. Readability Protection Gradient Scrim */}
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-700"
              style={{
                background: `radial-gradient(ellipse at center, transparent 20%, ${theme.colors.bgStart}70 70%, ${theme.colors.bgEnd}b0 100%)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/45 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* 6. Floating 3D Cultural Artifacts */}
        {theme.artwork3D?.floatingArtifacts?.map((artifact, index) => {
          const isHovered = hoveredArtifact === artifact.name;
          const posStyle: React.CSSProperties = {
            position: "absolute",
            ...artifact.initialPos,
          };

          return (
            <motion.div
              key={`${theme.id}-${artifact.name}-${index}`}
              style={posStyle}
              className="pointer-events-auto z-10 cursor-pointer hidden md:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                prefersReduced
                  ? { opacity: 0.85, scale: 1 }
                  : {
                      opacity: 0.92,
                      scale: 1,
                      y: [-8, 8, -8],
                      rotate: [-3, 3, -3],
                    }
              }
              transition={{
                duration: 6 + index * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: artifact.animationDelay,
              }}
              onMouseEnter={() => setHoveredArtifact(artifact.name)}
              onMouseLeave={() => setHoveredArtifact(null)}
              whileHover={{ scale: 1.15, rotate: 0 }}
            >
              <div className="relative group">
                {/* 3D Glass Sphere / Orb */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-card3D backdrop-blur-md border transition-all duration-300"
                  style={{
                    backgroundColor: `${theme.colors.surfaceGlass}`,
                    borderColor: `${theme.colors.borderGlow}`,
                    boxShadow: `0 8px 32px 0 ${theme.artwork3D.ambientGlowColor}25, inset 0 0 12px ${theme.colors.accentSoft}`,
                  }}
                >
                  <span className="filter drop-shadow-md select-none">
                    {artifact.symbol}
                  </span>
                </div>

                {/* Ambient glow underneath artifact */}
                <div
                  className="absolute -inset-1 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none -z-10"
                  style={{ backgroundColor: theme.colors.primary }}
                />

                {/* Hover Cultural Info Pill */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shadow-xl backdrop-blur-xl border z-30"
                      style={{
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      }}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{artifact.symbol}</span>
                        <span>{artifact.name}</span>
                      </div>
                      <div className="text-[11px] opacity-80">
                        {artifact.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}