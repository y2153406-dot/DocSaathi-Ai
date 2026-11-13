"use client";

import React, { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "interactive" | "subtle" | "glow";
  is3DTilt?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = "default",
  is3DTilt = false,
  ...props
}: GlassCardProps) {
  const prefersReduced = useReducedMotion();

  const variantStyles = {
    default: "bg-theme-surfaceGlass border border-theme-border backdrop-blur-md shadow-glass",
    elevated: "bg-theme-surface border border-theme-border backdrop-blur-lg shadow-card3D",
    interactive:
      "bg-theme-surfaceGlass border border-theme-border backdrop-blur-md shadow-glass hover:bg-theme-surfaceGlassActive hover:border-theme-borderGlow hover:shadow-glassHover transition-all duration-300",
    subtle: "bg-white/5 dark:bg-black/20 border border-white/10 backdrop-blur-sm",
    glow: "bg-theme-surfaceGlass border border-theme-borderGlow backdrop-blur-md shadow-glow",
  };

  const tiltMotionProps =
    is3DTilt && !prefersReduced
      ? {
          whileHover: { y: -4, scale: 1.01 },
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }
      : {};

  return (
    <motion.div
      className={cn(
        "rounded-2xl transition-colors duration-200",
        variantStyles[variant],
        className
      )}
      {...tiltMotionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
