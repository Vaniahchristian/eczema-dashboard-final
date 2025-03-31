import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResourcesNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] px-4 py-6 md:px-6 max-w-7xl mx-auto text-center">
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
          <FileQuestion className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300 mb-2">Resource Not Available</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          The medical resources section has been removed from the doctor's interface. Please use the navigation menu to
          access other sections.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/doctor">Return to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/doctor/patients">View Patients</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

