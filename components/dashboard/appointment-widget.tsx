"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MessageSquare, User, Video } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, DatePicker } from "@/components/ui"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { patientAppointmentService, type Doctor, type PatientAppointment, type AppointmentType, type AppointmentStatus } from "@/services/patientAppointmentService"
import { useAuth } from "@/lib/auth"

interface TimeSlot {
  time: string
  available: boolean
}

interface FormData {
  doctorId: string
  date: Date | null
  timeSlot: string
  reason: string
  mode: string
}

export default function AppointmentWidget() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("appointment")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    doctorId: "",
    date: null,
    timeSlot: "",
    reason: "",
    mode: "video"
  })

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await patientAppointmentService.getDoctors()
        setDoctors(response)
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to fetch doctors",
          variant: "destructive",
        })
      }
    }

    fetchDoctors()
  }, [])

  // Reset time slot when doctor or date changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, timeSlot: "" }))
  }, [formData.doctorId, formData.date])

  const fetchTimeSlots = async () => {
    if (!formData.doctorId || !formData.date) {
      setTimeSlots([])
      return
    }

    setLoadingSlots(true)
    try {
      console.log('Fetching time slots for:', {
        doctorId: formData.doctorId,
        date: format(formData.date, "yyyy-MM-dd")
      });

      const response = await patientAppointmentService.getDoctorAvailability(
        formData.doctorId,
        format(formData.date, "yyyy-MM-dd")
      )

      console.log('Response from service:', response);

      const availableSlots = response.availableSlots.map((time: string) => ({
        time,
        available: true
      }))

      console.log('Processed time slots:', availableSlots);
      setTimeSlots(availableSlots)

      if (availableSlots.length === 0) {
        console.log('No time slots available');
        toast({
          title: "No Slots Available",
          description: "No available time slots for the selected date",
        })
      }
    } catch (err) {
      console.error('Error in fetchTimeSlots:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch time slots",
        variant: "destructive",
      })
    } finally {
      setLoadingSlots(false)
    }
  }

  // Fetch time slots when doctor or date changes
  useEffect(() => {
    fetchTimeSlots()
  }, [formData.doctorId, formData.date])

  const handleSubmit = async () => {
    // Validate required fields
    const missingFields = [];
    if (!formData.doctorId) missingFields.push('doctor');
    if (!formData.date) missingFields.push('date');
    if (!formData.timeSlot) missingFields.push('time slot');
    if (!formData.reason) missingFields.push('reason');

    if (missingFields.length > 0) {
      console.warn('Missing required fields:', missingFields);
      toast({
        title: "Missing Information",
        description: `Please fill in the following: ${missingFields.join(', ')}`,
        variant: "destructive",
      })
      return
    }

    if (!user) {
      console.error('No authenticated user found');
      toast({
        title: "Authentication Error",
        description: "Please log in to schedule an appointment",
        variant: "destructive",
      })
      return;
    }

    setLoading(true)
    try {
      console.log('Current user:', user);
      console.log('Creating appointment with form data:', {
        ...formData,
        date: formData.date ? format(formData.date, "yyyy-MM-dd") : null
      });
      
      const appointmentDate = `${format(formData.date!, "yyyy-MM-dd")}T${formData.timeSlot}:00`;
      console.log('Formatted appointment date:', appointmentDate);
      
      const appointmentData = {
        doctor_id: formData.doctorId,
        patient_id: user.id,
        appointment_date: appointmentDate,
        reason_for_visit: formData.reason.trim(),
        appointment_type: 'first_visit' as AppointmentType,
        status: 'pending' as AppointmentStatus
      }

      console.log('Submitting appointment data:', appointmentData);
      
      const response = await patientAppointmentService.scheduleAppointment(appointmentData)
      console.log('Appointment created successfully:', response);

      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      })

      // Reset form
      setFormData({
        doctorId: "",
        date: null,
        timeSlot: "",
        reason: "",
        mode: "video"
      })
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to schedule appointment";
      console.error('Error details:', {
        message: errorMessage,
        error: err,
        user: user
      });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
        <h2 className="text-xl font-semibold">Schedule Appointment</h2>
        <p className="text-sm text-white/80 mt-1">Book a consultation with our specialists</p>
      </div>

      <div className="p-6">
        <div className="space-y-5">
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
            <DatePicker
              date={formData.date}
              onSelect={(date) => {
                if (date) {
                  setFormData({ ...formData, date })
                }
              }}
            />
          </div>

          {formData.doctorId && formData.date && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-indigo-500" />
                Select Time
              </label>
              <Select
                value={formData.timeSlot}
                onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                disabled={loadingSlots}
              >
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-500">
                  <SelectValue placeholder={loadingSlots ? "Loading slots..." : "Choose a time"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.time} value={slot.time}>
                      {slot.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <MessageSquare className="mr-2 h-4 w-4 text-indigo-500" />
              Reason for Visit
            </label>
            <textarea
              className="w-full min-h-[80px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Briefly describe your symptoms or reason for visit..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Video className="mr-2 h-4 w-4 text-indigo-500" />
              Consultation Mode
            </label>
            <Select
              value={formData.mode}
              onValueChange={(value) => setFormData({ ...formData, mode: value })}
            >
              <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-500">
                <SelectValue placeholder="Choose consultation mode" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="video">Video Consultation</SelectItem>
                <SelectItem value="phone">Phone Consultation</SelectItem>
                <SelectItem value="in_person">In-Person Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            className="w-full mt-6 py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading || !formData.doctorId || !formData.date || !formData.timeSlot || !formData.reason}
          >
            {loading ? "Scheduling..." : "Schedule Appointment"}
          </button>
        </div>
      </div>
    </div>
  )
}
