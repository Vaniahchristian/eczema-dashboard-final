import axios from 'axios'
import { getAuthHeaders } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface DoctorProfile {
  id: string
  specialty: string
  qualifications: string
  experience_years: number
  clinic_address?: string
  available_hours?: string
  bio?: string
  consultation_fee?: number
  availability?: {
    day: string
    slots: string[]
  }[]
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  first_name: string
  last_name: string
  email: string
  role: 'doctor'
  doctor_profile?: DoctorProfile
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  first_name: string
  last_name: string
  email: string
  role: 'patient'
  created_at: string
  updated_at: string
}

export interface PatientAppointment {
  id: string
  doctor_id: string
  patient_id: string
  appointment_date: string
  reason: string
  appointment_type: string
  mode: 'video' | 'phone' | 'in_person'
  duration: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  doctor?: Doctor
  patient?: Patient
  created_at: string
  updated_at: string
}

export type CreateAppointmentData = Omit<PatientAppointment, 'id' | 'status' | 'doctor' | 'patient' | 'created_at' | 'updated_at'>

export const patientAppointmentService = {
  // Get all appointments for the patient
  getAppointments: async (patientId: string, params?: {
    status?: PatientAppointment['status']
    startDate?: string
    endDate?: string
  }) => {
    try {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.startDate) queryParams.append('startDate', params.startDate)
      if (params?.endDate) queryParams.append('endDate', params.endDate)

      const response = await axios.get(
        `${API_URL}/appointments/patient/${patientId}?${queryParams.toString()}`,
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      console.error('Error getting appointments:', error)
      throw error
    }
  },

  // Get upcoming appointments
  getUpcomingAppointments: async (patientId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/appointments/patient/${patientId}/upcoming`,
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      console.error('Error getting upcoming appointments:', error)
      throw error
    }
  },

  // Schedule new appointment
  scheduleAppointment: async (data: CreateAppointmentData) => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, data, getAuthHeaders())
      return response.data
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      throw error
    }
  },

  // Get available doctors
  getDoctors: async () => {
    try {
      const response = await axios.get(`${API_URL}/doctors`, getAuthHeaders())
      return response.data.data // Note: backend returns { success: true, data: [...] }
    } catch (error) {
      console.error('Error getting doctors:', error)
      throw error
    }
  },

  // Get doctor availability
  getDoctorAvailability: async (doctorId: string, date: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/doctors/${doctorId}/available-slots?date=${date}`,
        getAuthHeaders()
      )
      return response.data.data.availableSlots // Note: backend returns { success: true, data: { date, availableSlots: [...] } }
    } catch (error) {
      console.error('Error getting doctor availability:', error)
      throw error
    }
  },

  // Reschedule appointment
  rescheduleAppointment: async (id: string, data: Partial<CreateAppointmentData>) => {
    try {
      const response = await axios.put(
        `${API_URL}/appointments/${id}`,
        data,
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      console.error('Error rescheduling appointment:', error)
      throw error
    }
  },

  // Cancel appointment
  cancelAppointment: async (id: string) => {
    try {
      const response = await axios.patch(
        `${API_URL}/appointments/${id}/status`,
        { status: 'cancelled' },
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      throw error
    }
  }
}
