"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, User, Video, Phone, MapPin, ChevronRight, Check } from "lucide-react"
import { Doctor, patientAppointmentService, type CreateAppointmentData, type AppointmentType, type AppointmentStatus } from "@/services/patientAppointmentService"
import { useAuth } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"

interface ScheduleAppointmentProps {
  isOpen?: boolean
  onClose: () => void
  doctors: Doctor[]
  selectedDate?: Date
  onSubmit: (data: CreateAppointmentData) => Promise<void>
}

type AppointmentStep = "doctor" | "date" | "details"

export default function ScheduleAppointment({ isOpen, onClose, doctors, selectedDate, onSubmit }: ScheduleAppointmentProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<AppointmentStep>("doctor")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [appointmentDate, setAppointmentDate] = useState<Date>(selectedDate || new Date())
  const [appointmentTime, setAppointmentTime] = useState<string>("")
  const [appointmentReason, setAppointmentReason] = useState("")
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('first_visit')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appointmentMode, setAppointmentMode] = useState<'video' | 'phone' | 'in_person'>('video')

  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      patientAppointmentService
        .getDoctorAvailability(selectedDoctor.id, appointmentDate.toISOString().split('T')[0])
        .then((response) => {
          setAvailableSlots(response.availableSlots || [])
        })
        .catch((error) => {
          console.error('Error fetching doctor availability:', error)
          setAvailableSlots([])
        })
    }
  }, [selectedDoctor, appointmentDate])

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && Array.isArray(doctors) && doctors.length === 1) {
      setSelectedDoctor(doctors[0])
    }
    if (isOpen && selectedDate) {
      setAppointmentDate(selectedDate)
    }
  }, [isOpen, doctors, selectedDate])

  const resetForm = () => {
    setStep("doctor")
    setSelectedDoctor(null)
    setAppointmentDate(selectedDate || new Date())
    setAppointmentTime("")
    setAppointmentReason("")
    setAppointmentType('first_visit')
    setIsSubmitting(false)
    setAppointmentMode('video')
  }

  const handleClose = () => {
    onClose()
    setTimeout(resetForm, 300) // Reset after close animation
  }

  const handleSubmit = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime || !appointmentReason || !user) {
      toast({
        title: "Missing fields",
        description: "Please fill all fields",
        variant: "destructive"
      })
      return
    }
    const payload = {
      doctor_id: selectedDoctor.id,
      patient_id: user.id,
      appointment_date: `${appointmentDate.toISOString().split('T')[0]}T${appointmentTime}:00`,
      reason_for_visit: appointmentReason,
      appointment_type: appointmentType,
      mode: appointmentMode,
      status: 'pending'
    }
    setIsSubmitting(true)
    try {
      await patientAppointmentService.scheduleAppointment(payload)
      setIsSubmitting(false)
      handleClose()
      toast({
        title: "Success",
        description: "Appointment scheduled successfully!"
      })
    } catch (error) {
      setIsSubmitting(false)
      console.error(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule appointment",
        variant: "destructive"
      })
    }
  }

  const nextStep = () => {
    switch (step) {
      case "doctor":
        if (selectedDoctor) setStep("date")
        break
      case "date":
        if (appointmentTime) setStep("details")
        break
      case "details":
        handleSubmit()
        break
    }
  }

  const prevStep = () => {
    switch (step) {
      case "date":
        setStep("doctor")
        break
      case "details":
        setStep("date")
        break
    }
  }

  const canProceed = () => {
    switch (step) {
      case "doctor":
        return !!selectedDoctor
      case "date":
        return !!appointmentTime && !!appointmentDate && availableSlots.includes(appointmentTime)
      case "details":
        return appointmentReason.trim().length > 0 && !!appointmentType
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl w-full max-w-2xl"
        >
          <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">{step === "doctor" ? <User className="h-5 w-5 text-white" /> : step === "date" ? <Calendar className="h-5 w-5 text-white" /> : <Video className="h-5 w-5 text-white" />}</div>
                <h2 className="text-xl font-semibold">{step === "doctor" ? "Select Doctor" : step === "date" ? "Select Date" : "Appointment Details"}</h2>
              </div>
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-between mt-6">
              {["doctor", "date", "details"].map((s, index) => (
                <div key={s} className={`flex items-center ${index < 2 ? "flex-1" : ""}`}>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      s === step
                        ? "bg-white text-sky-500"
                        : ["doctor", "date", "details"].indexOf(s) <
                            ["doctor", "date", "details"].indexOf(step)
                          ? "bg-white/80 text-sky-500"
                          : "bg-white/20 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        ["doctor", "date"].indexOf(s) <
                        ["doctor", "date", "details"].indexOf(step)
                          ? "bg-white/80"
                          : "bg-white/20"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {step === "doctor" && (
              <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 mb-4">Select a specialist for your appointment:</p>
                {Array.isArray(doctors) && doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`cursor-pointer p-4 rounded-lg border ${selectedDoctor?.id === doctor.id ? "border-sky-500 bg-sky-50 dark:bg-sky-900/10" : "border-slate-200 dark:border-slate-700"}`}
                    >
                      <div className="flex items-center">
                        <User className="h-6 w-6 text-sky-500 mr-3" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{doctor.name || `${doctor.first_name} ${doctor.last_name}`}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{doctor.specialty}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 dark:text-slate-400">No doctors available.</div>
                )}
              </div>
            )}

            {step === "date" && (
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Select a date for your appointment with {selectedDoctor?.name || `${selectedDoctor?.first_name} ${selectedDoctor?.last_name}`} 
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Selected Date
                    </label>
                    <input
                      type="date"
                      value={appointmentDate.toISOString().split("T")[0]}
                      onChange={(e) => setAppointmentDate(new Date(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      Available Time Slots:
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setAppointmentTime(slot)}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            appointmentTime === slot
                              ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === "details" && (
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-4">Please provide a reason for your appointment:</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Appointment Reason
                    </label>
                    <textarea
                      value={appointmentReason}
                      onChange={(e) => setAppointmentReason(e.target.value)}
                      placeholder="Describe your symptoms or reason for visit..."
                      className="w-full min-h-[120px] px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Appointment Type
                    </label>
                    <select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="first_visit">First Visit</option>
                      <option value="follow_up">Follow-up</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Appointment Mode
                    </label>
                    <select
                      value={appointmentMode}
                      onChange={(e) => setAppointmentMode(e.target.value as 'video' | 'phone' | 'in_person')}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="video">Video Consultation</option>
                      <option value="phone">Phone Consultation</option>
                      <option value="in_person">In-Person Visit</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-between">
            {step !== "doctor" ? (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            <button
              onClick={nextStep}
              disabled={!canProceed() || isSubmitting}
              className={`px-4 py-2 rounded-xl flex items-center ${
                canProceed() && !isSubmitting
                  ? "bg-gradient-to-r from-sky-500 to-teal-500 text-white"
                  : "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {step === "details" ? "Schedule Appointment" : "Continue"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
