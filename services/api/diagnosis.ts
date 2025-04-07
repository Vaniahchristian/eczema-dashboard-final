import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eczema-backend.onrender.com/api';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For cookies if used
});

export interface Diagnosis {
  _id: string;
  patientId: string;
  imageUrl: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  confidenceScore: number;
  bodyPart: string;
  isEczema: boolean;
  recommendations: string[];
  needsDoctorReview: boolean;
  status: 'pending_review' | 'completed' | 'reviewed';
  createdAt: string;
  doctorReview?: {
    doctorId: string;
    review: string;
    reviewedAt: string;
    updatedSeverity: 'Mild' | 'Moderate' | 'Severe';
    treatmentPlan: string;
  };
  metadata?: {
    imageQuality: number;
    mlAnalysis: {
      isEczema: boolean;
      confidence: number;
      bodyPart: string;
      bodyPartConfidence: number;
    };
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const diagnosisApi = {
  // Upload image and get diagnosis
  uploadImage: async (imageFile: File): Promise<ApiResponse<{
    diagnosisId: string;
    isEczema: boolean;
    severity: 'Mild' | 'Moderate' | 'Severe';
    confidence: number;
    bodyPart: string;
    recommendations: string[];
    needsDoctorReview: boolean;
    imageUrl: string;
  }>> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await apiClient.post('/eczema/diagnose', formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error((error.response?.data as any)?.message || 'Failed to upload image');
      }
      throw error;
    }
  },

  // Get all diagnoses
  getAllDiagnoses: async (): Promise<ApiResponse<Diagnosis[]>> => {
    try {
      const response = await apiClient.get('/eczema/diagnoses', getAuthHeaders());
      return {
        ...response.data,
        data: response.data.data.map((d: any) => ({
          ...d,
          _id: d.diagnosisId,
          confidenceScore: d.confidence,
        })),
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error((error.response?.data as any)?.message || 'Failed to fetch diagnoses');
      }
      throw error;
    }
  },

  // Get specific diagnosis
  getDiagnosis: async (diagnosisId: string): Promise<ApiResponse<Diagnosis>> => {
    try {
      const response = await apiClient.get(`/eczema/diagnoses/${diagnosisId}`, getAuthHeaders());
      return {
        ...response.data,
        data: {
          ...response.data.data,
          _id: response.data.data.diagnosisId,
          confidenceScore: response.data.data.confidence,
        },
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error((error.response?.data as any)?.message || 'Failed to fetch diagnosis');
      }
      throw error;
    }
  },

  // Add doctor's review
  addDoctorReview: async (
    diagnosisId: string,
    reviewData: {
      review: string;
      updatedSeverity?: 'Mild' | 'Moderate' | 'Severe';
      treatmentPlan: string;
    }
  ): Promise<ApiResponse<Diagnosis>> => {
    try {
      const response = await apiClient.post(`/eczema/diagnoses/${diagnosisId}/review`, reviewData, getAuthHeaders());
      return {
        ...response.data,
        data: {
          ...response.data.data,
          _id: response.data.data.diagnosisId,
          confidenceScore: response.data.data.confidence,
        },
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error((error.response?.data as any)?.message || 'Failed to add doctor review');
      }
      throw error;
    }
  },
};