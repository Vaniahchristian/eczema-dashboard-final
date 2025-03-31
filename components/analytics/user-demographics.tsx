"use client"

import { useState } from "react"
import { Users, ArrowRight } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import type { TimeRange } from "./analytics-page"

interface UserDemographicsProps {
  timeRange: TimeRange
  dateRange: [Date, Date]
  isLoading: boolean
}

export default function UserDemographics({ timeRange, dateRange, isLoading }: UserDemographicsProps) {
  const [activeTab, setActiveTab] = useState<"age" | "location" | "devices">("age")

  // Sample data - in a real app, this would come from an API
  const ageData = [
    { name: "0-12", value: 15 },
    { name: "13-17", value: 12 },
    { name: "18-24", value: 18 },
    { name: "25-34", value: 25 },
    { name: "35-44", value: 20 },
    { name: "45-54", value: 15 },
    { name: "55+", value: 10 },
  ]

  const locationData = [
    { name: "North America", value: 45 },
    { name: "Europe", value: 30 },
    { name: "Asia", value: 15 },
    { name: "Australia", value: 5 },
    { name: "Other", value: 5 },
  ]

  const deviceData = [
    { name: "Mobile", value: 65 },
    { name: "Desktop", value: 25 },
    { name: "Tablet", value: 10 },
  ]

  const COLORS = ["#0ea5e9", "#14b8a6", "#eab308", "#ef4444", "#8884d8", "#82ca9d", "#a855f7"]

  const renderChart = () => {
    if (activeTab === "age") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value}%`, "Users"]}
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e2e8f0",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="value" name="Age Distribution" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
              {ageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    } else if (activeTab === "location") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={locationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {locationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, "Users"]}
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
      )
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {deviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, "Users"]}
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
      )
    }
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 h-full ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5" />
            User Demographics
          </h2>
        </div>
        <div className="flex space-x-2 mt-3">
          <button
            onClick={() => setActiveTab("age")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              activeTab === "age" ? "bg-white text-violet-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Age Groups
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              activeTab === "location" ? "bg-white text-violet-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Locations
          </button>
          <button
            onClick={() => setActiveTab("devices")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              activeTab === "devices" ? "bg-white text-violet-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Devices
          </button>
        </div>
      </div>
      <div className="p-4">
        {renderChart()}

        <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Key Demographics Insights</h3>
          <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start">
              <ArrowRight className="h-3 w-3 text-violet-500 mr-1 mt-0.5" />
              <span>Largest user group is 25-34 year olds (25%)</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-3 w-3 text-violet-500 mr-1 mt-0.5" />
              <span>Mobile usage dominates at 65% of all sessions</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-3 w-3 text-violet-500 mr-1 mt-0.5" />
              <span>North America represents the largest user base (45%)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

