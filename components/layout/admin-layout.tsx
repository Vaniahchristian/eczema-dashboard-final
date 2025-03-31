"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import AdminNavbar from "@/components/layout/admin-navbar"
import AdminSidebar from "@/components/layout/admin-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useIsMobile()
  const pathname = usePathname()

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-slate-900 flex flex-col admin-bg">
      <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <motion.main
          className="flex-1 overflow-y-auto pt-16 md:pl-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-grid-slate-100 dark:bg-grid-slate-800">{children}</div>
        </motion.main>
      </div>
    </div>
  )
}

