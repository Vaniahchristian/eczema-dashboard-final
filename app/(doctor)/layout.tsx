import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import DoctorLayout from "@/components/layout/doctor-layout"
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
          <DoctorLayout>{children}</DoctorLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}

