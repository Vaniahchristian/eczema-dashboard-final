"use client"

import { Bell, Menu, MessageSquare, Search, Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar({
  onMenuClick,
}: {
  onMenuClick: () => void
}) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add("dark")
      setIsDarkMode(true)
    }
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-16 items-center px-4 md:px-6">
        <button
          className="md:hidden mr-2 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
        <div className="hidden md:flex">
          <span className="text-xl font-bold bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
            EczemaAI
          </span>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px] pl-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            <span className="sr-only">Toggle theme</span>
          </button>

          <button className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <button className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-sky-200 dark:border-sky-900 hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
                <img src="/placeholder.svg?height=40&width=40" alt="Avatar" className="rounded-full object-cover" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer">Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg cursor-pointer">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}

