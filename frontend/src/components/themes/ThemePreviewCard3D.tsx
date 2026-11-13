"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, X, Palette } from "lucide-react";
import { ThemeConfig } from "@/types/themes";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "../common/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ThemePreviewCard3DProps {
  themeConfig: ThemeConfig;
  isActive?: boolean;
  onApply?: () => void;
  onClose?: () => void;
  isFloatingPopup?: boolean;
}

export function ThemePreviewCard3D({
  themeConfig,
  isActive = false,
  onApply,
  onClose,
  isFloatingPopup = false,
}: ThemePreviewCard3DProps) {
  const { setThemeById } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 250,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 250,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleApply = () => {
    setThemeById(themeConfig.id);
    if (onApply) onApply();
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className={isFloatingPopup ? "w-full max-w-md mx-auto" : "w-full"}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          prefersReduced
            ? {
                borderColor: isActive ? themeConfig.colors.primary : themeConfig.colors.border,
                boxShadow: isActive
                  ? `0 0 0 2px ${themeConfig.colors.primary}, 0 10px 25px -5px ${themeConfig.colors.primary}30`
                  : "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
              }
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                borderColor: isActive ? themeConfig.colors.primary : themeConfig.colors.border,
                boxShadow: isActive
                  ? `0 0 0 2px ${themeConfig.colors.primary}, 0 12px 28px -4px ${themeConfig.colors.primary}35`
                  : "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
              }
        }
        className="relative overflow-hidden rounded-3xl p-6 transition-all duration-300 border bg-white dark:bg-stone-900 group"
        whileHover={prefersReduced ? {} : { scale: 1.02 }}
      >
        {/* Layer 1: Background & Theme 3D Cultural Artwork */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {themeConfig.artwork3D?.image3D && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={themeConfig.artwork3D.image3D}
              alt={themeConfig.artwork3D.monumentTitle}
              className="w-full h-full object-cover object-center filter saturate-[1.1] transition-transform duration-700 group-hover:scale-105 opacity-25"
            />
          )}
          {/* Subtle gradient wash over 3D image to protect text legibility */}
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: `linear-gradient(135deg, ${themeConfig.colors.bgStart}ea 0%, ${themeConfig.colors.bgEnd}f5 100%)`,
            }}
          />
        </div>

        {/* Layer 2: Decorative Pattern Motif */}
        {themeConfig.motif.svgMotifData && (
          <div
            className="absolute inset-0 mix-blend-multiply dark:mix-blend-screen opacity-15 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
                themeConfig.motif.svgMotifData.replace(
                  /currentColor/g,
                  themeConfig.colors.primary
                )
              )}")`,
              backgroundRepeat: "repeat",
              backgroundSize: "40px 40px",
            }}
          />
        )}

        {/* Ambient Glow Pill */}
        <div
          className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: themeConfig.artwork3D?.ambientGlowColor || themeConfig.colors.primary }}
        />

        {/* Layer 3: Card Content with 3D Depth translation */}
        <div
          style={{ transform: prefersReduced ? "none" : "translateZ(30px)" }}
          className="relative z-10 flex flex-col justify-between h-full space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: themeConfig.colors.primary }}
                />
                <span
                  className="text-xs font-bold tracking-wider uppercase truncate"
                  style={{ color: themeConfig.colors.primary }}
                >
                  {themeConfig.region}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase font-bold border shrink-0"
                  style={{
                    backgroundColor: `${themeConfig.colors.primary}15`,
                    borderColor: `${themeConfig.colors.primary}35`,
                    color: themeConfig.colors.primary,
                  }}
                >
                  3D
                </span>
              </div>

              {/* Theme Name */}
              <h3
                className="text-lg sm:text-xl font-extrabold mt-1.5 font-display tracking-tight leading-snug"
                style={{ color: themeConfig.colors.text }}
              >
                {themeConfig.name}
              </h3>

              {/* Native Name */}
              <p
                className="text-sm font-semibold mt-0.5"
                style={{ color: themeConfig.colors.textMuted }}
              >
                {themeConfig.nativeName}
              </p>

              {/* 3D Monument Badge */}
              {themeConfig.artwork3D?.monumentTitle && (
                <div
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border shadow-xs max-w-full"
                  style={{
                    backgroundColor: `${themeConfig.colors.primary}12`,
                    borderColor: `${themeConfig.colors.primary}30`,
                    color: themeConfig.colors.primaryHover || themeConfig.colors.primary,
                  }}
                >
                  <span className="shrink-0 text-xs">🏛️</span>
                  <span className="truncate">{themeConfig.artwork3D.monumentTitle}</span>
                </div>
              )}
            </div>

            {isFloatingPopup && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full border transition-colors shrink-0"
                style={{
                  backgroundColor: themeConfig.colors.surface,
                  borderColor: themeConfig.colors.border,
                  color: themeConfig.colors.textMuted,
                }}
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {isActive && !isFloatingPopup && (
              <span
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border shadow-xs shrink-0"
                style={{
                  backgroundColor: `${themeConfig.colors.primary}15`,
                  borderColor: `${themeConfig.colors.primary}40`,
                  color: themeConfig.colors.primary,
                }}
              >
                <Check className="w-3.5 h-3.5" /> Active
              </span>
            )}
          </div>

          {/* Tagline */}
          <p
            className="text-xs line-clamp-2 leading-relaxed font-medium"
            style={{ color: themeConfig.colors.textMuted }}
          >
            {themeConfig.tagline}
          </p>

          {/* Color Swatch Circles & Cultural Artifacts */}
          <div
            className="pt-2 pb-1 border-t space-y-2"
            style={{ borderColor: themeConfig.colors.border }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] uppercase font-bold tracking-wider"
                style={{ color: themeConfig.colors.textMuted }}
              >
                Theme Palette
              </span>
              <span
                className="text-[10px] uppercase font-bold tracking-wider"
                style={{ color: themeConfig.colors.textMuted }}
              >
                Artifacts
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              {/* Palette Circles */}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-5 h-5 rounded-full border shadow-xs"
                  style={{
                    backgroundColor: themeConfig.colors.primary,
                    borderColor: themeConfig.colors.border,
                  }}
                  title="Primary"
                />
                <span
                  className="w-5 h-5 rounded-full border shadow-xs"
                  style={{
                    backgroundColor: themeConfig.colors.secondary,
                    borderColor: themeConfig.colors.border,
                  }}
                  title="Secondary"
                />
                <span
                  className="w-5 h-5 rounded-full border shadow-xs"
                  style={{
                    backgroundColor: themeConfig.colors.accent,
                    borderColor: themeConfig.colors.border,
                  }}
                  title="Accent"
                />
                <span
                  className="w-5 h-5 rounded-full border shadow-xs"
                  style={{
                    backgroundColor: themeConfig.colors.surface,
                    borderColor: themeConfig.colors.border,
                  }}
                  title="Surface"
                />
              </div>

              {/* 3D Cultural Artifacts */}
              <div className="flex items-center gap-1">
                {themeConfig.artwork3D?.floatingArtifacts?.map((art, idx) => (
                  <span
                    key={idx}
                    className="w-7 h-7 rounded-lg border shadow-xs flex items-center justify-center text-sm transition-transform hover:scale-115"
                    style={{
                      backgroundColor: themeConfig.colors.surface,
                      borderColor: themeConfig.colors.border,
                    }}
                    title={`${art.name}: ${art.description}`}
                  >
                    {art.symbol}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-1 flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleApply}
              className="w-full text-xs font-bold py-2.5 rounded-xl shadow-xs transition-all"
              style={{
                backgroundColor: themeConfig.colors.primary,
                color: themeConfig.colors.textInverse,
              }}
            >
              {isActive ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" /> Active Theme
                </>
              ) : (
                <>
                  <Palette className="w-3.5 h-3.5 mr-1.5" /> Apply {themeConfig.name}
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}