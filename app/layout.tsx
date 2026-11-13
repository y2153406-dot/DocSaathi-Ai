import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocSaathi AI - Har Document Ko Samjho, Aasaan Bhasha Mein",
  description: "AI-powered document explainer for college notices, scholarships, government circulars, and job notifications in Hindi, English, and Hinglish.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
