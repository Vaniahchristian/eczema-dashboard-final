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
import type { Appointment } from "./appointments-page"

interface AppointmentsListProps {
  appointments: Appointment[]
}

export default function AppointmentsList({ appointments }: AppointmentsListProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all")

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true
    if (filter === "upcoming") return appointment.status === "Upcoming"
    if (filter === "past") return appointment.status === "Completed"
    return true
  })

  // Sort appointments by date (newest first for past, oldest first for upcoming)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)

    if (a.status === "Upcoming" && b.status === "Upcoming") {
      return dateA.getTime() - dateB.getTime() // Ascending for upcoming
    } else if (a.status === "Completed" && b.status === "Completed") {
      return dateB.getTime() - dateA.getTime() // Descending for past
    } else if (a.status === "Upcoming" && b.status === "Completed") {
      return -1 // Upcoming before completed
    } else {
      return 1 // Completed after upcoming
    }
  })

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="h-5 w-5 text-indigo-500" />
      case "Phone":
        return <Phone className="h-5 w-5 text-sky-500" />
      default:
        return <MapPin className="h-5 w-5 text-emerald-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Upcoming":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400">
            <Clock className="mr-1 h-3 w-3" />
            Upcoming
          </span>
        )
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        )
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        )
      case "Rescheduled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertCircle className="mr-1 h-3 w-3" />
            Rescheduled
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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
      <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white p-6">
        <h2 className="text-xl font-semibold">Appointments List</h2>
        <div className="flex space-x-2 mt-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              filter === "all" ? "bg-white text-sky-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            All Appointments
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              filter === "upcoming" ? "bg-white text-sky-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              filter === "past" ? "bg-white text-sky-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
          >
            Past
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {sortedAppointments.length > 0 ? (
            sortedAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 p-4 bg-slate-100 dark:bg-slate-700/50 flex flex-col justify-center items-center">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">{getAppointmentTypeIcon(appointment.type)}</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {new Date(appointment.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {appointment.time} • {appointment.duration} min
                      </div>
                      <div className="mt-3">{getStatusBadge(appointment.status)}</div>
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-slate-900 dark:text-white">{appointment.reason}</h3>
                        <div className="flex items-center mt-2">
                          <User className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                          <span className="text-sm text-slate-700 dark:text-slate-300 mr-3">
                            {appointment.doctor.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {appointment.doctor.specialty}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <MoreHorizontal className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                      </button>
                    </div>

                    {appointment.location && (
                      <div className="mt-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        {appointment.location}
                      </div>
                    )}

                    <div className="mt-3 text-sm text-slate-500 dark:text-slate-400 flex items-start">
                      <FileText className="h-4 w-4 mr-1 mt-0.5" />
                      <span>{appointment.notes}</span>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                      {appointment.status === "Upcoming" && (
                        <>
                          <button className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Reschedule
                          </button>
                          <button className="px-3 py-1.5 text-sm rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === "Completed" && (
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

