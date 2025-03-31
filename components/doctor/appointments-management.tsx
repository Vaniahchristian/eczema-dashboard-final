"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  MoreHorizontal,
  Video,
  Phone,
  User,
  Check,
  X,
  AlertCircle,
  CalendarDays,
  CalendarClock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample appointments data
const appointments = [
  {
    id: "apt-1001",
    patient: {
      id: "P-1002",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2023-06-12",
    time: "09:00 AM",
    duration: 30,
    type: "Follow-up",
    status: "Confirmed",
    mode: "In-person",
    notes: "Review treatment progress and adjust medication if necessary.",
  },
  {
    id: "apt-1002",
    patient: {
      id: "P-1001",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2023-06-12",
    time: "10:30 AM",
    duration: 45,
    type: "New Patient",
    status: "Confirmed",
    mode: "In-person",
    notes: "Initial consultation for eczema diagnosis and treatment plan.",
  },
  {
    id: "apt-1003",
    patient: {
      id: "P-1003",
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2023-06-12",
    time: "01:15 PM",
    duration: 30,
    type: "Treatment Review",
    status: "Pending",
    mode: "Video",
    notes: "Discuss treatment efficacy and potential adjustments.",
  },
  {
    id: "apt-1004",
    patient: {
      id: "P-1004",
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2023-06-12",
    time: "03:00 PM",
    duration: 60,
    type: "Consultation",
    status: "Confirmed",
    mode: "In-person",
    notes: "Comprehensive review of condition and treatment options.",
  },
  {
    id: "apt-1005",
    patient: {
      id: "P-1005",
      name: "Jennifer Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2023-06-13",
    time: "09:30 AM",
    duration: 30,
    type: "Follow-up",
    status: "Confirmed",
    mode: "Phone",
    notes: "Brief check-in on medication response.",
  },
  {
    id: "apt-1006",
    patient: {
      id: "P-1006",
      name: "Robert Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2023-06-13",
    time: "11:00 AM",
    duration: 45,
    type: "Treatment Review",
    status: "Cancelled",
    mode: "In-person",
    notes: "Patient requested cancellation due to scheduling conflict.",
  },
  {
    id: "apt-1007",
    patient: {
      id: "P-1007",
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2023-06-13",
    time: "02:00 PM",
    duration: 30,
    type: "Follow-up",
    status: "Confirmed",
    mode: "Video",
    notes: "Review progress photos and discuss treatment efficacy.",
  },
  {
    id: "apt-1008",
    patient: {
      id: "P-1008",
      name: "Thomas Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2023-06-14",
    time: "10:00 AM",
    duration: 60,
    type: "New Patient",
    status: "Confirmed",
    mode: "In-person",
    notes: "Initial consultation for severe eczema case.",
  },
]

// Sample time slots
const timeSlots = [
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
]

export default function AppointmentsManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date("2023-06-12"))
  const [activeTab, setActiveTab] = useState("calendar")

  // Get appointments for the selected date
  const appointmentsForDate = appointments.filter(
    (appointment) => appointment.date === selectedDate.toISOString().split("T")[0],
  )

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  // Get appointment status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "default"
      case "Pending":
        return "secondary"
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Get appointment mode icon
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "Video":
        return <Video className="h-4 w-4" />
      case "Phone":
        return <Phone className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="container px-4 py-6 md:px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/doctor">
            <Button variant="outline" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">Appointments</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your patient appointments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list">
            <CalendarDays className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <CalendarClock className="h-4 w-4 mr-2" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="pending">
            <AlertCircle className="h-4 w-4 mr-2" />
            Pending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Daily Schedule</CardTitle>
                  <CardDescription>Manage your appointments for the day</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={goToPreviousDay}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-center min-w-[180px]">
                    <p className="font-medium">{formatDate(selectedDate)}</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={goToNextDay}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Appointments</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="new-patient">New Patient</SelectItem>
                    <SelectItem value="treatment">Treatment Review</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Morning</h3>
                  {timeSlots.slice(0, 10).map((timeSlot) => {
                    const appointment = appointmentsForDate.find((apt) => apt.time === timeSlot)

                    return (
                      <div
                        key={timeSlot}
                        className={`p-3 rounded-lg border ${
                          appointment
                            ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                            : "border-dashed"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                            <span className="font-medium">{timeSlot}</span>
                          </div>
                          {appointment ? (
                            <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                          ) : (
                            <Button variant="ghost" size="sm" className="h-6">
                              <Plus className="h-3 w-3 mr-1" />
                              Book
                            </Button>
                          )}
                        </div>

                        {appointment && (
                          <div className="mt-2">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={appointment.patient.avatar} alt={appointment.patient.name} />
                                <AvatarFallback>
                                  {appointment.patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{appointment.patient.name}</p>
                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                  <span>{appointment.type}</span>
                                  <span className="mx-1">•</span>
                                  <span>{appointment.duration} min</span>
                                  <span className="mx-1">•</span>
                                  <span className="flex items-center">
                                    {getModeIcon(appointment.mode)}
                                    <span className="ml-1">{appointment.mode}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end mt-2 space-x-1">
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <Check className="h-3 w-3 mr-1" />
                                Check In
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 px-2">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                                  <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel Appointment
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Afternoon</h3>
                  {timeSlots.slice(10).map((timeSlot) => {
                    const appointment = appointmentsForDate.find((apt) => apt.time === timeSlot)

                    return (
                      <div
                        key={timeSlot}
                        className={`p-3 rounded-lg border ${
                          appointment
                            ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                            : "border-dashed"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                            <span className="font-medium">{timeSlot}</span>
                          </div>
                          {appointment ? (
                            <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                          ) : (
                            <Button variant="ghost" size="sm" className="h-6">
                              <Plus className="h-3 w-3 mr-1" />
                              Book
                            </Button>
                          )}
                        </div>

                        {appointment && (
                          <div className="mt-2">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={appointment.patient.avatar} alt={appointment.patient.name} />
                                <AvatarFallback>
                                  {appointment.patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{appointment.patient.name}</p>
                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                  <span>{appointment.type}</span>
                                  <span className="mx-1">•</span>
                                  <span>{appointment.duration} min</span>
                                  <span className="mx-1">•</span>
                                  <span className="flex items-center">
                                    {getModeIcon(appointment.mode)}
                                    <span className="ml-1">{appointment.mode}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end mt-2 space-x-1">
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <Check className="h-3 w-3 mr-1" />
                                Check In
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 px-2">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                                  <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel Appointment
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {appointmentsForDate.length} appointments scheduled for today
              </div>
              <Button variant="outline">
                <CalendarDays className="mr-2 h-4 w-4" />
                View Full Calendar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointments List</CardTitle>
              <CardDescription>View and manage all scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-4 md:p-6 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={appointment.patient.avatar} alt={appointment.patient.name} />
                              <AvatarFallback>
                                {appointment.patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{appointment.patient.name}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Patient ID: {appointment.patient.id}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 items-center">
                            <div className="flex items-center mr-4">
                              <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                              <span className="text-sm">{new Date(appointment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center mr-4">
                              <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                              <span className="text-sm">
                                {appointment.time} ({appointment.duration} min)
                              </span>
                            </div>
                            <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center">
                              {getModeIcon(appointment.mode)}
                              <span className="ml-1">{appointment.mode}</span>
                            </Badge>
                            <Badge variant="secondary">{appointment.type}</Badge>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-4 text-sm">
                            <p className="text-slate-500 dark:text-slate-400">{appointment.notes}</p>
                          </div>
                        )}

                        <div className="flex justify-end mt-4 space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            <Check className="mr-2 h-4 w-4" />
                            Check In
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>View your upcoming schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Upcoming appointments content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Appointments</CardTitle>
              <CardDescription>Appointments requiring confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Pending appointments content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

