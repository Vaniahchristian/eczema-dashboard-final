"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Users, Clock, Image, Calendar, MessageSquare } from "lucide-react"
import type { TimeRange } from "./analytics-page"

interface OverviewMetricsProps {
  timeRange: TimeRange
  dateRange: [Date, Date]
  isLoading: boolean
}

export default function OverviewMetrics({ timeRange, dateRange, isLoading }: OverviewMetricsProps) {
  // Sample metrics data - in a real app, this would come from an API
  const metrics = [
    {
      name: "Active Users",
      value: "1,248",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      name: "Avg. Session Duration",
      value: "8m 42s",
      change: "+3.2%",
      trend: "up",
      icon: Clock,
    },
    {
      name: "Images Analyzed",
      value: "3,721",
      change: "+28.4%",
      trend: "up",
      icon: Image,
    },
    {
      name: "Appointments Scheduled",
      value: "842",
      change: "+15.7%",
      trend: "up",
      icon: Calendar,
    },
    {
      name: "Messages Sent",
      value: "12,384",
      change: "-2.3%",
      trend: "down",
      icon: MessageSquare,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoading ? 0.7 : 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50 ${
            isLoading ? "animate-pulse" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
              <metric.icon className="h-5 w-5 text-sky-500" />
            </div>
            <div
              className={`flex items-center text-xs font-medium ${
                metric.trend === "up" ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {metric.trend === "up" ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {metric.change}
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-sm text-slate-500 dark:text-slate-400">{metric.name}</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metric.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

