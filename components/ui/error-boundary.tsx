"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-900">
      <div className="text-center max-w-md p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-300">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <Button
          onClick={reset}
          className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}

