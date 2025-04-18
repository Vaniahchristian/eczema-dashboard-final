"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Calendar, List } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import AppointmentsList from "@/components/appointments/appointments-list"
import ScheduleAppointment from "@/components/appointments/schedule-appointment"
import { patientAppointmentService, type Doctor, type PatientAppointment } from "@/services/patientAppointmentService"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function AppointmentsPage() {
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar")
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [appointments, setAppointments] = useState<PatientAppointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadAppointments = async () => {
    try {
      if (!user) return
      const response = await patientAppointmentService.getAppointments(user.id)
      setAppointments(response.data)
    } catch (error) {
      console.error("Error loading appointments:", error)
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive"
      })
    }
  }

  const loadDoctors = async () => {
    try {
      const response = await patientAppointmentService.getDoctors()
      setDoctors(response.data)
    } catch (error) {
      console.error("Error loading doctors:", error)
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again.",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([loadAppointments(), loadDoctors()])
      setLoading(false)
    }
    init()
  }, [user])

  const handleScheduleAppointment = async (data: {
    doctor_id: string
    patient_id: string
    appointment_date: string
    reason: string
    mode: 'video' | 'phone' | 'in_person'
    appointment_type: string
    duration: number
  }) => {
    try {
      if (!user) {
        throw new Error('User not authenticated')
      }

      await patientAppointmentService.scheduleAppointment(data)

      toast({
        title: "Success",
        description: "Appointment scheduled successfully."
      })
      setShowScheduleModal(false)
      loadAppointments() // Refresh appointments list
    } catch (error) {
      console.error("Error scheduling appointment:", error)
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive"
      })
    }
  }
  
  if (loading) {
    return <div>Loading...</div>
  }
 
  return (
    <DashboardLayout>
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Appointments</h1>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <Button
              variant={activeView === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveView("calendar")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={activeView === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveView("list")}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <Button onClick={() => setShowScheduleModal(true)}>Schedule Appointment</Button>
        </div>
      </div>

      <AppointmentsList appointments={appointments} onRefresh={loadAppointments} />

      <ScheduleAppointment
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        doctors={doctors}
        onSubmit={handleScheduleAppointment}
      />
    </div>
    </DashboardLayout>
  )
}
