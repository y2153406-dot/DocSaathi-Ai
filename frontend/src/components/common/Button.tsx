"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl";

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs font-semibold gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2 shadow-sm",
      lg: "px-6 py-3.5 text-base font-semibold gap-2.5 shadow-md",
    };

    const variantStyles = {
      primary:
        "bg-theme-primary text-theme-textInverse hover:bg-theme-primaryHover shadow-glow focus:ring-theme-primary active:scale-[0.98]",
      secondary:
        "bg-theme-surface border border-theme-border text-theme-text hover:bg-theme-surfaceGlassActive focus:ring-theme-border",
      outline:
        "border border-theme-border text-theme-text hover:border-theme-primary hover:text-theme-primary focus:ring-theme-primary bg-transparent",
      ghost:
        "text-theme-textMuted hover:text-theme-text hover:bg-white/5 focus:ring-theme-border",
      danger:
        "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 focus:ring-red-500",
      accent:
        "bg-theme-accent text-theme-textInverse hover:opacity-90 shadow-sm focus:ring-theme-accent",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
