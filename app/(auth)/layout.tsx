import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";

// Metadata export for auth pages
export const metadata: Metadata = {
  title: "Auth - EczemaAI",
  description: "Authentication pages for EczemaAI",
};

// Separate viewport export to fix metadata warnings
export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </div>
  );
}
