import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "@/app/globals.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container flex items-center justify-center min-h-screen py-8">
        {children}
      </main>
    </div>
  )
}

