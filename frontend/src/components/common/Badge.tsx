import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "urgent" | "warning" | "success" | "neutral" | "theme";
  size?: "sm" | "md";
  className?: string;
  icon?: ReactNode;
}

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  className,
  icon,
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-theme-primary/15 text-theme-primary border border-theme-primary/30",
    urgent: "bg-red-500/15 text-red-400 border border-red-500/30 font-semibold",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    neutral: "bg-white/10 text-theme-textMuted border border-white/10",
    theme: "bg-theme-accentSoft text-theme-accent border border-theme-border",
  };

  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5 rounded-full gap-1",
    md: "text-sm px-3 py-1 rounded-full gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium select-none tracking-wide",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
