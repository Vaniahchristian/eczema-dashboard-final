"use client"

import { useState } from "react"
import { BarChart2, ArrowRight } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts"
import type { TimeRange } from "./analytics-page"

interface EngagementAnalyticsProps {
  timeRange: TimeRange
  dateRange: [Date, Date]
  isLoading: boolean
  comparisonMode: boolean
}

export default function EngagementAnalytics({
  timeRange,
  dateRange,
  isLoading,
  comparisonMode,
}: EngagementAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "features" | "retention">("overview")
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line")

  // Sample data - in a real app, this would come from an API
  const generateData = (offset = 0) => {
    const data = []
    const now = new Date()
    const daysToGenerate =
      timeRange === "24h"
        ? 24
        : timeRange === "7d"
          ? 7
          : timeRange === "30d"
            ? 30
            : timeRange === "90d"
              ? 30
              : timeRange === "1y"
                ? 12
                : 30

    const isHourly = timeRange === "24h"
    const isMonthly = timeRange === "1y"

    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date()
      if (isHourly) {
        date.setHours(now.getHours() - (daysToGenerate - i - 1))
      } else if (isMonthly) {
        date.setMonth(now.getMonth() - (daysToGenerate - i - 1))
      } else {
        date.setDate(now.getDate() - (daysToGenerate - i - 1))
      }

      const baseValue = Math.floor(Math.random() * 500) + 500
      const value = Math.max(0, baseValue + offset * 50)

      data.push({
        date: isHourly
          ? date.toLocaleTimeString([], { hour: "2-digit", hour12: false })
          : isMonthly
            ? date.toLocaleDateString([], { month: "short" })
            : date.toLocaleDateString([], { month: "short", day: "numeric" }),
        users: value,
        sessions: Math.floor(value * 1.5),
        pageViews: Math.floor(value * 4.2),
        newUsers: Math.floor(value * 0.3),
      })
    }

    return data
  }

  const currentData = generateData()
  const previousData = generateData(-1)

  // Feature usage data
  const featureUsageData = [
    { name: "Dashboard", usage: 92 },
    { name: "Diagnoses", usage: 78 },
    { name: "Appointments", usage: 65 },
    { name: "Messages", usage: 83 },
    { name: "Analytics", usage: 42 },
    { name: "Profile", usage: 38 },
    { name: "Settings", usage: 25 },
  ]

  // Retention data
  const retentionData = [
    { week: "Week 1", retention: 100 },
    { week: "Week 2", retention: 86 },
    { week: "Week 3", retention: 72 },
    { week: "Week 4", retention: 65 },
    { week: "Week 5", retention: 58 },
    { week: "Week 6", retention: 52 },
    { week: "Week 7", retention: 48 },
    { week: "Week 8", retention: 45 },
  ]

  const renderChart = () => {
    if (activeTab === "overview") {
      if (chartType === "line") {
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderColor: "#e2e8f0",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                name="Active Users"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
              />
              {comparisonMode && (
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Previous Period"
                  data={previousData}
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 0 }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
                />
              )}
              <Line
                type="monotone"
                dataKey="newUsers"
                name="New Users"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
              />
              <Line
                type="monotone"
                dataKey="sessions"
                name="Sessions"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      } else if (chartType === "bar") {
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderColor: "#e2e8f0",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar dataKey="users" name="Active Users" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              {comparisonMode && (
                <Bar dataKey="users" name="Previous Period" data={previousData} fill="#94a3b8" radius={[4, 4, 0, 0]} />
              )}
              <Bar dataKey="newUsers" name="New Users" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sessions" name="Sessions" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      } else {
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderColor: "#e2e8f0",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="users"
                name="Active Users"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              {comparisonMode && (
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Previous Period"
                  data={previousData}
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  fillOpacity={0}
                />
              )}
              <Area
                type="monotone"
                dataKey="newUsers"
                name="New Users"
                stroke="#14b8a6"
                fillOpacity={1}
                fill="url(#colorNewUsers)"
              />
              <Area
                type="monotone"
                dataKey="sessions"
                name="Sessions"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorSessions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      }
    } else if (activeTab === "features") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={featureUsageData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" />
            <Tooltip
              formatter={(value) => [`${value}%`, "Usage"]}
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e2e8f0",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="usage" name="Feature Usage %" fill="#0ea5e9" radius={[0, 4, 4, 0]}>
              {featureUsageData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.usage > 75
                      ? "#0ea5e9"
                      : entry.usage > 50
                        ? "#14b8a6"
                        : entry.usage > 25
                          ? "#eab308"
                          : "#ef4444"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    } else {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={retentionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              formatter={(value) => [`${value}%`, "Retention Rate"]}
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e2e8f0",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="retention"
              name="User Retention %"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 6, strokeWidth: 2, fill: "white" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <BarChart2 className="mr-2 h-5 w-5" />
            User Engagement Analytics
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                chartType === "line" ? "bg-white text-sky-600 shadow-md" : "text-white/80 hover:bg-white/20"
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                chartType === "bar" ? "bg-white text-sky-600 shadow-md" : "text-white/80 hover:bg-white/20"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                chartType === "area" ? "bg-white text-sky-600 shadow-md" : "text-white/80 hover:bg-white/20"
              }`}
            >
              Area
            </button>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              activeTab === "overview" ? "bg-white text-sky-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              activeTab === "features" ? "bg-white text-sky-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Feature Usage
          </button>
          <button
            onClick={() => setActiveTab("retention")}
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              activeTab === "retention" ? "bg-white text-sky-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Retention
          </button>
        </div>
      </div>
      <div className="p-6">
        {renderChart()}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Key Insights</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-sky-500 mr-2 mt-0.5" />
                <span>User engagement has increased by 12.5% compared to the previous period</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-sky-500 mr-2 mt-0.5" />
                <span>The Dashboard and Messages features have the highest usage rates</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-sky-500 mr-2 mt-0.5" />
                <span>
                  User retention drops significantly after week 3, suggesting a need for engagement strategies
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Recommendations</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                <span>Implement push notifications for appointment reminders to increase engagement</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                <span>Improve onboarding flow to highlight the Analytics feature</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                <span>Add gamification elements to encourage regular app usage</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">User Behavior</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                <span>Peak usage times are between 8-10 AM and 6-8 PM</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                <span>Mobile users spend 35% more time in the app than desktop users</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                <span>Users who upload images are 3x more likely to schedule appointments</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

