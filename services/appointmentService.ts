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

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
}

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  doctor_profile: {
    specialty: string;
    rating: number;
  };
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  reason: string;
  appointment_type: 'regular' | 'follow_up' | 'emergency';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  mode: 'in_person' | 'video' | 'phone';
  duration: number;
  patient?: Patient;
  doctor?: Doctor;
  created_at: string;
  updated_at: string;
}

export const appointmentService = {
  // Create new appointment
  createAppointment: async (data: Omit<Appointment, 'id' | 'status' | 'patient' | 'doctor' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, data, getAuthHeaders());
      return response.data.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/${id}`, getAuthHeaders());
      return response.data.data;
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw error;
    }
  },

  // Get doctor's appointments
  getDoctorAppointments: async (doctorId: string, filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(
        `${API_URL}/appointments/doctor/${doctorId}?${params.toString()}`,
        getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error getting doctor appointments:', error);
      throw error;
    }
  },

  // Get patient's appointments
  getPatientAppointments: async (patientId: string, filters?: {
    status?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);

      const response = await axios.get(
        `${API_URL}/appointments/patient/${patientId}?${params.toString()}`,
        getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error getting patient appointments:', error);
      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId: string, status: Appointment['status']) => {
    try {
      const response = await axios.patch(
        `${API_URL}/appointments/${appointmentId}/status`,
        { status },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Update appointment details
  updateAppointment: async (appointmentId: string, data: Partial<Omit<Appointment, 'id' | 'patient' | 'doctor' | 'created_at' | 'updated_at'>>) => {
    try {
      const response = await axios.put(
        `${API_URL}/appointments/${appointmentId}`,
        data,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Check doctor's availability
  checkAvailability: async (doctorId: string, appointmentDate: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/appointments/availability?doctorId=${doctorId}&appointmentDate=${appointmentDate}`,
        getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
};
