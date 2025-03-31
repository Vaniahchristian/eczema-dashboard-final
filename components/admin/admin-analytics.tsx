"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, Download, Filter, RefreshCw, Users } from "lucide-react"

// Sample data
const userActivityData = [
  { name: "Jan", active: 4000, new: 2400 },
  { name: "Feb", active: 3000, new: 1398 },
  { name: "Mar", active: 2000, new: 9800 },
  { name: "Apr", active: 2780, new: 3908 },
  { name: "May", active: 1890, new: 4800 },
  { name: "Jun", active: 2390, new: 3800 },
  { name: "Jul", active: 3490, new: 4300 },
]

const diagnosisData = [
  { name: "Mild", value: 400 },
  { name: "Moderate", value: 300 },
  { name: "Severe", value: 200 },
  { name: "Very Severe", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const platformUsageData = [
  { name: "Web", users: 4000 },
  { name: "iOS", users: 3000 },
  { name: "Android", users: 2000 },
]

const doctorPerformanceData = [
  { name: "Dr. Smith", patients: 100, satisfaction: 95 },
  { name: "Dr. Johnson", patients: 85, satisfaction: 90 },
  { name: "Dr. Williams", patients: 70, satisfaction: 88 },
  { name: "Dr. Brown", patients: 65, satisfaction: 92 },
  { name: "Dr. Jones", patients: 60, satisfaction: 85 },
]

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              className={`px-3 py-2 text-sm rounded-l-lg ${timeRange === "7d" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" : ""}`}
              onClick={() => setTimeRange("7d")}
            >
              7D
            </button>
            <button
              className={`px-3 py-2 text-sm ${timeRange === "30d" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" : ""}`}
              onClick={() => setTimeRange("30d")}
            >
              30D
            </button>
            <button
              className={`px-3 py-2 text-sm ${timeRange === "90d" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" : ""}`}
              onClick={() => setTimeRange("90d")}
            >
              90D
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-r-lg ${timeRange === "1y" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" : ""}`}
              onClick={() => setTimeRange("1y")}
            >
              1Y
            </button>
          </div>
          <button className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition-colors">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">12,543</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <span className="mr-1">↑</span> 12.5% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Doctors</h3>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">1,247</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <span className="mr-1">↑</span> 8.3% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Diagnoses</h3>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">35,892</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <span className="mr-1">↑</span> 23.1% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">System Uptime</h3>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">99.98%</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <span className="mr-1">↑</span> 0.1% from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">User Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="new" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Diagnosis Severity Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diagnosisData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {diagnosisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Platform Usage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformUsageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Doctor Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doctorPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="patients" fill="#8884d8" />
                <Bar dataKey="satisfaction" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

