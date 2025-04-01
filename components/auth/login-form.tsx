"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userData = await login(email, password)
      console.log("Login successful, userData:", userData)
      
      // Wait a moment for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Navigate based on role
      const redirectPath = userData.role === "patient" 
        ? "/dashboard"
        : userData.role === "doctor"
        ? "/doctor"
        : "/admin"

      console.log("Redirecting to:", redirectPath)
      window.location.href = redirectPath
      
      toast.success("Login successful!")
    } catch (err) {
      console.error("Login error:", err)
      toast.error(error || "Login failed. Please try again.")
      clearError()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <Link href="/" className="inline-block">
          <Button variant="ghost" size="icon" className="absolute left-4 top-4">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to home</span>
          </Button>
        </Link>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-600">
          <div className="h-8 w-8 rounded-full bg-white/90"></div>
        </div>
        <h1 className="text-2xl font-bold">Welcome back to EczemaAI</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <div className="text-center text-sm">
        <p className="text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-teal-500 hover:text-teal-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
