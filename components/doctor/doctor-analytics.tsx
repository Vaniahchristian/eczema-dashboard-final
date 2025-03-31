"use client"

import { useState } from "react"
import { Calendar, Users, TrendingUp, Clock, Download, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
} from "recharts"

// Mock data for analytics
const PATIENT_TREND_DATA = [
  { month: "Jan", newPatients: 12, returningPatients: 24 },
  { month: "Feb", newPatients: 15, returningPatients: 28 },
  { month: "Mar", newPatients: 18, returningPatients: 30 },
  { month: "Apr", newPatients: 14, returningPatients: 32 },
  { month: "May", newPatients: 20, returningPatients: 35 },
  { month: "Jun", newPatients: 22, returningPatients: 38 },
  { month: "Jul", newPatients: 25, returningPatients: 40 },
]

const APPOINTMENT_DATA = [
  { name: "Initial Consultation", value: 30 },
  { name: "Follow-up", value: 45 },
  { name: "Emergency", value: 10 },
  { name: "Procedure", value: 15 },
]

const TREATMENT_SUCCESS_DATA = [
  { name: "Mild Cases", success: 90, failure: 10 },
  { name: "Moderate Cases", success: 75, failure: 25 },
  { name: "Severe Cases", success: 60, failure: 40 },
]

const DEMOGRAPHICS_DATA = [
  { name: "0-18", value: 20 },
  { name: "19-35", value: 35 },
  { name: "36-50", value: 25 },
  { name: "51-65", value: 15 },
  { name: "65+", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function DoctorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor your practice performance and patient trends</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="w-[300px]">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Schedule Reports</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <h3 className="text-2xl font-bold mt-1">248</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                <h3 className="text-2xl font-bold mt-1">56</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">8%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Treatment Success</p>
                <h3 className="text-2xl font-bold mt-1">78%</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">5%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                <h3 className="text-2xl font-bold mt-1">1.2 days</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">10%</span>
              <span className="text-muted-foreground ml-1">faster than last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Trends</CardTitle>
            <CardDescription>New vs. returning patients over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PATIENT_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newPatients"
                    name="New Patients"
                    stroke="#0088FE"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="returningPatients"
                    name="Returning Patients"
                    stroke="#00C49F"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={APPOINTMENT_DATA}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {APPOINTMENT_DATA.map((entry, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Treatment Success Rate</CardTitle>
            <CardDescription>Success rate by case severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={TREATMENT_SUCCESS_DATA}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="success" name="Success Rate (%)" stackId="a" fill="#00C49F" />
                  <Bar dataKey="failure" name="Failure Rate (%)" stackId="a" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Demographics</CardTitle>
            <CardDescription>Age distribution of patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEMOGRAPHICS_DATA}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {DEMOGRAPHICS_DATA.map((entry, index) => (
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

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Diagnoses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="text-sm">Atopic Dermatitis</span>
                <span className="text-sm font-medium">42%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Contact Dermatitis</span>
                <span className="text-sm font-medium">28%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Nummular Eczema</span>
                <span className="text-sm font-medium">15%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Seborrheic Dermatitis</span>
                <span className="text-sm font-medium">10%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Other</span>
                <span className="text-sm font-medium">5%</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Prescribed Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="text-sm">Hydrocortisone Cream</span>
                <span className="text-sm font-medium">35%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Tacrolimus Ointment</span>
                <span className="text-sm font-medium">25%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Clobetasol Propionate</span>
                <span className="text-sm font-medium">20%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Pimecrolimus Cream</span>
                <span className="text-sm font-medium">15%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Other</span>
                <span className="text-sm font-medium">5%</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative h-24 w-24">
                <svg className="h-24 w-24" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-indigo-500"
                    strokeWidth="8"
                    strokeDasharray={250}
                    strokeDashoffset={250 - (250 * 92) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">92%</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-center text-muted-foreground">Based on 156 patient reviews</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <div>
                  <p className="text-sm font-medium">Today</p>
                  <p className="text-xs text-muted-foreground">8 appointments</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <div>
                  <p className="text-sm font-medium">Tomorrow</p>
                  <p className="text-xs text-muted-foreground">6 appointments</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-slate-500 mr-2"></div>
                <div>
                  <p className="text-sm font-medium">This Week</p>
                  <p className="text-xs text-muted-foreground">24 appointments</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                <div>
                  <p className="text-sm font-medium">Next Week</p>
                  <p className="text-xs text-muted-foreground">18 appointments</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

