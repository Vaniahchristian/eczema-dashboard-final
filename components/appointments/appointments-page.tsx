"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import AppointmentsHeader from "@/components/appointments/appointments-header"
import AppointmentsCalendar from "@/components/appointments/appointments-calendar"
import AppointmentsList from "@/components/appointments/appointments-list"
import ScheduleAppointment from "@/components/appointments/schedule-appointment"
import DoctorProfiles from "@/components/appointments/doctor-profiles"

export type AppointmentType = "In-person" | "Video" | "Phone"
export type AppointmentStatus = "Upcoming" | "Completed" | "Cancelled" | "Rescheduled"

export type Appointment = {
  id: string
  date: string
  time: string
  duration: number // in minutes
  doctor: Doctor
  type: AppointmentType
  status: AppointmentStatus
  notes: string
  location?: string
  reason: string
}

export type Doctor = {
  id: string
  name: string
  specialty: string
  image: string
  rating: number
  experience: number
  bio: string
  availability: {
    day: string
    slots: string[]
  }[]
}

export default function AppointmentsPage() {
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  // Sample doctors data
  const doctors: Doctor[] = [
    {
      id: "doc-001",
      name: "Dr. Emily Chen",
      specialty: "Dermatologist",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      experience: 12,
      bio: "Dr. Chen specializes in treating various skin conditions including eczema, psoriasis, and acne. She has published numerous research papers on innovative treatments for chronic skin conditions.",
      availability: [
        { day: "Monday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
        { day: "Wednesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
        { day: "Friday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
      ],
    },
    {
      id: "doc-002",
      name: "Dr. Michael Johnson",
      specialty: "Allergist",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      experience: 8,
      bio: "Dr. Johnson specializes in allergies and immunology, with a focus on skin allergies and their relation to eczema. He takes a holistic approach to treatment, considering environmental factors.",
      availability: [
        { day: "Tuesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
        { day: "Thursday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
      ],
    },
    {
      id: "doc-003",
      name: "Dr. Sarah Williams",
      specialty: "Dermatologist",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      experience: 15,
      bio: "Dr. Williams is a board-certified dermatologist with expertise in pediatric dermatology and eczema management. She focuses on patient education and preventative care strategies.",
      availability: [
        { day: "Monday", slots: ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"] },
        { day: "Wednesday", slots: ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"] },
        { day: "Friday", slots: ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"] },
      ],
    },
  ]

  // Sample appointments data
  const appointments: Appointment[] = [
    {
      id: "apt-001",
      date: "2023-06-10",
      time: "10:30 AM",
      duration: 30,
      doctor: doctors[0],
      type: "In-person",
      status: "Upcoming",
      notes: "Follow-up appointment to assess treatment effectiveness",
      location: "Dermatology Clinic, 123 Medical Center Dr",
      reason: "Follow-up",
    },
    {
      id: "apt-002",
      date: "2023-05-15",
      time: "2:00 PM",
      duration: 45,
      doctor: doctors[0],
      type: "In-person",
      status: "Completed",
      notes: "Initial consultation for eczema flare-up. Prescribed hydrocortisone cream.",
      location: "Dermatology Clinic, 123 Medical Center Dr",
      reason: "Initial Consultation",
    },
    {
      id: "apt-003",
      date: "2023-04-02",
      time: "11:00 AM",
      duration: 30,
      doctor: doctors[1],
      type: "Video",
      status: "Completed",
      notes: "Discussed potential allergic triggers for eczema. Recommended allergy testing.",
      reason: "Allergy Consultation",
    },
    {
      id: "apt-004",
      date: "2023-06-20",
      time: "3:00 PM",
      duration: 30,
      doctor: doctors[2],
      type: "Phone",
      status: "Upcoming",
      notes: "Quick check-in to discuss treatment progress",
      reason: "Check-in",
    },
    {
      id: "apt-005",
      date: "2023-03-10",
      time: "9:30 AM",
      duration: 60,
      doctor: doctors[2],
      type: "In-person",
      status: "Completed",
      notes: "Comprehensive skin assessment and treatment planning",
      location: "Dermatology Clinic, 123 Medical Center Dr",
      reason: "Comprehensive Assessment",
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-screen-2xl mx-auto"
        >
          <AppointmentsHeader
            activeView={activeView}
            setActiveView={setActiveView}
            onSchedule={() => setShowScheduleModal(true)}
          />

          <div className="mt-8">
            {activeView === "calendar" ? (
              <AppointmentsCalendar
                appointments={appointments}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            ) : (
              <AppointmentsList appointments={appointments} />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <DoctorProfiles doctors={doctors} onSchedule={() => setShowScheduleModal(true)} />
          </motion.div>
        </motion.div>
      </div>

      <ScheduleAppointment
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        doctors={doctors}
        selectedDate={selectedDate}
      />
    </DashboardLayout>
  )
}

