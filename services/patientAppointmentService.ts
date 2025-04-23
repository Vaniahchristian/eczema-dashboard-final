import axios from 'axios'
import { getAuthHeaders } from '@/lib/auth'
import { API_URL } from '@/lib/config'

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
  name: string
  email: string
  imageUrl: string
  specialty: string
  bio: string
  rating: number
  experienceYears: number
  clinicName: string
  clinicAddress: string
  consultationFee: number
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

export type AppointmentType = 'first_visit' | 'follow_up' | 'emergency';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface CreateAppointmentData {
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  reason_for_visit: string;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
}

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

      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No auth token found')
      }

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
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No auth token found')
      }

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
    console.log('Scheduling appointment with data:', data);
    try {
      const response = await axios.post(`${API_URL}/appointments`, data, getAuthHeaders());
      console.log('Appointment scheduled successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  },

  // Get available doctors
  getDoctors: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No auth token found')
      }

      const response = await axios.get(`${API_URL}/doctors`, getAuthHeaders())
      return response.data.data // Returns array of Doctor objects
    } catch (error) {
      console.error('Error getting doctors:', error)
      throw error
    }
  },

  // Get doctor availability
  getDoctorAvailability: async (doctorId: string, date: string) => {
    try {
      console.log('Fetching availability for doctor:', doctorId, 'date:', date);
      const response = await axios.get(
        `${API_URL}/doctors/${doctorId}/available-slots?date=${date}`,
        getAuthHeaders()
      )
      console.log('Raw API response:', response.data);
      console.log('Available slots:', response.data.data.availableSlots);
      return response.data.data
    } catch (error) {
      console.error('Error getting doctor availability:', error)
      throw error
    }
  },

  // Reschedule appointment
  rescheduleAppointment: async (id: string, data: Partial<CreateAppointmentData>) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No auth token found')
      }

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
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No auth token found')
      }

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
  },

  // Delete appointment
  deleteAppointment: async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No auth token found')
      }
      const response = await axios.delete(
        `${API_URL}/appointments/${id}`,
        getAuthHeaders()
      )
      return response.data
    } catch (error) {
      console.error('Error deleting appointment:', error)
      throw error
    }
  },
}
