"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Video,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  FileText,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import type { PatientAppointment } from "@/services/patientAppointmentService"
import { toast } from "@/components/ui/use-toast"
import { patientAppointmentService } from "@/services/patientAppointmentService"

interface AppointmentsListProps {
  appointments: PatientAppointment[]
  onRefresh: () => Promise<void>
}

export default function AppointmentsList({ appointments, onRefresh }: AppointmentsListProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all")
  const [isLoading, setIsLoading] = useState(false)

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true
    if (filter === "upcoming") return ["pending", "confirmed"].includes(appointment.status)
    if (filter === "past") return ["completed", "cancelled"].includes(appointment.status)
    return true
  })

  // Sort appointments by date (newest first for past, oldest first for upcoming)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.appointment_date)
    const dateB = new Date(b.appointment_date)

    const isUpcomingA = ["pending", "confirmed"].includes(a.status)
    const isUpcomingB = ["pending", "confirmed"].includes(b.status)

    if (isUpcomingA && isUpcomingB) {
      return dateA.getTime() - dateB.getTime() // Ascending for upcoming
    } else if (!isUpcomingA && !isUpcomingB) {
      return dateB.getTime() - dateA.getTime() // Descending for past
    } else if (isUpcomingA && !isUpcomingB) {
      return -1 // Upcoming before completed/cancelled
    } else {
      return 1 // Completed/cancelled after upcoming
    }
  })

  const getAppointmentTypeIcon = (mode: 'in_person' | 'video' | 'phone') => {
    switch (mode) {
      case "video":
        return <Video className="h-5 w-5 text-indigo-500" />
      case "phone":
        return <Phone className="h-5 w-5 text-sky-500" />
      default:
        return <MapPin className="h-5 w-5 text-emerald-500" />
    }
  }

  const getStatusBadge = (status: PatientAppointment['status']) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </span>
        )
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        )
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        )
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertCircle className="mr-1 h-3 w-3" />
            Confirmed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
            {status}
          </span>
        )
    }
  }

  const handleCancel = async (appointmentId: string) => {
    try {
      setIsLoading(true)
      await patientAppointmentService.cancelAppointment(appointmentId)
      toast({
        title: "Success",
        description: "Appointment cancelled successfully"
      })
      await onRefresh()
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReschedule = async (appointmentId: string) => {
    // For now, we'll just show a message that this feature is coming soon
    toast({
      title: "Coming Soon",
      description: "Rescheduling appointments will be available soon!"
    })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
      <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white p-6">
        <h2 className="text-2xl font-semibold">My Appointments</h2>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === "all"
                ? "bg-white text-sky-500"
                : "bg-transparent text-white hover:bg-white/10"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === "upcoming"
                ? "bg-white text-sky-500"
                : "bg-transparent text-white hover:bg-white/10"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === "past"
                ? "bg-white text-sky-500"
                : "bg-transparent text-white hover:bg-white/10"
            }`}
          >
            Past
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
              <p className="mt-4 text-slate-500 dark:text-slate-400">Loading appointments...</p>
            </div>
          ) : sortedAppointments.length > 0 ? (
            sortedAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-slate-900 dark:text-white">{appointment.reason}</h3>
                        <div className="flex items-center mt-2">
                          <User className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                          <span className="text-sm text-slate-700 dark:text-slate-300 mr-3">
                            {appointment.doctor ? `${appointment.doctor.first_name} ${appointment.doctor.last_name}` : 'N/A'}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {appointment.doctor?.doctor_profile?.specialty || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <MoreHorizontal className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {new Date(appointment.appointment_date).toLocaleTimeString()}
                        </span>
                      </div>
                      {getStatusBadge(appointment.status)}
                      {getAppointmentTypeIcon(appointment.mode)}
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                      {["pending", "confirmed"].includes(appointment.status) && (
                        <>
                          <button 
                            onClick={() => handleReschedule(appointment.id)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            Reschedule
                          </button>
                          <button 
                            onClick={() => handleCancel(appointment.id)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === "completed" && (
                        <button className="px-3 py-1.5 text-sm rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors">
                          View Summary
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-slate-400" />
              <h3 className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">No appointments found</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {filter === "upcoming"
                  ? "You don't have any upcoming appointments."
                  : filter === "past"
                    ? "You don't have any past appointments."
                    : "You don't have any appointments."}
              </p>
              <button className="mt-6 px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                Schedule New Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
