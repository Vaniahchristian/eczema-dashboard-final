"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Video, Phone, MapPin } from "lucide-react"
import type { Appointment } from "./appointments-page"

interface AppointmentsCalendarProps {
  appointments: Appointment[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export default function AppointmentsCalendar({ appointments, selectedDate, onDateSelect }: AppointmentsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([])

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1)
    // Get the day of the week for the first day (0-6, where 0 is Sunday)
    const firstDayOfWeek = firstDayOfMonth.getDay()

    // Get the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek

    // Calculate total days to show (including days from previous and next month)
    const totalDays = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7

    // Generate array of dates
    const days: Date[] = []

    // Add days from previous month
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()

    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthDays - i))
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    // Add days from next month
    const remainingDays = totalDays - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    setCalendarDays(days)
  }, [currentMonth])

  // Filter appointments for the selected date
  useEffect(() => {
    const dateString = selectedDate.toISOString().split("T")[0]
    const filtered = appointments.filter((apt) => apt.date === dateString)
    setSelectedAppointments(filtered)
  }, [selectedDate, appointments])

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelectedDate = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const hasAppointment = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return appointments.some((apt) => apt.date === dateString)
  }

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="h-4 w-4 text-indigo-500" />
      case "Phone":
        return <Phone className="h-4 w-4 text-sky-500" />
      default:
        return <MapPin className="h-4 w-4 text-emerald-500" />
    }
  }

  const formatTime = (time: string) => {
    return time
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
          <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              </h2>
              <div className="flex space-x-2">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekdays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => (
                <button
                  key={index}
                  onClick={() => onDateSelect(date)}
                  className={`
                    relative h-14 rounded-lg flex items-center justify-center transition-all
                    ${isCurrentMonth(date) ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}
                    ${isToday(date) && !isSelectedDate(date) ? "bg-slate-100 dark:bg-slate-700/50" : ""}
                    ${
                      isSelectedDate(date)
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 font-medium"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }
                  `}
                >
                  <span>{date.getDate()}</span>
                  {hasAppointment(date) && (
                    <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 h-full">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
            <h2 className="text-xl font-semibold">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <p className="text-sm text-white/80 mt-1">
              {selectedAppointments.length
                ? `${selectedAppointments.length} appointment${selectedAppointments.length > 1 ? "s" : ""}`
                : "No appointments scheduled"}
            </p>
          </div>
          <div className="p-6">
            {selectedAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedAppointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-0.5 duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {getAppointmentTypeIcon(appointment.type)}
                        <span className="ml-2 font-medium">{appointment.reason}</span>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{formatTime(appointment.time)}</span>
                    </div>
                    <div className="mt-2 flex items-center">
                      <img
                        src={appointment.doctor.image || "/placeholder.svg"}
                        alt={appointment.doctor.name}
                        className="h-8 w-8 rounded-full object-cover mr-2"
                      />
                      <div>
                        <div className="font-medium text-sm">{appointment.doctor.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{appointment.doctor.specialty}</div>
                      </div>
                    </div>
                    {appointment.location && (
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {appointment.location}
                      </div>
                    )}
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="px-3 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        Reschedule
                      </button>
                      <button className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-slate-100 dark:bg-slate-700/50 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="mt-4 font-medium text-slate-700 dark:text-slate-300">No Appointments</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  There are no appointments scheduled for this date.
                </p>
                <button className="mt-4 px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  Schedule Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

