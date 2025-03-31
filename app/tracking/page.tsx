import type { Metadata } from "next"
import HealthTrackingPage from "@/components/tracking/health-tracking-page"

export const metadata: Metadata = {
  title: "Health Tracking | EczemaAI",
  description: "Track and monitor your health metrics to better manage your eczema condition",
}

export default function TrackingPage() {
  return <HealthTrackingPage />
}

