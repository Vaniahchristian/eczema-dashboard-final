"use client"

import { useState } from "react"
import { Activity, ArrowRight } from "lucide-react"
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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import type { TimeRange } from "./analytics-page"

interface HealthMetricsProps {
  timeRange: TimeRange
  dateRange: [Date, Date]
  isLoading: boolean
  comparisonMode: boolean
}

export default function HealthMetrics({ timeRange, dateRange, isLoading, comparisonMode }: HealthMetricsProps) {
  const [activeTab, setActiveTab] = useState<"severity" | "treatments" | "symptoms">("severity")

  // Sample data - in a real app, this would come from an API
  const generateSeverityData = (offset = 0) => {
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

    let severityValue = Math.floor(Math.random() * 30) + 60 // Start with a random value between 60-90

    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date()
      if (isHourly) {
        date.setHours(now.getHours() - (daysToGenerate - i - 1))
      } else if (isMonthly) {
        date.setMonth(now.getMonth() - (daysToGenerate - i - 1))
      } else {
        date.setDate(now.getDate() - (daysToGenerate - i - 1))
      }

      // Randomly adjust severity (trending downward overall)
      const change = Math.floor(Math.random() * 10) - 5
      severityValue = Math.max(10, Math.min(100, severityValue + change - 0.5))

      // Apply offset for comparison data
      const adjustedSeverity = Math.max(10, Math.min(100, severityValue + offset * 10))

      data.push({
        date: isHourly
          ? date.toLocaleTimeString([], { hour: "2-digit", hour12: false })
          : isMonthly
            ? date.toLocaleDateString([], { month: "short" })
            : date.toLocaleDateString([], { month: "short", day: "numeric" }),
        severity: adjustedSeverity,
        itching: Math.max(0, adjustedSeverity - Math.floor(Math.random() * 20)),
        redness: Math.max(0, adjustedSeverity - Math.floor(Math.random() * 15)),
        dryness: Math.max(0, adjustedSeverity - Math.floor(Math.random() * 25)),
      })
    }

    return data
  }

  const currentData = generateSeverityData()
  const previousData = generateSeverityData(1)

  // Treatment effectiveness data
  const treatmentData = [
    { name: "Hydrocortisone", effectiveness: 72 },
    { name: "Moisturizer", effectiveness: 85 },
    { name: "Antihistamines", effectiveness: 64 },
    { name: "Light Therapy", effectiveness: 78 },
    { name: "Dietary Changes", effectiveness: 58 },
    { name: "Stress Management", effectiveness: 67 },
  ]

  // Symptom frequency data
  const symptomData = [
    { symptom: "Itching", frequency: 95 },
    { symptom: "Redness", frequency: 88 },
    { symptom: "Dryness", frequency: 82 },
    { symptom: "Inflammation", frequency: 75 },
    { symptom: "Cracking", frequency: 62 },
    { symptom: "Bleeding", frequency: 45 },
    { symptom: "Pain", frequency: 58 },
  ]

  const COLORS = ["#0ea5e9", "#14b8a6", "#eab308", "#ef4444", "#8884d8", "#82ca9d"]

  const renderChart = () => {
    if (activeTab === "severity") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              formatter={(value) => [`${value}`, "Severity Score"]}
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
              dataKey="severity"
              name="Overall Severity"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
            />
            {comparisonMode && (
              <Line
                type="monotone"
                dataKey="severity"
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
              dataKey="itching"
              name="Itching"
              stroke="#eab308"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
            />
            <Line
              type="monotone"
              dataKey="redness"
              name="Redness"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
            />
            <Line
              type="monotone"
              dataKey="dryness"
              name="Dryness"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    } else if (activeTab === "treatments") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={treatmentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Effectiveness"]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="effectiveness" name="Treatment Effectiveness" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                  {treatmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={treatmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="effectiveness"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {treatmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Effectiveness"]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={symptomData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="symptom" type="category" />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Frequency"]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="frequency" name="Symptom Frequency" fill="#ef4444" radius={[0, 4, 4, 0]}>
                  {symptomData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.frequency > 80 ? "#ef4444" : entry.frequency > 60 ? "#eab308" : "#14b8a6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius={100} data={symptomData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="symptom" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Symptom Frequency" dataKey="frequency" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Frequency"]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    }
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Eczema Health Metrics
          </h2>
        </div>
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => setActiveTab("severity")}
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              activeTab === "severity" ? "bg-white text-teal-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Severity Tracking
          </button>
          <button
            onClick={() => setActiveTab("treatments")}
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              activeTab === "treatments" ? "bg-white text-teal-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Treatment Effectiveness
          </button>
          <button
            onClick={() => setActiveTab("symptoms")}
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              activeTab === "symptoms" ? "bg-white text-teal-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Symptom Analysis
          </button>
        </div>
      </div>
      <div className="p-6">
        {renderChart()}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Health Insights</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-teal-500 mr-2 mt-0.5" />
                <span>Overall eczema severity has decreased by 18% over the selected period</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-teal-500 mr-2 mt-0.5" />
                <span>Moisturizer shows the highest effectiveness among treatments</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-teal-500 mr-2 mt-0.5" />
                <span>Itching remains the most frequently reported symptom</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Treatment Recommendations</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                <span>Continue daily moisturizing routine with fragrance-free products</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                <span>Consider adding light therapy to your treatment plan based on effectiveness data</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                <span>Discuss antihistamine options with your doctor for itching relief</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Triggers & Patterns</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                <span>Flare-ups correlate with high stress periods (correlation: 0.78)</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                <span>Seasonal pattern detected with worsening in winter months</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                <span>Potential dietary trigger identified: dairy products</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

