"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, TrendingUp, Clock, CheckCircle, Download } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { analyticsService } from "@/services/analyticsService"
import type { 
  AgeDistribution, 
  GeographicalDistribution, 
  TreatmentEffectiveness,
  ModelConfidence,
  DiagnosisHistory 
} from "@/services/analyticsService"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const healthMetricsData = [
  { date: "Jan", severity: 7.2, itching: 6.8, redness: 7.5, dryness: 6.5 },
  { date: "Feb", severity: 6.8, itching: 6.5, redness: 7.0, dryness: 6.2 },
  { date: "Mar", severity: 6.5, itching: 6.0, redness: 6.8, dryness: 5.8 },
  { date: "Apr", severity: 5.8, itching: 5.5, redness: 6.0, dryness: 5.5 },
  { date: "May", severity: 5.2, itching: 5.0, redness: 5.5, dryness: 5.0 },
  { date: "Jun", severity: 4.8, itching: 4.5, redness: 5.0, dryness: 4.8 },
  { date: "Jul", severity: 4.2, itching: 4.0, redness: 4.5, dryness: 4.2 },
  { date: "Aug", severity: 3.8, itching: 3.5, redness: 4.0, dryness: 3.8 },
  { date: "Sep", severity: 3.5, itching: 3.2, redness: 3.8, dryness: 3.5 },
]

const appointmentData = [
  {
    id: 1,
    date: "2023-10-15",
    doctor: "Dr. Emily Chen",
    type: "Regular Checkup",
    status: "Completed",
    notes: "Patient showing improvement. Continue current treatment plan.",
  },
  {
    id: 2,
    date: "2023-11-02",
    doctor: "Dr. James Wilson",
    type: "Dermatology Consultation",
    status: "Completed",
    notes: "Adjusted medication dosage. Follow up in 3 weeks.",
  },
  {
    id: 3,
    date: "2023-12-10",
    doctor: "Dr. Emily Chen",
    type: "Follow-up",
    status: "Completed",
    notes: "Significant improvement in symptoms. Continue treatment.",
  },
  {
    id: 4,
    date: "2024-01-05",
    doctor: "Dr. Sarah Johnson",
    type: "Allergy Testing",
    status: "Completed",
    notes: "Identified potential food triggers. Recommended elimination diet.",
  },
  {
    id: 5,
    date: "2024-02-20",
    doctor: "Dr. Emily Chen",
    type: "Regular Checkup",
    status: "Completed",
    notes: "Continued improvement. Reduced medication frequency.",
  },
  {
    id: 6,
    date: "2024-03-15",
    doctor: "Dr. James Wilson",
    type: "Dermatology Consultation",
    status: "Upcoming",
    notes: "",
  },
]

const treatmentData = [
  { name: "Topical Steroids", progress: 85, status: "Active" },
  { name: "Moisturizing Routine", progress: 92, status: "Active" },
  { name: "Trigger Avoidance", progress: 78, status: "Active" },
  { name: "Dietary Changes", progress: 65, status: "Active" },
  { name: "Antihistamines", progress: 90, status: "Completed" },
  { name: "Light Therapy", progress: 100, status: "Completed" },
]

const medicationAdherenceData = [
  { date: "Week 1", adherence: 85 },
  { date: "Week 2", adherence: 90 },
  { date: "Week 3", adherence: 88 },
  { date: "Week 4", adherence: 92 },
  { date: "Week 5", adherence: 95 },
  { date: "Week 6", adherence: 93 },
  { date: "Week 7", adherence: 97 },
  { date: "Week 8", adherence: 98 },
]

const triggerData = [
  { name: "Stress", value: 35 },
  { name: "Food Allergies", value: 25 },
  { name: "Environmental", value: 20 },
  { name: "Weather", value: 15 },
  { name: "Other", value: 5 },
]

export default function PatientAnalytics() {
  const [timeRange, setTimeRange] = useState("6m")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Analytics states
  const [ageDistribution, setAgeDistribution] = useState<AgeDistribution[]>([])
  const [geoDistribution, setGeoDistribution] = useState<GeographicalDistribution[]>([])
  const [treatmentEffectiveness, setTreatmentEffectiveness] = useState<TreatmentEffectiveness[]>([])
  const [modelConfidence, setModelConfidence] = useState<ModelConfidence[]>([])
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistory[]>([])

  const handleTimeRangeChange = async (value: string) => {
    setTimeRange(value)
    setIsLoading(true)
    
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(new Date().setMonth(new Date().getMonth() - parseInt(value))).toISOString().split('T')[0]
      
      const history = await analyticsService.getDiagnosisHistory(startDate, endDate)
      setDiagnosisHistory(history)
    } catch (err) {
      setError('Failed to fetch updated diagnosis history')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const [age, geo, treatment, confidence, history] = await Promise.all([
          analyticsService.getAgeDistribution(),
          analyticsService.getGeographicalDistribution(),
          analyticsService.getTreatmentEffectiveness(),
          analyticsService.getModelConfidence(),
          analyticsService.getDiagnosisHistory()
        ])

        setAgeDistribution(age)
        setGeoDistribution(geo)
        setTreatmentEffectiveness(treatment)
        setModelConfidence(confidence)
        setDiagnosisHistory(history)
      } catch (err) {
        setError('Failed to fetch analytics data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">
                <p>{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last Month</SelectItem>
                <SelectItem value="3">Last 3 Months</SelectItem>
                <SelectItem value="6">Last 6 Months</SelectItem>
                <SelectItem value="12">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="treatments">Treatments</TabsTrigger>
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Diagnoses</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading ? "..." : diagnosisHistory.reduce((sum, item) => sum + item.totalCases, 0)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Severity</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading ? "..." : (
                        diagnosisHistory.reduce((sum, item) => 
                          sum + (item.severeCases / item.totalCases), 0) / diagnosisHistory.length
                      ).toFixed(1)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Treatment Success Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading ? "..." : 
                        `${(treatmentEffectiveness.reduce((sum, item) => 
                          sum + item.effectiveness, 0) / treatmentEffectiveness.length).toFixed(1)}%`
                      }
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ML Confidence</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading ? "..." : 
                        `${(modelConfidence.reduce((sum, item) => 
                          sum + item.averageConfidence, 0) / modelConfidence.length * 100).toFixed(1)}%`
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Diagnosis History</CardTitle>
                    <CardDescription>Number of cases over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={diagnosisHistory}>
                          <defs>
                            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="totalCases"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="url(#total)"
                          />
                          <Area
                            type="monotone"
                            dataKey="severeCases"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fill="url(#severe)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Age Distribution</CardTitle>
                    <CardDescription>Cases by age group</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageDistribution}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="ageRange" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Treatment Effectiveness</CardTitle>
                    <CardDescription>Success rate by treatment type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={treatmentEffectiveness} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="type" type="category" />
                          <Tooltip />
                          <Bar dataKey="effectiveness" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Geographical Distribution</CardTitle>
                    <CardDescription>Cases by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={geoDistribution}
                            dataKey="count"
                            nameKey="location"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {geoDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Health Metrics Tab */}
            <TabsContent value="health-metrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eczema Symptom Progression</CardTitle>
                  <CardDescription>Track how your symptoms have changed over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthMetricsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            borderColor: "#e2e8f0",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="severity"
                          name="Overall Severity"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8, strokeWidth: 2, fill: "white" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="itching"
                          name="Itching"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8, strokeWidth: 2, fill: "white" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="redness"
                          name="Redness"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8, strokeWidth: 2, fill: "white" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="dryness"
                          name="Dryness"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8, strokeWidth: 2, fill: "white" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Affected Body Areas</CardTitle>
                    <CardDescription>Current distribution of eczema on your body</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Arms</span>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Legs</span>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Neck</span>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Face</span>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                        <Progress value={10} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Hands</span>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Medication Adherence</CardTitle>
                    <CardDescription>How consistently you've followed your medication plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={medicationAdherenceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="adherence"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorAdherence)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment History</CardTitle>
                  <CardDescription>Record of your past and upcoming doctor visits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                      <div className="col-span-2">Date</div>
                      <div className="col-span-2">Doctor</div>
                      <div className="col-span-3">Type</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-4">Notes</div>
                    </div>
                    <div className="divide-y">
                      {appointmentData.map((appointment) => (
                        <div key={appointment.id} className="grid grid-cols-12 p-4 text-sm">
                          <div className="col-span-2 font-medium">{appointment.date}</div>
                          <div className="col-span-2">{appointment.doctor}</div>
                          <div className="col-span-3">{appointment.type}</div>
                          <div className="col-span-1">
                            {appointment.status === "Completed" ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                Upcoming
                              </span>
                            )}
                          </div>
                          <div className="col-span-4 text-slate-500 dark:text-slate-400">
                            {appointment.notes || "No notes available"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Frequency</CardTitle>
                    <CardDescription>Number of appointments by month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { month: "Oct", count: 1 },
                            { month: "Nov", count: 1 },
                            { month: "Dec", count: 1 },
                            { month: "Jan", count: 1 },
                            { month: "Feb", count: 1 },
                            { month: "Mar", count: 1 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="month" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" name="Appointments" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Types</CardTitle>
                    <CardDescription>Distribution of appointment types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Regular Checkup", value: 2 },
                              { name: "Dermatology Consultation", value: 2 },
                              { name: "Follow-up", value: 1 },
                              { name: "Allergy Testing", value: 1 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: "Regular Checkup", value: 2 },
                              { name: "Dermatology Consultation", value: 2 },
                              { name: "Follow-up", value: 1 },
                              { name: "Allergy Testing", value: 1 },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Treatment Plan Tab */}
            <TabsContent value="treatment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Treatment Plan Progress</CardTitle>
                  <CardDescription>Track your progress with prescribed treatments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {treatmentData.map((treatment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{treatment.name}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{treatment.status}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{treatment.progress}%</span>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {treatment.status === "Completed" ? "Completed" : "In Progress"}
                            </p>
                          </div>
                        </div>
                        <Progress
                          value={treatment.progress}
                          className={`h-2 ${treatment.status === "Completed" ? "[&>div]:bg-green-500" : "[&>div]:bg-blue-500"}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Treatment Effectiveness</CardTitle>
                    <CardDescription>How each treatment has contributed to your improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={[
                            { name: "Topical Steroids", effectiveness: 75 },
                            { name: "Moisturizing", effectiveness: 85 },
                            { name: "Trigger Avoidance", effectiveness: 70 },
                            { name: "Dietary Changes", effectiveness: 60 },
                            { name: "Antihistamines", effectiveness: 65 },
                          ]}
                          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip />
                          <Bar dataKey="effectiveness" name="Effectiveness %" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Treatment Timeline</CardTitle>
                    <CardDescription>When treatments were started and completed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-12 text-xs text-slate-500 dark:text-slate-400">Oct 2023</div>
                        <div className="ml-2 h-4 w-4 rounded-full bg-blue-500"></div>
                        <div className="ml-2 text-sm">Started Topical Steroids</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 text-xs text-slate-500 dark:text-slate-400">Oct 2023</div>
                        <div className="ml-2 h-4 w-4 rounded-full bg-blue-500"></div>
                        <div className="ml-2 text-sm">Started Moisturizing Routine</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 text-xs text-slate-500 dark:text-slate-400">Nov 2023</div>
                        <div className="ml-2 h-4 w-4 rounded-full bg-blue-500"></div>
                        <div className="ml-2 text-sm">Started Antihistamines</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 text-xs text-slate-500 dark:text-slate-400">Dec 2023</div>
                        <div className="ml-2 h-4 w-4 rounded-full bg-blue-500"></div>
                        <div className="ml-2 text-sm">Started Trigger Avoidance</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 text-xs text-slate-500 dark:text-slate-400">Jan 2024</div>
                        <div className="ml-2 h-4 w-4 rounded-full bg-blue-500"></div>
                        <div className="ml-2 text-sm">Started Dietary Changes</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 text-xs text-slate-500 dark:text-slate-400">Jan 2024</div>
                        <div className="ml-2 h-4 w-4 rounded-full bg-green-500"></div>
                        <div className="ml-2 text-sm">Completed Antihistamines</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 text-xs text-slate-500 dark:text-slate-400">Feb 2024</div>
                        <div className="ml-2 h-4 w-4 rounded-full bg-blue-500"></div>
                        <div className="ml-2 text-sm">Started Light Therapy</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 text-xs text-slate-500 dark:text-slate-400">Mar 2024</div>
                        <div className="ml-2 h-4 w-4 rounded-full bg-green-500"></div>
                        <div className="ml-2 text-sm">Completed Light Therapy</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Triggers Tab */}
            <TabsContent value="triggers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Identified Triggers</CardTitle>
                  <CardDescription>Factors that may contribute to your eczema flare-ups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={triggerData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {triggerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Contribution"]}
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
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Stress Correlation</CardTitle>
                    <CardDescription>Relationship between stress levels and symptom severity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { date: "Week 1", stress: 7, severity: 7.5 },
                            { date: "Week 2", stress: 8, severity: 8.0 },
                            { date: "Week 3", stress: 6, severity: 6.5 },
                            { date: "Week 4", stress: 5, severity: 5.8 },
                            { date: "Week 5", stress: 7, severity: 7.2 },
                            { date: "Week 6", stress: 4, severity: 4.5 },
                            { date: "Week 7", stress: 3, severity: 3.8 },
                            { date: "Week 8", stress: 2, severity: 3.0 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="stress" name="Stress Level" stroke="#8b5cf6" strokeWidth={2} />
                          <Line
                            type="monotone"
                            dataKey="severity"
                            name="Symptom Severity"
                            stroke="#ef4444"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                      <p>
                        Correlation coefficient:{" "}
                        <span className="font-medium text-slate-700 dark:text-slate-300">0.92</span> (Strong positive
                        correlation)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Environmental Factors</CardTitle>
                    <CardDescription>How environmental conditions affect your symptoms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Humidity (Low)</span>
                          <span className="text-sm font-medium">High Impact</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Temperature (Hot)</span>
                          <span className="text-sm font-medium">Medium Impact</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Pollen</span>
                          <span className="text-sm font-medium">Low Impact</span>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Air Pollution</span>
                          <span className="text-sm font-medium">Medium Impact</span>
                        </div>
                        <Progress value={55} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Seasonal Changes</span>
                          <span className="text-sm font-medium">High Impact</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
