"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, TrendingUp, Clock, Download, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { analyticsService } from "@/services/analyticsService"
import { useAuth } from "@/lib/auth"
import { getDoctorReviewedDiagnoses } from "@/services/eczemaService";

// Import chart components
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
  Radar
} from "recharts"

export default function DoctorAnalyticsPage() {
  const [doctorPerformance, setDoctorPerformance] = useState<any>(null);
  const [appointmentAnalytics, setAppointmentAnalytics] = useState<any>(null);
  const [surveyAnalytics, setSurveyAnalytics] = useState<any>(null);
  const [reviewedDiagnoses, setReviewedDiagnoses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the authenticated user from the auth context
  const { user } = useAuth();
  const doctorId = user?.role === "doctor" ? user.id : null;

  useEffect(() => {
    async function fetchAllAnalytics() {
      setLoading(true);
      setError(null);
      try {
        // Fetch each analytics endpoint
        const [perfRes, apptRes, surveyRes, reviewedRes] = await Promise.all([
          analyticsService.getDoctorPerformance({ doctorId }),
          analyticsService.getAppointmentAnalytics({ doctorId }),
          analyticsService.getSurveyAnalyticsNew({ doctorId }),
          getDoctorReviewedDiagnoses(doctorId)
        ]);
        setDoctorPerformance(perfRes.data);
        setAppointmentAnalytics(apptRes.data);
        setSurveyAnalytics(surveyRes.data);
        setReviewedDiagnoses(reviewedRes);
      } catch (err: any) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    if (doctorId) fetchAllAnalytics();
  }, [doctorId]);

  if (!doctorId) return <div>Please log in as a doctor to view analytics.</div>;
  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>{error}</div>;
  if (!doctorPerformance || !appointmentAnalytics) return <div>No analytics data found for this doctor.</div>;

  // Prepare data for charts
  const statusCounts = appointmentAnalytics.statusCounts || {};
  const appointmentsPerMonth = appointmentAnalytics.appointmentsPerMonth || [];
  const avgDuration = appointmentAnalytics.avgDuration;

  // Pie chart data
  const statusPieData = Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }));

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
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctor Analytics</h1>
          <p className="text-muted-foreground">Monitor your practice performance and patient trends</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                <h3 className="text-2xl font-bold mt-1">{doctorPerformance.totalAppointments}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Appointments</p>
                <h3 className="text-2xl font-bold mt-1">{doctorPerformance.completedAppointments}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Patients</p>
                <h3 className="text-2xl font-bold mt-1">{doctorPerformance.uniquePatients}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <h3 className="text-2xl font-bold mt-1">{doctorPerformance.averageRating || '-'}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Status Pie Chart & Appointments Per Month Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appointments Per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={appointmentsPerMonth} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Survey Analytics Radar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Survey Metrics</CardTitle>
            <CardDescription>Average scores from patient surveys</CardDescription>
          </CardHeader>
          <CardContent>
            {surveyRadarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius={100} data={surveyRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar name="Average" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p>No survey data available.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Appointment Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-4xl font-bold">{avgDuration ? `${Number(avgDuration).toFixed(1)} min` : '-'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviewed Diagnoses Table */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Reviewed Diagnoses</CardTitle>
            <CardDescription>List of all diagnoses you have reviewed</CardDescription>
          </CardHeader>
          <CardContent>
            {reviewedDiagnoses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Diagnosis ID</th>
                      <th className="px-4 py-2 text-left">Patient</th>
                      <th className="px-4 py-2 text-left">Reviewed At</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewedDiagnoses.map((diag, idx) => (
                      <tr key={diag._id || idx} className="border-b">
                        <td className="px-4 py-2">{diag.diagnosisId || diag._id}</td>
                        <td className="px-4 py-2">{diag.patient?.firstName} {diag.patient?.lastName}</td>
                        <td className="px-4 py-2">{diag.doctorReview?.reviewedAt ? new Date(diag.doctorReview.reviewedAt).toLocaleString() : '-'}</td>
                        <td className="px-4 py-2">{diag.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No reviewed diagnoses found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
