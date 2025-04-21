"use client"

import { useEffect, useState } from "react"
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
} from "recharts"
import { analyticsApi } from "@/services/analyticsService"
import type { TimeRange } from "./analytics-page"
import { Loader2 } from "lucide-react"

interface SurveyAnalyticsProps {
  timeRange: TimeRange
  dateRange: [Date, Date]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function SurveyAnalytics({ timeRange, dateRange }: SurveyAnalyticsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [surveyData, setSurveyData] = useState<any>(null)
  const [correlationData, setCorrelationData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [surveyResponse, correlationResponse] = await Promise.all([
          analyticsApi.getSurveyAnalytics({ start: dateRange[0], end: dateRange[1] }),
          analyticsApi.getCorrelationAnalytics({ start: dateRange[0], end: dateRange[1] })
        ])

        setSurveyData(surveyResponse)
        setCorrelationData(correlationResponse)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
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

  if (!surveyData || !correlationData) {
    return (
      <div className="text-center text-slate-500 p-4">
        <p>No analytics data available</p>
      </div>
    )
  }

  const { preDiagnosis, postDiagnosis } = surveyData

  return (
    <div className="space-y-8">
      {/* Pre-Diagnosis Survey Analytics */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pre-Diagnosis Survey Analytics</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Responses: {preDiagnosis.totalResponses}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Eczema History Distribution */}
            <div className="h-80">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Eczema History Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preDiagnosis.eczemaHistoryDistribution}
                    dataKey="count"
                    nameKey="history"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {preDiagnosis.eczemaHistoryDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Common Triggers */}
            <div className="h-80">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Common Triggers</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={preDiagnosis.commonTriggers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="trigger" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Severity Distribution */}
            <div className="h-80">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Severity Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preDiagnosis.severityDistribution}
                    dataKey="count"
                    nameKey="severity"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {preDiagnosis.severityDistribution.map((entry: any, index: number) => (
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
      </div>

      {/* Post-Diagnosis Survey Analytics */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Post-Diagnosis Survey Analytics</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Feedbacks: {postDiagnosis.totalFeedbacks}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Diagnosis Accuracy</h4>
              <p className="text-2xl font-semibold text-sky-600 mt-2">
                {(postDiagnosis.avgDiagnosisAccuracy * 100).toFixed(1)}%
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Helpfulness Rating</h4>
              <p className="text-2xl font-semibold text-emerald-600 mt-2">
                {(postDiagnosis.avgHelpfulness * 100).toFixed(1)}%
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Treatment Clarity</h4>
              <p className="text-2xl font-semibold text-amber-600 mt-2">
                {(postDiagnosis.avgTreatmentClarity * 100).toFixed(1)}%
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">User Confidence</h4>
              <p className="text-2xl font-semibold text-indigo-600 mt-2">
                {(postDiagnosis.avgUserConfidence * 100).toFixed(1)}%
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Recommendation Rate</h4>
              <p className="text-2xl font-semibold text-purple-600 mt-2">
                {(postDiagnosis.recommendationRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Correlation Analytics */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Correlation Analytics</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Severity vs. Accuracy & Confidence</p>

          <div className="h-80 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="severity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgAccuracy" name="Avg. Accuracy" fill="#0088FE" />
                <Bar dataKey="avgConfidence" name="Avg. Confidence" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
