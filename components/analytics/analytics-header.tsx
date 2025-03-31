"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, ChevronDown, BarChart2, Activity, Cpu, Users, Zap, Filter, RefreshCw } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import type { TimeRange, MetricType } from "./analytics-page"

interface AnalyticsHeaderProps {
  timeRange: TimeRange
  dateRange: [Date, Date]
  onTimeRangeChange: (range: TimeRange) => void
  onDateRangeChange: (range: [Date, Date]) => void
  activeMetrics: MetricType[]
  onToggleMetric: (metric: MetricType) => void
  comparisonMode: boolean
  onToggleComparisonMode: () => void
}

export default function AnalyticsHeader({
  timeRange,
  dateRange,
  onTimeRangeChange,
  onDateRangeChange,
  activeMetrics,
  onToggleMetric,
  comparisonMode,
  onToggleComparisonMode,
}: AnalyticsHeaderProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    if (isSelectingStartDate) {
      onDateRangeChange([date, dateRange[1]])
      setIsSelectingStartDate(false)
    } else {
      // Ensure end date is not before start date
      if (date < dateRange[0]) {
        onDateRangeChange([date, dateRange[0]])
      } else {
        onDateRangeChange([dateRange[0], date])
      }
      setCalendarOpen(false)
      setIsSelectingStartDate(true)
    }

    setSelectedDate(date)
  }

  const formatDateRange = () => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }

    return `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`
  }

  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) {
      case "24h":
        return "Last 24 Hours"
      case "7d":
        return "Last 7 Days"
      case "30d":
        return "Last 30 Days"
      case "90d":
        return "Last 90 Days"
      case "1y":
        return "Last Year"
      case "custom":
        return formatDateRange()
    }
  }

  const getMetricIcon = (metric: MetricType) => {
    switch (metric) {
      case "engagement":
        return <BarChart2 className="h-4 w-4 mr-2" />
      case "health":
        return <Activity className="h-4 w-4 mr-2" />
      case "system":
        return <Cpu className="h-4 w-4 mr-2" />
      case "demographics":
        return <Users className="h-4 w-4 mr-2" />
      case "realtime":
        return <Zap className="h-4 w-4 mr-2" />
    }
  }

  const getMetricLabel = (metric: MetricType) => {
    switch (metric) {
      case "engagement":
        return "Engagement"
      case "health":
        return "Health Metrics"
      case "system":
        return "System Performance"
      case "demographics":
        return "Demographics"
      case "realtime":
        return "Real-time Activity"
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Track your eczema management metrics and system performance
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{getTimeRangeLabel(timeRange)}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex space-x-2 mb-3">
                  <button
                    onClick={() => onTimeRangeChange("24h")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      timeRange === "24h"
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    24h
                  </button>
                  <button
                    onClick={() => onTimeRangeChange("7d")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      timeRange === "7d"
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    7d
                  </button>
                  <button
                    onClick={() => onTimeRangeChange("30d")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      timeRange === "30d"
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    30d
                  </button>
                  <button
                    onClick={() => onTimeRangeChange("90d")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      timeRange === "90d"
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    90d
                  </button>
                  <button
                    onClick={() => onTimeRangeChange("1y")}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      timeRange === "1y"
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    1y
                  </button>
                </div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {isSelectingStartDate ? "Select start date" : "Select end date"}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{formatDateRange()}</div>
              </div>
              <CalendarComponent mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
                <Filter className="h-4 w-4 mr-2" />
                <span>Metrics</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-2">
                <div className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Select Metrics to Display
                </div>
                {(["engagement", "health", "system", "demographics", "realtime"] as MetricType[]).map((metric) => (
                  <div key={metric} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`metric-${metric}`}
                      checked={activeMetrics.includes(metric)}
                      onChange={() => onToggleMetric(metric)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <label
                      htmlFor={`metric-${metric}`}
                      className="ml-2 flex items-center text-sm text-slate-700 dark:text-slate-300"
                    >
                      {getMetricIcon(metric)}
                      {getMetricLabel(metric)}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <button
            onClick={onToggleComparisonMode}
            className={`flex items-center px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow border ${
              comparisonMode
                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-300 dark:border-sky-700"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Compare</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-sky-50 to-teal-50 dark:from-sky-900/20 dark:to-teal-900/20 p-6 rounded-2xl shadow-sm"
      >
        <div className="flex items-start md:items-center">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm mr-4">
            <BarChart2 className="h-6 w-6 text-teal-500" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">Analytics Overview</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track your eczema management progress, user engagement, and system performance metrics
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

