"use client"

import { useState, useEffect } from "react"
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
import { adminService } from "@/services/adminService"

// Sample data
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AdminAnalytics() {
  const [users, setUsers] = useState<any[]>([])
  const [totalUsers, setTotalUsers] = useState<number|null>(null)
  const [activeDoctors, setActiveDoctors] = useState<number|null>(null)
  const [diagnoses, setDiagnoses] = useState<number|null>(null)
  const [systemUptime, setSystemUptime] = useState<number|null>(null)
  const [userActivityData, setUserActivityData] = useState<any[]>([])
  const [platformUsageData, setPlatformUsageData] = useState<any[]>([])
  const [doctorPerformanceData, setDoctorPerformanceData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    setLoading(true)
    adminService.getUsers().then(res => {
      setUsers(res.users || [])
      const doctors = (res.users || []).filter((u: any) => u.role === 'doctor')
      setActiveDoctors(doctors.length)
    })
    Promise.all([
      adminService.getTotalUsers(),
      adminService.getDiagnosesCount(),
      adminService.getSystemUptime(),
      adminService.getRecentActivity(),
      // adminService.getPlatformUsage(),
      // adminService.getDoctorPerformance(),
    ])
      .then(([usersRes, diagnosesRes, uptimeRes, activityRes, platformRes, performanceRes]) => {
        setTotalUsers(usersRes.totalUsers || usersRes.count || 0)
        setDiagnoses(diagnosesRes.count || 0)
        setSystemUptime(uptimeRes.systemUptime || uptimeRes.data || 0)
        setUserActivityData(activityRes.activities || activityRes.data || [])
        setPlatformUsageData(platformRes.usage || platformRes.data || [])
        setDoctorPerformanceData(performanceRes.performance || performanceRes.data || [])
      })
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              className={`px-3 py-2 text-sm rounded-l-lg ${true ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" : ""}`}
            >
              7D
            </button>
            <button
              className={`px-3 py-2 text-sm ${true ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" : ""}`}
            >
              30D
            </button>
            <button
              className={`px-3 py-2 text-sm ${true ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" : ""}`}
            >
              90D
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-r-lg ${true ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" : ""}`}
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
              <p className="text-3xl font-bold">{totalUsers ?? "-"}</p>
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
              <p className="text-3xl font-bold">{activeDoctors ?? "-"}</p>
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
              <p className="text-3xl font-bold">{diagnoses ?? "-"}</p>
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
              <p className="text-3xl font-bold">{systemUptime ?? "-"}</p>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
