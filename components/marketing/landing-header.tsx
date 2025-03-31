"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600"></div>
            <span className="text-xl font-bold">EczemaAI</span>
          </Link>
          <nav className="hidden md:flex md:gap-6 md:ml-10">
            <Link href="#features" className="text-sm font-medium hover:text-teal-600 dark:hover:text-teal-400">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-teal-600 dark:hover:text-teal-400">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-teal-600 dark:hover:text-teal-400">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-teal-600 dark:hover:text-teal-400">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex md:gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col space-y-4 py-4">
            <Link
              href="#features"
              className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" asChild className="w-full justify-center">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
              </Button>
              <Button asChild className="w-full justify-center">
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

