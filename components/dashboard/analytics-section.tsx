"use client"

import { ArrowUpRight, BarChart3, LineChart, PieChart, Activity, Target, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "@/components/ui/metric-card"
import { useEffect, useState } from "react"
import { analyticsService } from "@/services/analyticsService"
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar, Tooltip } from "recharts"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function AnalyticsSection() {
  const [summary, setSummary] = useState<any>(null)
  const [bodyPartFreq, setBodyPartFreq] = useState<any[]>([])
  const [confidenceTrend, setConfidenceTrend] = useState<any[]>([])
  const [recentDiagnoses, setRecentDiagnoses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [summaryData, bodyPartData, confidenceData, diagnosesData] = await Promise.all([
          analyticsService.getPatientSummary(),
          analyticsService.getPatientBodyPartFrequency(),
          analyticsService.getPatientModelConfidenceTrend(),
          analyticsService.getPatientRecentDiagnoses()
        ])

        setSummary(summaryData)
        setBodyPartFreq(bodyPartData)
        setConfidenceTrend(confidenceData)
        setRecentDiagnoses(diagnosesData)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Analytics & Insights</CardTitle>
          <CardDescription>Loading your analytics data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Analytics & Insights</CardTitle>
        <CardDescription>Trends and patterns in your eczema condition</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="Total Diagnoses"
            value={summary?.totalDiagnoses || 0}
            description="All-time diagnoses"
            icon={<Activity className="h-4 w-4" />}
          />
          <MetricCard
            title="Model Confidence"
            value={`${((summary?.averageModelConfidence || 0) * 100).toFixed(1)}%`}
            description="Average confidence score"
            icon={<Target className="h-4 w-4" />}
          />
          <MetricCard
            title="Most Common Severity"
            value={summary?.mostCommonSeverity || 'N/A'}
            description="Based on ML analysis"
            icon={<AlertCircle className="h-4 w-4" />}
          />
        </div>

        {/* Body Part Frequency Chart */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Most Affected Areas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bodyPartFreq}>
              <XAxis dataKey="bodyPart" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Diagnoses */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Diagnoses</h3>
          <div className="space-y-4">
            {recentDiagnoses.slice(0, 3).map((diagnosis) => (
              <div key={diagnosis.diagnosisId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{format(new Date(diagnosis.createdAt), 'PP')}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant={
                        diagnosis.mlResults.severity === 'severe' ? 'destructive' :
                        diagnosis.mlResults.severity === 'moderate' ? 'warning' :
                        'secondary'
                      }>
                        {diagnosis.mlResults.severity}
                      </Badge>
                      <span className="text-sm text-muted-foreground ml-2">
                        {(diagnosis.mlResults.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {diagnosis.mlResults.affectedAreas.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-10 w-10 text-sky-500 mr-4" />
            <div>
              <h4 className="font-medium">Detailed Analytics</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">View comprehensive reports and trends</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors">
            View Reports
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
