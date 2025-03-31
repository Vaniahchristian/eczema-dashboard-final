"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MessageSquare, User, Video } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AppointmentWidget() {
  const [activeTab, setActiveTab] = useState("appointment")

  const doctors = [
    { id: 1, name: "Dr. Emily Chen", specialty: "Dermatologist" },
    { id: 2, name: "Dr. Michael Johnson", specialty: "Allergist" },
    { id: 3, name: "Dr. Sarah Williams", specialty: "Dermatologist" },
  ]

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]

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
              <Select>
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-500">
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name} - {doctor.specialty}
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
              <Select>
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-500">
                  <SelectValue placeholder="Choose a date" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                  <SelectItem value="two-weeks">In Two Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-indigo-500" />
                Select Time
              </label>
              <Select>
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-500">
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button className="w-full mt-6 py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              Schedule Appointment
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
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name} - {doctor.specialty}
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
              ></textarea>
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

