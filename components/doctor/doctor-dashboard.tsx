"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container px-4 py-6 md:px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/login">
            <Button variant="outline" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">Doctor Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Welcome back, Dr. Johnson</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              4
            </span>
          </Button>
          <Button>Schedule Appointment</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">+6 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">2 remaining</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <FileText className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">4 urgent</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+5 since yesterday</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>You have 6 appointments scheduled for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-0">
                {[
                  { time: "9:00 AM", patient: "Sarah Johnson", type: "Follow-up", status: "Confirmed" },
                  { time: "10:30 AM", patient: "Michael Chen", type: "New Patient", status: "Confirmed" },
                  { time: "1:15 PM", patient: "Emily Rodriguez", type: "Treatment Review", status: "Pending" },
                  { time: "3:00 PM", patient: "David Kim", type: "Consultation", status: "Confirmed" },
                ].map((appointment, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 dark:bg-indigo-900 w-10 h-10 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                          <span>{appointment.time}</span>
                          <span className="mx-2">•</span>
                          <span>{appointment.type}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={appointment.status === "Confirmed" ? "default" : "outline"}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Appointments
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Patient Alerts</CardTitle>
                <CardDescription>Patients requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-0">
                {[
                  { patient: "Robert Smith", issue: "Severe flare-up reported", priority: "High" },
                  { patient: "Jennifer Lee", issue: "Medication side effects", priority: "Medium" },
                  { patient: "Thomas Wilson", issue: "Missed follow-up", priority: "Low" },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          alert.priority === "High"
                            ? "bg-red-100 dark:bg-red-900"
                            : alert.priority === "Medium"
                              ? "bg-amber-100 dark:bg-amber-900"
                              : "bg-green-100 dark:bg-green-900"
                        }`}
                      >
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            alert.priority === "High"
                              ? "text-red-600 dark:text-red-300"
                              : alert.priority === "Medium"
                                ? "text-amber-600 dark:text-amber-300"
                                : "text-green-600 dark:text-green-300"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{alert.patient}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{alert.issue}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        alert.priority === "High"
                          ? "destructive"
                          : alert.priority === "Medium"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Alerts
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Success Rate</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <div className="relative h-40 w-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl font-bold">78%</div>
                  </div>
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="stroke-slate-200 dark:stroke-slate-700"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="10"
                    />
                    <circle
                      className="stroke-indigo-500"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="55.264"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+5% from previous month</span>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Satisfaction</CardTitle>
                <CardDescription>Based on feedback</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <div className="relative h-40 w-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl font-bold">92%</div>
                  </div>
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="stroke-slate-200 dark:stroke-slate-700"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="10"
                    />
                    <circle
                      className="stroke-indigo-500"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="20.096"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">Excellent</span>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Treatment Plan
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>Manage your schedule for June 12, 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Appointment content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Directory</CardTitle>
              <CardDescription>View and manage your patients</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Patient directory content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Alerts content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

