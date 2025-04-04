"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import AppointmentsHeader from "@/components/appointments/appointments-header"
import AppointmentsCalendar from "@/components/appointments/appointments-calendar"
import AppointmentsList from "@/components/appointments/appointments-list"
import ScheduleAppointment from "@/components/appointments/schedule-appointment"
import DoctorProfiles from "@/components/appointments/doctor-profiles"
import { patientAppointmentService, type PatientAppointment, type Doctor } from "@/services/patientAppointmentService"
import { toast } from "@/components/ui/use-toast"

export default function AppointmentsPage() {
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<PatientAppointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    loadAppointments()
    loadDoctors()
  }, [])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const response = await patientAppointmentService.getAppointments()
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

  const handleScheduleAppointment = async (data: {
    doctorId: string
    appointmentDate: string
    reason: string
    mode: 'In-person' | 'Video' | 'Phone'
    appointmentType: string
  }) => {
    try {
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

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await patientAppointmentService.cancelAppointment(appointmentId)
      toast({
        title: "Success",
        description: "Appointment cancelled successfully."
      })
      loadAppointments() // Refresh appointments list
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleRescheduleAppointment = async (appointmentId: string, newDate: string) => {
    try {
      await patientAppointmentService.rescheduleAppointment(appointmentId, newDate)
      toast({
        title: "Success",
        description: "Appointment rescheduled successfully."
      })
      loadAppointments() // Refresh appointments list
    } catch (error) {
      console.error("Error rescheduling appointment:", error)
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <AppointmentsHeader
          activeView={activeView}
          onViewChange={setActiveView}
          onScheduleClick={() => setShowScheduleModal(true)}
        />

        {activeView === "calendar" ? (
          <AppointmentsCalendar
            appointments={appointments}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onCancel={handleCancelAppointment}
            onReschedule={handleRescheduleAppointment}
            loading={loading}
          />
        ) : (
          <AppointmentsList
            appointments={appointments}
            onCancel={handleCancelAppointment}
            onReschedule={handleRescheduleAppointment}
            loading={loading}
          />
        )}

        {showScheduleModal && (
          <ScheduleAppointment
            doctors={doctors}
            onSchedule={handleScheduleAppointment}
            onClose={() => setShowScheduleModal(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
