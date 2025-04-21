"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import AnalyticsHeader from "@/components/analytics/analytics-header"
import OverviewMetrics from "@/components/analytics/overview-metrics"
import EngagementAnalytics from "@/components/analytics/engagement-analytics"
import SurveyAnalytics from "@/components/analytics/survey-analytics"

export type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y" | "custom"
export type MetricType = "engagement" | "survey" | "overview"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date(),
  ])
  const [activeMetrics, setActiveMetrics] = useState<MetricType[]>([
    "overview",
    "engagement",
    "survey"
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)

  const handleTimeRangeChange = (range: TimeRange) => {
    setIsLoading(true)
    setTimeRange(range)

    // Calculate new date range based on selected time range
    const endDate = new Date()
    let startDate = new Date()

    switch (range) {
      case "24h":
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
        break
      case "7d":
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "1y":
        startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      case "custom":
        // Keep existing date range for custom
        startDate = dateRange[0]
        break
    }

    if (range !== "custom") {
      setDateRange([startDate, endDate])
    }

    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }

  const handleDateRangeChange = (range: [Date, Date]) => {
    setIsLoading(true)
    setDateRange(range)
    setTimeRange("custom")

    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }

  const toggleMetric = (metric: MetricType) => {
    if (activeMetrics.includes(metric)) {
      setActiveMetrics(activeMetrics.filter((m) => m !== metric))
    } else {
      setActiveMetrics([...activeMetrics, metric])
    }
  }

  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode)
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-screen-2xl mx-auto"
        >
          <AnalyticsHeader
            timeRange={timeRange}
            dateRange={dateRange}
            onTimeRangeChange={handleTimeRangeChange}
            onDateRangeChange={handleDateRangeChange}
            activeMetrics={activeMetrics}
            onToggleMetric={toggleMetric}
            comparisonMode={comparisonMode}
            onToggleComparisonMode={toggleComparisonMode}
          />

          {activeMetrics.includes("overview") && (
            <div className="mt-8">
              <OverviewMetrics timeRange={timeRange} dateRange={dateRange} isLoading={isLoading} />
            </div>
          )}

          {activeMetrics.includes("engagement") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <EngagementAnalytics
                timeRange={timeRange}
                dateRange={dateRange}
                isLoading={isLoading}
                comparisonMode={comparisonMode}
              />
            </motion.div>
          )}

          {activeMetrics.includes("survey") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <SurveyAnalytics
                timeRange={timeRange}
                dateRange={dateRange}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
