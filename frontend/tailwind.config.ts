import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--theme-bg)",
          bgGradStart: "var(--theme-bg-start)",
          bgGradEnd: "var(--theme-bg-end)",
          surface: "var(--theme-surface)",
          surfaceGlass: "var(--theme-surface-glass)",
          surfaceGlassActive: "var(--theme-surface-glass-active)",
          border: "var(--theme-border)",
          borderGlow: "var(--theme-border-glow)",
          primary: "var(--theme-primary)",
          primaryHover: "var(--theme-primary-hover)",
          secondary: "var(--theme-secondary)",
          accent: "var(--theme-accent)",
          accentSoft: "var(--theme-accent-soft)",
          text: "var(--theme-text)",
          textMuted: "var(--theme-text-muted)",
          textInverse: "var(--theme-text-inverse)",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-primary)",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "var(--font-primary)",
          "system-ui",
          "sans-serif",
        ],
        urdu: [
          "'Noto Nastaliq Urdu'",
          "'Urdu Typesetting'",
          "'Jameel Noori Nastaleeq'",
          "Tahoma",
          "sans-serif",
        ],
        hindi: [
          "'Noto Sans Devanagari'",
          "'Rozha One'",
          "'Mukta'",
          "sans-serif",
        ],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        glassHover: "0 14px 40px -4px rgba(0, 0, 0, 0.2)",
        glow: "0 0 25px -4px var(--theme-border-glow)",
        card3D: "0 20px 40px -15px rgba(0, 0, 0, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.75" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSubtle: "pulseSubtle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
