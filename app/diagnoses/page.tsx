"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import DiagnosesPage from "@/components/diagnoses/diagnoses-page"
import LoadingSpinner from "../../components/ui/loading-spinner"

export default function Diagnoses() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check auth on mount
    if (!user) {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [user, router])

  // Show loading state during auth check and navigation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Only render the page if we have a user
  if (!user) {
    return null
  }

  return <DiagnosesPage />
}
