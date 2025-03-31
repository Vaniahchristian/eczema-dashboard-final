"use client"

import { useState } from "react"
import { Cpu, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
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
} from "recharts"
import type { TimeRange } from "./analytics-page"

interface SystemPerformanceProps {
  timeRange: TimeRange
  dateRange: [Date, Date]
  isLoading: boolean
}

export default function SystemPerformance({ timeRange, dateRange, isLoading }: SystemPerformanceProps) {
  const [activeTab, setActiveTab] = useState<"response" | "accuracy" | "errors">("response")

  // Sample data - in a real app, this would come from an API
  const generateResponseTimeData = () => {
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

      data.push({
        date: isHourly
          ? date.toLocaleTimeString([], { hour: "2-digit", hour12: false })
          : isMonthly
            ? date.toLocaleDateString([], { month: "short" })
            : date.toLocaleDateString([], { month: "short", day: "numeric" }),
        apiResponse: Math.floor(Math.random() * 300) + 200, // 200-500ms
        imageAnalysis: Math.floor(Math.random() * 1000) + 500, // 500-1500ms
        dataProcessing: Math.floor(Math.random() * 200) + 100, // 100-300ms
      })
    }

    return data
  }

  const responseTimeData = generateResponseTimeData()

  // Accuracy data
  const accuracyData = [
    { name: "Mild Eczema", accuracy: 94.2 },
    { name: "Moderate Eczema", accuracy: 91.7 },
    { name: "Severe Eczema", accuracy: 88.5 },
    { name: "Contact Dermatitis", accuracy: 92.3 },
    { name: "Atopic Dermatitis", accuracy: 95.1 },
  ]

  // Error data
  const errorData = [
    { date: "Mon", errors: 12 },
    { date: "Tue", errors: 8 },
    { date: "Wed", errors: 15 },
    { date: "Thu", errors: 7 },
    { date: "Fri", errors: 10 },
    { date: "Sat", errors: 5 },
    { date: "Sun", errors: 3 },
  ]

  const renderChart = () => {
    if (activeTab === "response") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={responseTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} ms`, ""]}
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
              dataKey="apiResponse"
              name="API Response Time"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
            />
            <Line
              type="monotone"
              dataKey="imageAnalysis"
              name="Image Analysis Time"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
            />
            <Line
              type="monotone"
              dataKey="dataProcessing"
              name="Data Processing Time"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    } else if (activeTab === "accuracy") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accuracyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis domain={[80, 100]} />
            <Tooltip
              formatter={(value) => [`${value}%`, "Accuracy"]}
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e2e8f0",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="accuracy" name="Diagnostic Accuracy" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={errorData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value}`, "Errors"]}
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e2e8f0",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="errors" name="System Errors" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 h-full ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Cpu className="mr-2 h-5 w-5" />
            System Performance
          </h2>
        </div>
        <div className="flex space-x-2 mt-3">
          <button
            onClick={() => setActiveTab("response")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              activeTab === "response" ? "bg-white text-indigo-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Response Times
          </button>
          <button
            onClick={() => setActiveTab("accuracy")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              activeTab === "accuracy" ? "bg-white text-indigo-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            AI Accuracy
          </button>
          <button
            onClick={() => setActiveTab("errors")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              activeTab === "errors" ? "bg-white text-indigo-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Error Rates
          </button>
        </div>
      </div>
      <div className="p-4">
        {renderChart()}

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">System Status</span>
            </div>
            <span className="text-sm text-emerald-500 font-medium">Operational</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Average Response Time</span>
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">342ms</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Model Version</span>
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">v2.4.1</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Error Rate (24h)</span>
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">0.42%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

