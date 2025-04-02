"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Calendar,
  ChevronLeft,
  ClipboardList,
  FileText,
  Home,
  MessageSquare,
  PieChart,
  Settings,
  Users,
  X,
  HelpCircle,
  Stethoscope,
  User,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function DoctorSidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && open && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, open, setOpen])

  const navItems = [
    { name: "Dashboard", href: "/doctor", icon: Home },
    { name: "Patients", href: "/doctor/patients", icon: Users },
    { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
    { name: "Medical Records", href: "/doctor/records", icon: FileText },
    { name: "Treatment Plans", href: "/doctor/treatments", icon: ClipboardList },
    { name: "Messages", href: "/doctor/messages", icon: MessageSquare },
    { name: "Analytics", href: "/doctor/analytics", icon: PieChart },
    { name: "Profile", href: "/doctor/profile", icon: User },
    { name: "Settings", href: "/doctor/settings", icon: Settings },
  ]

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 },
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
      )}

      <motion.div
        ref={sidebarRef}
        className={`${
          isMobile
            ? "fixed left-0 top-0 bottom-0 z-50 w-64"
            : "fixed left-0 top-0 bottom-0 z-40 w-64 border-r border-gray-200 dark:border-gray-800"
        } bg-white/95 dark:bg-slate-900/95 backdrop-blur-md overflow-y-auto`}
        initial={isMobile ? "closed" : "open"}
        animate={open || !isMobile ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              EczemaAI MD
            </span>
            {isMobile && (
              <button
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex-1 py-6">
            <nav className="space-y-2 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : ""}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-xl shadow-sm">
              <div className="flex items-center mb-3">
                <Stethoscope className="h-5 w-5 text-indigo-500 mr-2" />
                <h4 className="font-medium text-sm">Medical Support</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Need assistance with the platform or medical questions?
              </p>
              <button className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                Get Help
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Collapse button for desktop */}
      {!isMobile && (
        <button
          className="hidden md:flex fixed left-64 bottom-4 z-50 rounded-full shadow-md bg-white dark:bg-slate-800 p-2"
          onClick={() => setOpen(!open)}
        >
          <ChevronLeft className={`h-5 w-5 transition-transform ${!open ? "rotate-180" : ""}`} />
        </button>
      )}
    </>
  )
}
