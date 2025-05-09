"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"

export default function RequestResetForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { requestPasswordReset } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await requestPasswordReset(email)
      toast.success("Password reset instructions have been sent to your email")
    } catch (error: any) {
      toast.error(error?.message || "Failed to send reset instructions")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <Link href="/login" className="inline-block">
          <Button variant="ghost" size="icon" className="absolute left-4 top-4">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to login</span>
          </Button>
        </Link>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-600">
          <div className="h-8 w-8 rounded-full bg-white/90"></div>
        </div>
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email address and we'll send you instructions to reset your password
        </p>
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
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Instructions"}
        </Button>
      </form>
      <div className="text-center text-sm">
        <p className="text-gray-500 dark:text-gray-400">
          Remember your password?{" "}
          <Link href="/login" className="text-teal-500 hover:text-teal-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
