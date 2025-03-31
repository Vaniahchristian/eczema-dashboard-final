"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Clock, User, Video, Phone, MapPin, ChevronRight, Check } from "lucide-react"
import type { Doctor } from "./appointments-page"

interface ScheduleAppointmentProps {
  isOpen: boolean
  onClose: () => void
  doctors: Doctor[]
  selectedDate: Date
}

type AppointmentStep = "doctor" | "date" | "time" | "type" | "reason" | "confirm"

export default function ScheduleAppointment({ isOpen, onClose, doctors, selectedDate }: ScheduleAppointmentProps) {
  const [step, setStep] = useState<AppointmentStep>("doctor")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [appointmentDate, setAppointmentDate] = useState<Date>(selectedDate)
  const [appointmentTime, setAppointmentTime] = useState<string>("")
  const [appointmentType, setAppointmentType] = useState<"In-person" | "Video" | "Phone">("In-person")
  const [appointmentReason, setAppointmentReason] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setStep("doctor")
    setSelectedDoctor(null)
    setAppointmentDate(selectedDate)
    setAppointmentTime("")
    setAppointmentType("In-person")
    setAppointmentReason("")
    setIsSubmitting(false)
  }

  const handleClose = () => {
    onClose()
    setTimeout(resetForm, 300) // Reset after close animation
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      handleClose()
      // Show success message
      alert("Appointment scheduled successfully!")
    }, 1500)
  }

  const getAvailableTimes = () => {
    if (!selectedDoctor) return []

    const dayOfWeek = appointmentDate.toLocaleDateString("en-US", { weekday: "long" })
    const availability = selectedDoctor.availability.find((a) => a.day === dayOfWeek)

    return availability ? availability.slots : []
  }

  const availableTimes = getAvailableTimes()

  const getStepTitle = () => {
    switch (step) {
      case "doctor":
        return "Select Doctor"
      case "date":
        return "Select Date"
      case "time":
        return "Select Time"
      case "type":
        return "Appointment Type"
      case "reason":
        return "Appointment Reason"
      case "confirm":
        return "Confirm Appointment"
      default:
        return "Schedule Appointment"
    }
  }

  const getStepIcon = () => {
    switch (step) {
      case "doctor":
        return <User className="h-5 w-5 text-white" />
      case "date":
        return <Calendar className="h-5 w-5 text-white" />
      case "time":
        return <Clock className="h-5 w-5 text-white" />
      case "type":
        return <Video className="h-5 w-5 text-white" />
      case "reason":
        return <MapPin className="h-5 w-5 text-white" />
      case "confirm":
        return <Check className="h-5 w-5 text-white" />
      default:
        return <Calendar className="h-5 w-5 text-white" />
    }
  }

  const nextStep = () => {
    switch (step) {
      case "doctor":
        if (selectedDoctor) setStep("date")
        break
      case "date":
        setStep("time")
        break
      case "time":
        if (appointmentTime) setStep("type")
        break
      case "type":
        setStep("reason")
        break
      case "reason":
        if (appointmentReason) setStep("confirm")
        break
      case "confirm":
        handleSubmit()
        break
    }
  }

  const prevStep = () => {
    switch (step) {
      case "date":
        setStep("doctor")
        break
      case "time":
        setStep("date")
        break
      case "type":
        setStep("time")
        break
      case "reason":
        setStep("type")
        break
      case "confirm":
        setStep("reason")
        break
    }
  }

  const canProceed = () => {
    switch (step) {
      case "doctor":
        return !!selectedDoctor
      case "date":
        return true
      case "time":
        return !!appointmentTime
      case "type":
        return true
      case "reason":
        return !!appointmentReason
      case "confirm":
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
                <div className="bg-white/20 p-2 rounded-full mr-3">{getStepIcon()}</div>
                <h2 className="text-xl font-semibold">{getStepTitle()}</h2>
              </div>
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-between mt-6">
              {["doctor", "date", "time", "type", "reason", "confirm"].map((s, index) => (
                <div key={s} className={`flex items-center ${index < 5 ? "flex-1" : ""}`}>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      s === step
                        ? "bg-white text-sky-500"
                        : ["doctor", "date", "time", "type", "reason", "confirm"].indexOf(s) <
                            ["doctor", "date", "time", "type", "reason", "confirm"].indexOf(step)
                          ? "bg-white/80 text-sky-500"
                          : "bg-white/20 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 5 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        ["doctor", "date", "time", "type", "reason"].indexOf(s) <
                        ["doctor", "date", "time", "type", "reason", "confirm"].indexOf(step)
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
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
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
                  Select a date for your appointment with {selectedDoctor?.name}:
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
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {selectedDoctor?.name} is available on:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedDoctor?.availability.map((avail, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-3 py-1 text-sm rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {avail.day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === "time" && (
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Select a time for your appointment on{" "}
                  {appointmentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}:
                </p>

                {availableTimes.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {availableTimes.map((time, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAppointmentTime(time)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          appointmentTime === time
                            ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400"
                            : "border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Clock className="h-12 w-12 mx-auto text-slate-400" />
                    <h3 className="mt-4 font-medium text-slate-700 dark:text-slate-300">No Available Times</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {selectedDoctor?.name} is not available on{" "}
                      {appointmentDate.toLocaleDateString("en-US", { weekday: "long" })}.
                    </p>
                    <button
                      onClick={() => setStep("date")}
                      className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                    >
                      Select Another Date
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === "type" && (
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-4">Select the type of appointment:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setAppointmentType("In-person")}
                    className={`p-4 rounded-xl border flex flex-col items-center transition-all ${
                      appointmentType === "In-person"
                        ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-full ${
                        appointmentType === "In-person"
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

                  <button
                    onClick={() => setAppointmentType("Video")}
                    className={`p-4 rounded-xl border flex flex-col items-center transition-all ${
                      appointmentType === "Video"
                        ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-full ${
                        appointmentType === "Video"
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
                    onClick={() => setAppointmentType("Phone")}
                    className={`p-4 rounded-xl border flex flex-col items-center transition-all ${
                      appointmentType === "Phone"
                        ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-full ${
                        appointmentType === "Phone"
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
                </div>
              </div>
            )}

            {step === "reason" && (
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
                  <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-sky-700 dark:text-sky-400">Tips</h4>
                    <ul className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                      <li>Include when your symptoms started</li>
                      <li>Mention any treatments you've already tried</li>
                      <li>Note if this is a follow-up to a previous appointment</li>
                      <li>Include any relevant medical history</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {step === "confirm" && (
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-4">Please review your appointment details:</p>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-sky-500 mr-3" />
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Doctor</div>
                        <div className="font-medium">{selectedDoctor?.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-sky-500 mr-3" />
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Date</div>
                        <div className="font-medium">
                          {appointmentDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-sky-500 mr-3" />
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Time</div>
                        <div className="font-medium">{appointmentTime}</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      {appointmentType === "Video" ? (
                        <Video className="h-5 w-5 text-sky-500 mr-3 mt-0.5" />
                      ) : appointmentType === "Phone" ? (
                        <Phone className="h-5 w-5 text-sky-500 mr-3 mt-0.5" />
                      ) : (
                        <MapPin className="h-5 w-5 text-sky-500 mr-3 mt-0.5" />
                      )}
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Type</div>
                        <div className="font-medium">{appointmentType} Appointment</div>
                        {appointmentType === "In-person" && (
                          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Dermatology Clinic, 123 Medical Center Dr
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-sky-500 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Reason</div>
                        <div className="font-medium">{appointmentReason}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-sky-700 dark:text-sky-400">Important Notes</h4>
                  <ul className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                    <li>Please arrive 15 minutes before your scheduled time</li>
                    <li>Bring your insurance card and ID</li>
                    <li>You can cancel or reschedule up to 24 hours before your appointment</li>
                    <li>You'll receive a confirmation email with these details</li>
                  </ul>
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
                  {step === "confirm" ? "Schedule Appointment" : "Continue"}
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

