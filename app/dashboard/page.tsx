import { Suspense } from "react"
import Dashboard from "@/components/dashboard/dashboard"
import Fallback from "@/components/ui/fallback"

export default function DashboardPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <Dashboard />
    </Suspense>
  )
}

