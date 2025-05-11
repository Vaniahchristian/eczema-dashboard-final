import type React from "react"
import { useEffect, useState } from "react";
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { Toaster } from "sonner"
import InstallPWAButton from "@/components/InstallPWAButton";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EDAS - Smart Eczema Management",
  description: "AI-powered eczema diagnosis and management platform",
  generator: 'vc',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA primary color */}
        <meta name="theme-color" content="#000000" />
        {/* Mobile web app capable */}
        <meta name="mobile-web-app-capable" content="yes" />
        {/* iOS support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EDAS" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Android support */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <InstallPWAButton />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}