"use client"

import { useState } from "react"
import { Calendar, ChartBarIcon, LineChart, BarChart2 } from "lucide-react"
import type { TimeRange, MetricType } from "./analytics-page"
import DateRangePicker from "../shared/date-range-picker"

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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor and analyze user engagement, survey responses, and system performance
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onToggleMetric("overview")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
              activeMetrics.includes("overview")
                ? "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <ChartBarIcon className="h-4 w-4" />
            Overview
          </button>

          <button
            onClick={() => onToggleMetric("engagement")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
              activeMetrics.includes("engagement")
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <LineChart className="h-4 w-4" />
            Engagement
          </button>

          <button
            onClick={() => onToggleMetric("survey")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
              activeMetrics.includes("survey")
                ? "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            Survey Analytics
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
                timeRange === "custom"
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <Calendar className="h-4 w-4" />
              {timeRange === "custom"
                ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                : timeRange.toUpperCase()}
            </button>

            {isDatePickerOpen && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <DateRangePicker
                  value={dateRange}
                  onChange={(range) => {
                    onDateRangeChange(range)
                    setIsDatePickerOpen(false)
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {(["24h", "7d", "30d", "90d", "1y"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => onTimeRangeChange(range)}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  timeRange === range
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={onToggleComparisonMode}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
              comparisonMode
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  )
}
