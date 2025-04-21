"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { analyticsService } from "@/services/analyticsService"
import type { TimeRange } from "./analytics-page"

interface EngagementAnalyticsProps {
  timeRange: TimeRange
  dateRange: [Date, Date]
}

interface EngagementData {
  dailyActiveUsers: Array<{
    date: string
    count: number
  }>
  diagnosisDistribution: Array<{
    hour: number
    count: number
  }>
  userRetention: Array<{
    week: string
    retained: number
    total: number
  }>
  userActivity: Array<{
    date: string
    diagnoses: number
    messages: number
    appointments: number
  }>
}

export default function EngagementAnalytics({ timeRange, dateRange }: EngagementAnalyticsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<EngagementData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [dailyUsers, hourlyDiagnoses, retentionData, activityData] = await Promise.all([
          analyticsService.getDailyActiveUsers({ start: dateRange[0], end: dateRange[1] }),
          analyticsService.getHourlyDiagnosisDistribution({ start: dateRange[0], end: dateRange[1] }),
          analyticsService.getUserRetention({ start: dateRange[0], end: dateRange[1] }),
          analyticsService.getUserActivity({ start: dateRange[0], end: dateRange[1] })
        ])

        setData({
          dailyActiveUsers: dailyUsers,
          diagnosisDistribution: hourlyDiagnoses,
          userRetention: retentionData,
          userActivity: activityData
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch engagement data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange, dateRange])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center text-slate-500 p-4">
        <p>No engagement data available</p>
      </div>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatHour = (hour: number) => {
    return `${hour}:00`
  }

  const formatRetentionRate = (retained: number, total: number) => {
    return total === 0 ? 0 : Math.round((retained / total) * 100)
  }

  return (
    <div className="space-y-8">
      {/* Daily Active Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Daily Active Users</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyActiveUsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6',
                }}
                labelFormatter={formatDate}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Active Users"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Hourly Diagnosis Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Diagnosis Distribution by Hour
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.diagnosisDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="hour"
                tickFormatter={formatHour}
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6',
                }}
                labelFormatter={formatHour}
              />
              <Bar dataKey="count" name="Diagnoses" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* User Retention */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">User Retention</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.userRetention}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#6B7280" tick={{ fill: '#6B7280' }} />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6',
                }}
                formatter={(value: any, name: string) =>
                  name === 'Retention Rate' ? `${value}%` : value
                }
              />
              <Line
                type="monotone"
                dataKey={(data) => formatRetentionRate(data.retained, data.total)}
                name="Retention Rate"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* User Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">User Activity</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.userActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6',
                }}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="diagnoses"
                name="Diagnoses"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="messages"
                name="Messages"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="appointments"
                name="Appointments"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
