import axios from 'axios'
import { getAuthHeaders } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eczema-backend.onrender.com/api'

export interface DoctorProfile {
  id: string
  specialty: string
  qualifications: string
  experience_years: number
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  first_name: string
  last_name: string
  email: string
  role: 'doctor'
  image?: string
  doctor_profile?: DoctorProfile
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

export interface Appointment {
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

export type CreateAppointmentData = Omit<Appointment, 'id' | 'status' | 'doctor' | 'patient' | 'created_at' | 'updated_at'>

class AppointmentService {
  async createAppointment(data: CreateAppointmentData) {
    const response = await axios.post(`${API_URL}/appointments`, data, getAuthHeaders())
    return response.data
  }

  async getAppointmentById(id: string) {
    const response = await axios.get(`${API_URL}/appointments/${id}`, getAuthHeaders())
    return response.data
  }

  async getDoctorAppointments(doctorId: string, params?: {
    status?: Appointment['status']
    startDate?: string
    endDate?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const response = await axios.get(
      `${API_URL}/appointments/doctor/${doctorId}?${queryParams.toString()}`,
      getAuthHeaders()
    )
    return response.data
  }

  async getPatientAppointments(patientId: string, params?: {
    status?: Appointment['status']
    startDate?: string
    endDate?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const response = await axios.get(
      `${API_URL}/appointments/patient/${patientId}?${queryParams.toString()}`,
      getAuthHeaders()
    )
    return response.data
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']) {
    const response = await axios.patch(
      `${API_URL}/appointments/${id}/status`,
      { status },
      getAuthHeaders()
    )
    return response.data
  }

  async updateAppointment(id: string, data: Partial<CreateAppointmentData>) {
    const response = await axios.put(
      `${API_URL}/appointments/${id}`,
      data,
      getAuthHeaders()
    )
    return response.data
  }

  async checkAvailability(doctorId: string, date: string) {
    const response = await axios.get(
      `${API_URL}/appointments/availability?doctorId=${doctorId}&date=${date}`,
      getAuthHeaders()
    )
    return response.data
  }
}

export const appointmentService = new AppointmentService()
