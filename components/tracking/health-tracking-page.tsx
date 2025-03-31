"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import HealthTrackingHeader from "@/components/tracking/health-tracking-header"
import HealthMetricsDashboard from "@/components/tracking/health-metrics-dashboard"
import GoalTracking from "@/components/tracking/goal-tracking"
import MedicationTracking from "@/components/tracking/medication-tracking"
import HealthInsights from "@/components/tracking/health-insights"
import EducationalResourcesTracking from "@/components/tracking/educational-resources"
import LogHealthData from "@/components/tracking/log-health-data"
import EnvironmentalFactors from "@/components/tracking/environmental-factors"
import EczemaSpecificMetrics from "@/components/tracking/eczema-specific-metrics"

export type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y" | "custom"
export type MetricType =
  | "eczema"
  | "sleep"
  | "activity"
  | "nutrition"
  | "stress"
  | "vitals"
  | "environment"
  | "medication"
  | "dashboard"
  | "log"
  | "goals"
  | "insights"
  | "resources"

export default function HealthTrackingPage() {
  const [activeMetrics, setActiveMetrics] = useState<MetricType[]>([
    "eczema",
    "sleep",
    "activity",
    "nutrition",
    "stress",
    "vitals",
  ])
  const [showLogHealth, setShowLogHealth] = useState(false)

  const handleLogHealth = (metric: MetricType) => {
    setShowLogHealth(true)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 pt-20 md:pt-24">
        <HealthTrackingHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <HealthMetricsDashboard timeRange="7d" activeMetrics={activeMetrics} onLogHealth={handleLogHealth} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GoalTracking />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MedicationTracking />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <HealthInsights />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <EczemaSpecificMetrics />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <EnvironmentalFactors />
        </motion.div>

        {showLogHealth && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8"
          >
            <LogHealthData />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8"
        >
          <EducationalResourcesTracking />
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

