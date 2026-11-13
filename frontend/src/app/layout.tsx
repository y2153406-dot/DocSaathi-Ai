import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AnalysisProvider } from "@/contexts/AnalysisContext";
import { ThemeDecorativeLayer } from "@/components/themes/ThemeDecorativeLayer";
import { LanguageSelectorModal } from "@/components/navigation/LanguageSelectorModal";
import { ThemeSelectorModal } from "@/components/navigation/ThemeSelectorModal";
import { FirstTimeOnboardingModal } from "@/components/navigation/FirstTimeOnboardingModal";

export const metadata: Metadata = {
  title: "DocSaathi AI — Understand Documents. Know What to Do Next.",
  description:
    "AI-powered multilingual document companion for India. Decipher college circulars, government notices, and scholarship forms in 15 Indian languages with instant action checklists.",
  keywords: [
    "DocSaathi AI",
    "Indian Languages Document Simplifier",
    "Scholarship Notification Explainer",
    "Government Circular Summary",
    "Action Checklist AI",
    "Bharat Multilingual AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="antialiased relative min-h-screen">
        <LanguageProvider>
          <ThemeProvider>
            <AnalysisProvider>
              <ThemeDecorativeLayer />
              <LanguageSelectorModal />
              <ThemeSelectorModal />
              <FirstTimeOnboardingModal />
              <div className="relative z-10 flex flex-col min-h-screen">
                {children}
              </div>
            </AnalysisProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
