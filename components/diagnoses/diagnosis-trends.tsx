"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
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
} from "recharts"
import type { Diagnosis } from "./diagnoses-page"

interface DiagnosisTrendsProps {
  diagnoses: Diagnosis[]
}

export default function DiagnosisTrends({ diagnoses }: DiagnosisTrendsProps) {
  const [activeChart, setActiveChart] = useState<"severity" | "symptoms" | "progress">("severity")

  // Sort diagnoses by date (oldest first for charts)
  const sortedDiagnoses = [...diagnoses].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Prepare data for severity chart
  const severityData = sortedDiagnoses.map((d) => ({
    date: d.date,
    severity: d.severity === "Mild" ? 1 : d.severity === "Moderate" ? 2 : 3,
    severityLabel: d.severity,
  }))

  // Prepare data for symptoms chart
  const symptomsData = sortedDiagnoses.map((d) => ({
    date: d.date,
    symptoms: d.symptoms.length,
  }))

  // Prepare data for progress chart
  const progressData = sortedDiagnoses.map((d) => ({
    date: d.date,
    progress: d.progress,
  }))

  // Prepare data for symptom distribution pie chart
  const allSymptoms = diagnoses.flatMap((d) => d.symptoms)
  const symptomCounts: Record<string, number> = {}
  allSymptoms.forEach((symptom) => {
    symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
  })
  const symptomDistribution = Object.entries(symptomCounts).map(([name, value]) => ({
    name,
    value,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 1:
        return "#10b981" // emerald-500
      case 2:
        return "#f59e0b" // amber-500
      case 3:
        return "#ef4444" // red-500
      default:
        return "#10b981"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trends & Analytics</h2>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => setActiveChart("severity")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeChart === "severity"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            Severity
          </button>
          <button
            onClick={() => setActiveChart("symptoms")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeChart === "symptoms"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            Symptoms
          </button>
          <button
            onClick={() => setActiveChart("progress")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeChart === "progress"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            Progress
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="h-[300px]">
          {activeChart === "severity" && (
            <motion.div
              key="severity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={severityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis
                    domain={[0, 4]}
                    ticks={[1, 2, 3]}
                    tickFormatter={(value) => {
                      return value === 1 ? "Mild" : value === 2 ? "Moderate" : value === 3 ? "Severe" : ""
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      return [value === 1 ? "Mild" : value === 2 ? "Moderate" : "Severe", "Severity"]
                    }}
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="severity"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{
                      r: 6,
                      strokeWidth: 2,
                      fill: "white",
                      stroke: (entry) => getSeverityColor(entry.severity),
                    }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {activeChart === "symptoms" && (
            <motion.div
              key="symptoms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={symptomsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "#e2e8f0",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="symptoms" name="Number of Symptoms" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={symptomDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {symptomDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "#e2e8f0",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeChart === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Progress"]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 6, strokeWidth: 2, fill: "white", stroke: "#10b981" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h3 className="font-medium mb-4">Insights & Recommendations</h3>
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-sky-600 dark:text-sky-400">Severity Trend</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {severityData[severityData.length - 1].severity < severityData[0].severity
                ? "Your eczema severity has improved over time. Continue with your current treatment plan."
                : severityData[severityData.length - 1].severity > severityData[0].severity
                  ? "Your eczema severity has worsened over time. Consider consulting with your doctor about adjusting your treatment plan."
                  : "Your eczema severity has remained stable. Continue monitoring and following your treatment plan."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-sky-600 dark:text-sky-400">Symptom Management</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {symptomDistribution.length > 0 &&
                `Your most common symptom is "${symptomDistribution.sort((a, b) => b.value - a.value)[0].name}". 
                Focus on managing this symptom with targeted treatments and lifestyle adjustments.`}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-sky-600 dark:text-sky-400">Treatment Effectiveness</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {progressData[progressData.length - 1].progress - progressData[0].progress > 20
                ? "Your treatment plan is showing significant effectiveness. Continue with the current regimen."
                : progressData[progressData.length - 1].progress - progressData[0].progress > 0
                  ? "Your treatment plan is showing some effectiveness. Consider discussing with your doctor about potential optimizations."
                  : "Your treatment plan may need adjustment. Schedule a consultation with your doctor to explore alternative options."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

