import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
  name: string;
  avatar: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  reason: string;
  appointmentType: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  mode: 'In-person' | 'Video' | 'Phone';
  duration: number;
  notes?: string;
  patient: Patient; 
  time: string; 
}

export const appointmentService = {
  // Create new appointment
  createAppointment: async (data: Omit<Appointment, 'id' | 'status'>) => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, data, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Get all appointments
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

  // Update appointment status
  updateAppointmentStatus: async (appointmentId: string, status: string) => {
    try {
      const response = await axios.put(
        `${API_URL}/appointments/${appointmentId}/status`,
        { status },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }
};
