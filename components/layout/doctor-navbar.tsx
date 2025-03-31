"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, Menu, Moon, Search, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"

interface NavbarProps {
  onMenuClick: () => void
}

export default function DoctorNavbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-30 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 mr-2"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/doctor" className="flex items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
            EczemaAI <span className="text-sm font-medium ml-1">MD</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        {searchOpen ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full py-1.5 px-3 rounded-full bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
            <Search className="absolute right-2 top-1.5 h-4 w-4 text-slate-400" />
          </motion.div>
        ) : (
          <button
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        <button
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <Link
          href="/doctor/profile"
          className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium hidden md:block">Dr. Johnson</span>
        </Link>
      </div>
    </header>
  )
}

