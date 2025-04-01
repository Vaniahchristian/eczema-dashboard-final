"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MessageSquare, User, Video } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, DatePicker } from "@/components/ui"
import { API_URL } from "@/lib/config"
import { toast } from "sonner"
import { format } from "date-fns"

interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
}

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  available: boolean
}

interface AppointmentForm {
  doctorId: string
  date: Date | null
  timeSlotId: string
  message?: string
}

export default function AppointmentWidget() {
  const [activeTab, setActiveTab] = useState("appointment")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<AppointmentForm>({
    doctorId: "",
    date: null,
    timeSlotId: "",
    message: ""
  })

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No authentication token found")

        const response = await fetch(`${API_URL}/doctors`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch doctors")
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch doctors")
        }

        setDoctors(data.data)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to fetch doctors")
      }
    }

    fetchDoctors()
  }, [])

  // Fetch available time slots when doctor and date are selected
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!formData.doctorId || !formData.date) return

      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No authentication token found")

        const response = await fetch(
          `${API_URL}/appointments/available-slots?doctorId=${formData.doctorId}&date=${format(formData.date, "yyyy-MM-dd")}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch time slots")
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch time slots")
        }

        setTimeSlots(data.data)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to fetch time slots")
      }
    }

    fetchTimeSlots()
  }, [formData.doctorId, formData.date])

  const handleSubmit = async () => {
    if (!formData.doctorId || !formData.date || !formData.timeSlotId) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: formData.doctorId,
          date: format(formData.date, "yyyy-MM-dd"),
          timeSlotId: formData.timeSlotId,
          message: formData.message
        })
      })

      if (!response.ok) {
        throw new Error("Failed to create appointment")
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Failed to create appointment")
      }

      toast.success("Appointment scheduled successfully")
      setFormData({
        doctorId: "",
        date: null,
        timeSlotId: "",
        message: ""
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule appointment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-none shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white p-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Video className="mr-2 h-5 w-5" />
          Doctor Consultation
        </h2>
        <div className="flex space-x-2 mt-3">
          <button
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              activeTab === "appointment" ? "bg-white text-indigo-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
            onClick={() => setActiveTab("appointment")}
          >
            <Calendar className="h-4 w-4 inline-block mr-2" />
            Book Appointment
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              activeTab === "message" ? "bg-white text-indigo-600 shadow-md" : "text-white/80 hover:bg-white/20"
            }`}
            onClick={() => setActiveTab("message")}
          >
            <MessageSquare className="h-4 w-4 inline-block mr-2" />
            Send Message
          </button>
        </div>
      </div>
      <div className="p-6">
        {activeTab === "appointment" ? (
          <motion.div
            key="appointment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <User className="mr-2 h-4 w-4 text-indigo-500" />
                Select Doctor
              </label>
              <Select
                value={formData.doctorId}
                onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
              >
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-500">
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
                Select Date
              </label>
              <DatePicker
                date={formData.date}
                onSelect={(date) => setFormData({ ...formData, date: date || null })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-indigo-500" />
                Select Time
              </label>
              <Select
                value={formData.timeSlotId}
                onValueChange={(value) => setFormData({ ...formData, timeSlotId: value })}
                disabled={!formData.doctorId || !formData.date}
              >
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-500">
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id} disabled={!slot.available}>
                      {format(new Date(`2000-01-01T${slot.startTime}`), "h:mm a")} - 
                      {format(new Date(`2000-01-01T${slot.endTime}`), "h:mm a")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <MessageSquare className="mr-2 h-4 w-4 text-indigo-500" />
                Message (Optional)
              </label>
              <textarea
                className="w-full min-h-[120px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add any notes for your doctor..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              className="w-full mt-6 py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={loading || !formData.doctorId || !formData.date || !formData.timeSlotId}
            >
              {loading ? "Scheduling..." : "Schedule Appointment"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <User className="mr-2 h-4 w-4 text-indigo-500" />
                Select Recipient
              </label>
              <Select>
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-500">
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <MessageSquare className="mr-2 h-4 w-4 text-indigo-500" />
                Message
              </label>
              <textarea
                className="w-full min-h-[120px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your message here..."
              />
            </div>

            <button className="w-full mt-6 py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              Send Message
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
