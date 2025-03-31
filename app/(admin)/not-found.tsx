import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-purple-800 dark:text-purple-300">
            404 - Page Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/admin">
              <Home className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

