"use client"

import { useEffect, useState } from "react"
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
import { appointmentService, Appointment } from "@/services/appointmentService"
import { toast } from "@/components/ui/use-toast"

export default function AppointmentsManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("day")
  const [activeTab, setActiveTab] = useState("calendar")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadAppointments()
  }, [selectedDate, view, statusFilter])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const startDate = new Date(selectedDate)
      let endDate = new Date(selectedDate)
      
      if (view === "week") {
        endDate.setDate(endDate.getDate() + 7)
      } else if (view === "month") {
        endDate.setMonth(endDate.getMonth() + 1)
      } else {
        endDate.setDate(endDate.getDate() + 1)
      }

      const filters: any = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }

      if (statusFilter !== "all") {
        filters.status = statusFilter
      }

      const response = await appointmentService.getAppointments(filters)
      setAppointments(response.data)
    } catch (error) {
      console.error("Error loading appointments:", error)
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId: string, status: string) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, status)
      toast({
        title: "Success",
        description: `Appointment ${status.toLowerCase()} successfully.`
      })
      loadAppointments()
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast({
        title: "Error",
        description: "Failed to update appointment status. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleReschedule = async (appointmentId: string, newDate: string) => {
    try {
      await appointmentService.rescheduleAppointment(appointmentId, newDate)
      toast({
        title: "Success",
        description: "Appointment rescheduled successfully."
      })
      loadAppointments()
    } catch (error) {
      console.error("Error rescheduling appointment:", error)
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "completed":
        return "outline"
      case "rescheduled":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Appointments</h2>
          <p className="text-sm text-muted-foreground">Manage your appointments and schedule</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={view} onValueChange={(value: "day" | "week" | "month") => setView(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            </CardContent>
          </Card>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">No appointments found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={appointment.patient.imageUrl} alt={appointment.patient.name} />
                    <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{appointment.patient.name}</CardTitle>
                    <CardDescription>{appointment.patient.email}</CardDescription>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(appointment.status)}>
                  {appointment.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    {appointment.mode === "Video" ? (
                      <Video className="mr-1 h-4 w-4" />
                    ) : appointment.mode === "Phone" ? (
                      <Phone className="mr-1 h-4 w-4" />
                    ) : (
                      <User className="mr-1 h-4 w-4" />
                    )}
                    {appointment.mode}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{appointment.reason}</p>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <div className="flex space-x-2">
                    {appointment.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600"
                          onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(appointment.id, "completed")}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          const tomorrow = new Date()
                          tomorrow.setDate(tomorrow.getDate() + 1)
                          handleReschedule(appointment.id, tomorrow.toISOString())
                        }}
                      >
                        <CalendarClock className="mr-2 h-4 w-4" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
