import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eczema-backend.onrender.com/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: number;
  bio: string;
  availability: {
    day: string;
    slots: string[];
  }[];
}

export interface PatientAppointment {
  id: string;
  appointmentDate: string;
  time: string;
  duration: number;
  doctor: Doctor;
  mode: 'In-person' | 'Video' | 'Phone';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  notes?: string;
  location?: string;
  reason: string;
  appointmentType: string;
}

export const patientAppointmentService = {
  // Get all appointments for the patient
  getAppointments: async (filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`${API_URL}/appointments?${params}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  },

  // Get upcoming appointments
  getUpcomingAppointments: async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/upcoming`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error getting upcoming appointments:', error);
      throw error;
    }
  },

  // Schedule new appointment
  scheduleAppointment: async (data: {
    doctorId: string;
    appointmentDate: string;
    reason: string;
    mode: 'In-person' | 'Video' | 'Phone';
    appointmentType: string;
  }) => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, data, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  },

  // Get available doctors
  getDoctors: async () => {
    try {
      const response = await axios.get(`${API_URL}/doctors`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error getting doctors:', error);
      throw error;
    }
  },

  // Get doctor availability
  getDoctorAvailability: async (doctorId: string, date: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/appointments/availability/${doctorId}?date=${date}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error getting doctor availability:', error);
      throw error;
    }
  },

  // Reschedule appointment
  rescheduleAppointment: async (appointmentId: string, newDate: string) => {
    try {
      const response = await axios.put(
        `${API_URL}/appointments/${appointmentId}/reschedule`,
        { newDate },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId: string) => {
    try {
      const response = await axios.put(
        `${API_URL}/appointments/${appointmentId}/status`,
        { status: 'cancelled' },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }
};
