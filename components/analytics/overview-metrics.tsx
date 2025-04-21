"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Activity, Clock, CheckCircle } from "lucide-react"
import { analyticsService } from "@/services/analyticsService"
import type { TimeRange } from "./analytics-page"
import { Loader2 } from "lucide-react"

interface OverviewMetricsProps {
  timeRange: TimeRange
  dateRange: [Date, Date]
}

interface OverviewData {
  totalUsers: number
  totalDiagnoses: number
  avgResponseTime: number
  successRate: number
}

interface DiagnosisPattern {
  count: number
  avgResponseTime: number
  successRate: number
}

interface UserDemographics {
  totalUsers: number
}

export default function OverviewMetrics({ timeRange, dateRange }: OverviewMetricsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<OverviewData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [userDemographics, diagnosisPatterns] = await Promise.all([
          analyticsService.getUserDemographics({ start: dateRange[0], end: dateRange[1] }),
          analyticsService.getDiagnosisPatterns({ start: dateRange[0], end: dateRange[1] })
        ])

        // Calculate overview metrics from the data
        const totalUsers = userDemographics.totalUsers || 0
        const totalDiagnoses = diagnosisPatterns.reduce((sum: number, pattern: DiagnosisPattern) => sum + pattern.count, 0)
        const avgResponseTime = diagnosisPatterns.reduce((sum: number, pattern: DiagnosisPattern) => sum + (pattern.avgResponseTime || 0), 0) / diagnosisPatterns.length
        const successRate = diagnosisPatterns.reduce((sum: number, pattern: DiagnosisPattern) => sum + (pattern.successRate || 0), 0) / diagnosisPatterns.length

        setData({
          totalUsers,
          totalDiagnoses,
          avgResponseTime,
          successRate
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch overview data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange, dateRange])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center text-slate-500 p-4">
        <p>No overview data available</p>
      </div>
    )
  }

  const metrics = [
    {
      label: "Total Users",
      value: data.totalUsers.toLocaleString(),
      change: "+12%",
      icon: Users,
      color: "text-sky-500",
      bgColor: "bg-sky-100 dark:bg-sky-900/30",
    },
    {
      label: "Total Diagnoses",
      value: data.totalDiagnoses.toLocaleString(),
      change: "+8%",
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Avg. Response Time",
      value: `${Math.round(data.avgResponseTime)}s`,
      change: "-15%",
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Success Rate",
      value: `${(data.successRate * 100).toFixed(1)}%`,
      change: "+5%",
      icon: CheckCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <span
                className={`text-xs font-medium ${
                  metric.change.startsWith("+")
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {metric.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</h3>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">{metric.value}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
