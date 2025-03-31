import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import AdminLayout from "@/components/layout/admin-layout"
import "@/app/globals.css"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AdminLayout>{children}</AdminLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}

