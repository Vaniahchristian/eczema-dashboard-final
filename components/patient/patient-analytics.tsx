"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  TrendingUp, 
  Activity,
  Target,
  BarChart2,
  PieChart as PieChartIcon,
  Clock
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { MetricCard } from "@/components/ui/metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { analyticsService } from "@/services/analyticsService";
import type { PatientSummary, BodyPartFrequency, ConfidenceTrend, RecentDiagnosis } from "@/services/analyticsService";

const COLORS = {
  mild: "#10B981",
  moderate: "#F59E0B",
  severe: "#EF4444",
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  accent: "#EC4899"
};

const PatientAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<PatientSummary | null>(null);
  const [bodyPartFreq, setBodyPartFreq] = useState<BodyPartFrequency[]>([]);
  const [confidenceTrend, setConfidenceTrend] = useState<ConfidenceTrend[]>([]);
  const [recentDiagnoses, setRecentDiagnoses] = useState<RecentDiagnosis[]>([]);
  const [severityDist, setSeverityDist] = useState<{ _id: string; count: number; }[]>([]);
  const [avgConfBySeverity, setAvgConfBySeverity] = useState<{ _id: string; avgConfidence: number; count: number; }[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const [
          summaryData,
          bodyPartData,
          confidenceData,
          diagnosesData,
          severityData,
          avgConfData
        ] = await Promise.all([
          analyticsService.getPatientSummary(),
          analyticsService.getPatientBodyPartFrequency(),
          analyticsService.getPatientModelConfidenceTrend(),
          analyticsService.getPatientRecentDiagnoses(),
          analyticsService.getPatientSeverityDistribution(),
          analyticsService.getPatientAvgConfidenceBySeverity()
        ]);

        setSummary(summaryData);
        setBodyPartFreq(bodyPartData);
        setConfidenceTrend(confidenceData);
        setRecentDiagnoses(diagnosesData);
        setSeverityDist(severityData);
        setAvgConfBySeverity(avgConfData);
      } catch (err) {
        setError("Failed to fetch analytics data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-red-500">
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Diagnoses"
            value={summary?.totalDiagnoses ?? 0}
            icon={<Activity className="h-4 w-4" />}
            description="All-time diagnoses"
            loading={isLoading}
          />
          <MetricCard
            title="Avg. Confidence"
            value={summary?.averageModelConfidence ? `${(summary.averageModelConfidence * 100).toFixed(1)}%` : "N/A"}
            icon={<Target className="h-4 w-4" />}
            description="Model confidence"
            loading={isLoading}
          />
          <MetricCard
            title="Common Severity"
            value={summary?.mostCommonSeverity ?? "N/A"}
            icon={<BarChart2 className="h-4 w-4" />}
            description="Most frequent"
            loading={isLoading}
          />
          <MetricCard
            title="Recent Updates"
            value={recentDiagnoses.length}
            icon={<Clock className="h-4 w-4" />}
            description="Last 10 diagnoses"
            loading={isLoading}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Distribution */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Severity Distribution</CardTitle>
              <CardDescription>Distribution of diagnoses by severity level</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={severityDist}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {severityDist.map((entry) => (
                        <Cell key={entry._id} fill={COLORS[entry._id as keyof typeof COLORS] || COLORS.primary} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Body Part Frequency */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Body Part Distribution</CardTitle>
              <CardDescription>Frequency of affected body parts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bodyPartFreq}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bodyPart" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.primary}>
                      {bodyPartFreq.map((entry, index) => (
                        <Cell key={entry.bodyPart} fill={COLORS[Object.keys(COLORS)[index % 6] as keyof typeof COLORS]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Confidence Trend */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Model Confidence Trend</CardTitle>
              <CardDescription>AI model confidence over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={confidenceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
                    <Area type="monotone" dataKey="confidence" fill={COLORS.primary} stroke={COLORS.primary} fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Average Confidence by Severity */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Confidence by Severity</CardTitle>
              <CardDescription>Average model confidence for each severity level</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={avgConfBySeverity} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <YAxis dataKey="_id" type="category" />
                    <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
                    <Bar dataKey="avgConfidence" fill={COLORS.secondary}>
                      {avgConfBySeverity.map((entry) => (
                        <Cell key={entry._id} fill={COLORS[entry._id as keyof typeof COLORS] || COLORS.secondary} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Diagnoses Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Diagnoses</CardTitle>
            <CardDescription>Your latest diagnosis records</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : recentDiagnoses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Body Part</th>
                      <th className="px-4 py-3 text-left">Severity</th>
                      <th className="px-4 py-3 text-left">Confidence</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Doctor Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDiagnoses.map((diagnosis) => (
                      <tr key={diagnosis.diagnosisId} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3">{new Date(diagnosis.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{diagnosis.bodyPart}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            diagnosis.severity === 'severe' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            diagnosis.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {diagnosis.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3">{(diagnosis.confidence * 100).toFixed(1)}%</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            diagnosis.status === 'reviewed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {diagnosis.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {diagnosis.doctorReview?.updatedSeverity ? (
                            <span className="text-blue-600 dark:text-blue-400">
                              Updated to {diagnosis.doctorReview.updatedSeverity}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent diagnoses found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientAnalytics;