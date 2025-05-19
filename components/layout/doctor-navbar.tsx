"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, Menu, Moon, Sun, User, LogOut, Settings, MessageSquare } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  onMenuClick: () => void
}

export default function DoctorNavbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()


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
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
            EDAS <span className="text-sm font-medium ml-1">MD</span>
          </span>
        </div>

        <div className="flex items-center space-x-4 ml-auto">


          <button
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            <span className="sr-only">Toggle theme</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-sky-200 dark:border-sky-900 hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
                <Avatar className="h-full w-full">
                  <AvatarImage src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                  <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem
              className="rounded-lg cursor-pointer"
              onClick={() => router.push("/doctor/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-lg cursor-pointer"
              onClick={() => router.push("/doctor/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              className="rounded-lg cursor-pointer"
              onClick={() => router.push("/doctor/support")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Support
            </DropdownMenuItem> */}
            <DropdownMenuItem
              className="rounded-lg cursor-pointer"
              onClick={() => {
                // Optionally clear auth or call logout logic
                localStorage.removeItem("token")
                router.push("/login")
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}

