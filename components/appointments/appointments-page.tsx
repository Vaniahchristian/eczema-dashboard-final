"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Calendar, List } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import AppointmentsList from "@/components/appointments/appointments-list"
import ScheduleAppointment from "@/components/appointments/schedule-appointment"
import { patientAppointmentService, type Doctor, type PatientAppointment, type CreateAppointmentData, type AppointmentType } from "@/services/patientAppointmentService"
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
      setDoctors(response)
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

  const handleScheduleAppointment = async (data: CreateAppointmentData) => {
    try {
      if (!user) {
        throw new Error('User not authenticated')
      }

      await patientAppointmentService.scheduleAppointment(data)

      toast({
        title: "Success",
        description: "Appointment scheduled successfully."
      })
      await loadAppointments() // Await for appointments to refresh before closing
      setShowScheduleModal(false)
    } catch (error) {
      console.error("Error scheduling appointment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule appointment",
        variant: "destructive"
      })
    }
  }
  
  if (loading) {
    return (
      <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-96">
        <svg className="animate-spin h-10 w-10 text-sky-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sky-700 dark:text-sky-300 text-lg font-medium">Loading your appointments...</span>
      </div>
      </DashboardLayout>
    )
  }
 
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Appointments</h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                Schedule and manage your consultations with dermatology specialists. Regular check-ups help monitor your eczema condition effectively.
              </p>
            </div>
            <Button 
              onClick={() => setShowScheduleModal(true)}
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Schedule Appointment
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-lg p-6 mb-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                <span>Past</span>
              </div>
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
      </div>
    </DashboardLayout>
  )
}
