"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, User, Video, Phone, MapPin, ChevronRight, Check } from "lucide-react"
import { Doctor, patientAppointmentService } from "@/services/patientAppointmentService"
import { useAuth } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"

interface ScheduleAppointmentProps {
  isOpen?: boolean
  onClose: () => void
  doctors: Doctor[]
  selectedDate?: Date
  onSubmit: (data: {
    doctor_id: string
    patient_id: string
    appointment_date: string
    reason: string
    mode: "video" | "phone" | "in_person"
    appointment_type: string
    duration: number
  }) => Promise<void>
}

type AppointmentStep = "doctor" | "date" | "details"

export default function ScheduleAppointment({ isOpen, onClose, doctors, selectedDate, onSubmit }: ScheduleAppointmentProps) {
  const [step, setStep] = useState<AppointmentStep>("doctor")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [appointmentDate, setAppointmentDate] = useState<Date>(selectedDate || new Date())
  const [appointmentTime, setAppointmentTime] = useState<string>("")
  const [appointmentMode, setAppointmentMode] = useState<'video' | 'phone' | 'in_person'>('video')
  const [appointmentReason, setAppointmentReason] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      patientAppointmentService
        .getDoctorAvailability(selectedDoctor.id, appointmentDate.toISOString().split('T')[0])
        .then((response) => {
          setAvailableSlots(response.data.slots || [])
        })
        .catch((error) => {
          console.error('Error fetching doctor availability:', error)
          setAvailableSlots([])
        })
    }
  }, [selectedDoctor, appointmentDate])

  const resetForm = () => {
    setStep("doctor")
    setSelectedDoctor(null)
    setAppointmentDate(selectedDate || new Date())
    setAppointmentTime("")
    setAppointmentMode("video")
    setAppointmentReason("")
    setAppointmentType("")
    setIsSubmitting(false)
  }

  const handleClose = () => {
    onClose()
    setTimeout(resetForm, 300) // Reset after close animation
  }

  const handleSubmit = () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) return

    const { user } = useAuth()
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to schedule an appointment",
        variant: "destructive"
      })
      return
    }

    const appointmentData = {
      doctor_id: selectedDoctor.id,
      patient_id: user.id,
      appointment_date: `${appointmentDate.toISOString().split('T')[0]}T${appointmentTime}:00`,
      reason: appointmentReason,
      mode: appointmentMode,
      appointment_type: appointmentType,
      duration: 30 // Default duration in minutes
    }

    setIsSubmitting(true)
    onSubmit(appointmentData)
      .then(() => {
        setIsSubmitting(false)
        handleClose()
        toast({
          title: "Success",
          description: "Appointment scheduled successfully!"
        })
      })
      .catch((error) => {
        setIsSubmitting(false)
        console.error(error)
        toast({
          title: "Error",
          description: "Failed to schedule appointment. Please try again.",
          variant: "destructive"
        })
      })
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
        return !!appointmentTime
      case "details":
        return true
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
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <img
                        src={"/placeholder.svg"}
                        alt={`${doctor.name}`}
                        className="h-12 w-12 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 dark:text-white">{doctor.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{doctor.specialty}</p>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border-2 ${
                          selectedDoctor?.id === doctor.id
                            ? "border-sky-500 bg-sky-500"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {selectedDoctor?.id === doctor.id && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === "date" && (
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Select a date for your appointment with {selectedDoctor?.name} 
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
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="">Select appointment type</option>
                      <option value="consultation">Consultation</option>
                      <option value="follow-up">Follow-up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Appointment Mode
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setAppointmentMode("video")}
                        className={`p-4 rounded-xl border flex flex-col items-center transition-all ${
                          appointmentMode === "video"
                            ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-full ${
                            appointmentMode === "video"
                              ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <Video className="h-6 w-6" />
                        </div>
                        <h3 className="mt-3 font-medium">Video Call</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-center">
                          Connect via secure video call
                        </p>
                      </button>

                      <button
                        onClick={() => setAppointmentMode("phone")}
                        className={`p-4 rounded-xl border flex flex-col items-center transition-all ${
                          appointmentMode === "phone"
                            ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-full ${
                            appointmentMode === "phone"
                              ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <Phone className="h-6 w-6" />
                        </div>
                        <h3 className="mt-3 font-medium">Phone Call</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-center">
                          Speak with your doctor by phone
                        </p>
                      </button>

                      <button
                        onClick={() => setAppointmentMode("in_person")}
                        className={`p-4 rounded-xl border flex flex-col items-center transition-all ${
                          appointmentMode === "in_person"
                            ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-full ${
                            appointmentMode === "in_person"
                              ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <MapPin className="h-6 w-6" />
                        </div>
                        <h3 className="mt-3 font-medium">In-person</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-center">
                          Visit the clinic for your appointment
                        </p>
                      </button>
                    </div>
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
