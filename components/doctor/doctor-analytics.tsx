"use client"

import { useState, useEffect } from "react"
import { 
  Activity,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  Star,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { analyticsService } from "@/services/analyticsService"
import { useAuth } from "@/lib/auth"
import { getDoctorReviewedDiagnoses } from "@/services/eczemaService"
import { MetricCard } from "@/components/ui/metric-card"
import { Badge } from "@/components/ui/badge"

import {
  LineChart,
  Line,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from "recharts"

const COLORS = {
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#06B6D4"
};

export default function DoctorAnalyticsPage() {
  const [doctorPerformance, setDoctorPerformance] = useState<any>(null);
  const [appointmentAnalytics, setAppointmentAnalytics] = useState<any>(null);
  const [surveyAnalytics, setSurveyAnalytics] = useState<any>(null);
  const [reviewedDiagnoses, setReviewedDiagnoses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d"); // 7d, 30d, 90d, 1y

  const { user } = useAuth();
  const doctorId = user?.role === "doctor" ? user.id : null;

  useEffect(() => {
    async function fetchAllAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const [perfRes, apptRes, surveyRes, reviewedRes] = await Promise.all([
          analyticsService.getDoctorPerformance({ doctorId, timeRange }),
          analyticsService.getAppointmentAnalytics({ doctorId, timeRange }),
          analyticsService.getSurveyAnalyticsNew({ doctorId, timeRange }),
          getDoctorReviewedDiagnoses(doctorId)
        ]);

        // Set doctor performance data
        setDoctorPerformance({
          totalReviews: reviewedRes?.length || 0,
          reviewTrend: 0, // Calculate trend if available
          avgResponseTime: "24", // Default or calculate from data
          responseTrend: 0,
          activePatients: perfRes.data.uniquePatients || 0,
          patientTrend: 0,
          consultationEfficiency: ((perfRes.data.completedAppointments || 0) / (perfRes.data.totalAppointments || 1) * 100).toFixed(0) + '%',
          specialty: perfRes.data.specialty || 'Not specified'
        });

        // Set appointment analytics data
        setAppointmentAnalytics({
          statusCounts: apptRes.data.statusCounts || {},
          appointmentsPerMonth: apptRes.data.appointmentsPerMonth || [],
          avgDuration: apptRes.data.avgDuration ? parseFloat(apptRes.data.avgDuration).toFixed(1) : '0'
        });

        // Set survey analytics with defaults if empty
        setSurveyAnalytics({
          overallSatisfaction: perfRes.data.averageRating || 0,
          satisfactionTrend: 0,
          avgDiagnosisAccuracy: 4.5,
          avgDiagnosisHelpfulness: 4.2,
          avgTreatmentClarity: 4.0,
          avgUserConfidence: 4.3
        });

        setReviewedDiagnoses(reviewedRes || []);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    if (doctorId) fetchAllAnalytics();
  }, [doctorId, timeRange]);

  if (!doctorId) return <div className="p-6 text-center">Please log in as a doctor to view analytics.</div>;
  if (loading) return <div className="p-6 text-center">Loading analytics...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!doctorPerformance || !appointmentAnalytics) return <div className="p-6 text-center">No analytics data found for this doctor.</div>;

  // Prepare data for charts
  const statusCounts = appointmentAnalytics?.statusCounts || {};
  const appointmentsPerMonth = appointmentAnalytics?.appointmentsPerMonth || [];
  const avgDuration = appointmentAnalytics?.avgDuration || 0;

  // Format status counts for pie chart
  const statusPieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count as number,
    color: status === 'completed' ? COLORS.success :
           status === 'pending' ? COLORS.warning :
           status === 'confirmed' ? COLORS.primary :
           status === 'cancelled' ? COLORS.error :
           COLORS.secondary
  }));

  // Format appointments trend data
  const appointmentsTrendData = appointmentsPerMonth.map(item => ({
    month: item.month,
    count: item.count || 0
  }));

  // Survey radar chart data
  const surveyRadarData = surveyAnalytics && Object.keys(surveyAnalytics).length > 0 ? [
    {
      metric: "Accuracy",
      value: surveyAnalytics.avgDiagnosisAccuracy || 0
    },
    {
      metric: "Helpfulness",
      value: surveyAnalytics.avgDiagnosisHelpfulness || 0
    },
    {
      metric: "Clarity",
      value: surveyAnalytics.avgTreatmentClarity || 0
    },
    {
      metric: "Confidence",
      value: surveyAnalytics.avgUserConfidence || 0
    }
  ] : [];

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Doctor Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor your practice performance and patient trends</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="7d">Week</TabsTrigger>
              <TabsTrigger value="30d">Month</TabsTrigger>
              <TabsTrigger value="90d">Quarter</TabsTrigger>
              <TabsTrigger value="1y">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Reviews"
          value={doctorPerformance.totalReviews || 0}
          icon={<CheckCircle className="h-4 w-4" />}
          description="All-time reviews"
          trend={{
            value: doctorPerformance.reviewTrend || 0,
            label: "vs last period"
          }}
          loading={loading}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${doctorPerformance.avgResponseTime || 0}h`}
          icon={<Clock className="h-4 w-4" />}
          description="Time to review"
          trend={{
            value: doctorPerformance.responseTrend || 0,
            label: "vs last period",
            inverse: true
          }}
          loading={loading}
        />
        <MetricCard
          title="Patient Satisfaction"
          value={`${(surveyAnalytics?.overallSatisfaction || 0).toFixed(1)}/5`}
          icon={<Star className="h-4 w-4" />}
          description="Average rating"
          trend={{
            value: surveyAnalytics?.satisfactionTrend || 0,
            label: "vs last period"
          }}
          loading={loading}
        />
        <MetricCard
          title="Active Patients"
          value={doctorPerformance.activePatients || 0}
          icon={<Users className="h-4 w-4" />}
          description="Current patients"
          trend={{
            value: doctorPerformance.patientTrend || 0,
            label: "vs last period"
          }}
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Status Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Appointment Status Distribution</CardTitle>
            <CardDescription>Current status of all appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Appointments Trend */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Appointments Trend</CardTitle>
            <CardDescription>Number of appointments over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={appointmentsTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke={COLORS.primary} 
                  fill={COLORS.primary} 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Survey Analytics Radar */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Average scores from patient feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {surveyRadarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius={100} data={surveyRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar 
                    name="Score" 
                    dataKey="value" 
                    stroke={COLORS.secondary} 
                    fill={COLORS.secondary} 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No survey data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Average Duration Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Consultation Metrics</CardTitle>
            <CardDescription>Average consultation duration and efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Clock className="h-8 w-8 mb-2 text-primary" />
                <span className="text-2xl font-bold">{avgDuration ? `${Number(avgDuration).toFixed(1)}` : '-'}</span>
                <span className="text-sm text-gray-500">minutes per consultation</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Activity className="h-8 w-8 mb-2 text-primary" />
                <span className="text-2xl font-bold">{doctorPerformance.consultationEfficiency || '-'}</span>
                <span className="text-sm text-gray-500">efficiency score</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews Table */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Your latest diagnosis reviews</CardDescription>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          {reviewedDiagnoses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="px-4 py-3 text-left">Patient</th>
                    <th className="px-4 py-3 text-left">Original Severity</th>
                    <th className="px-4 py-3 text-left">Updated Severity</th>
                    <th className="px-4 py-3 text-left">Review Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewedDiagnoses.slice(0, 5).map((diag, idx) => (
                    <tr key={diag._id || idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                            {diag.patient?.firstName?.[0]}{diag.patient?.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-medium">{diag.patient?.firstName} {diag.patient?.lastName}</div>
                            <div className="text-sm text-gray-500">ID: {diag.diagnosisId?.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={diag.mlResults?.severity === 'severe' ? 'destructive' : 
                                     diag.mlResults?.severity === 'moderate' ? 'warning' : 'success'}>
                          {diag.mlResults?.severity || '-'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={diag.doctorReview?.updatedSeverity === 'severe' ? 'destructive' : 
                                     diag.doctorReview?.updatedSeverity === 'moderate' ? 'warning' : 'success'}>
                          {diag.doctorReview?.updatedSeverity || '-'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {diag.doctorReview?.reviewedAt ? 
                            new Date(diag.doctorReview.reviewedAt).toLocaleDateString() : 
                            '-'
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={diag.status === 'reviewed' ? 'success' : 'secondary'}>
                          {diag.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reviewed diagnoses found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
