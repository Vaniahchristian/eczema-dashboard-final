import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eczema-backend.onrender.com/api';

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
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
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

    const response = await axios.post<ApiResponse<{
      diagnosisId: string;
      isEczema: boolean;
      severity: 'Mild' | 'Moderate' | 'Severe';
      confidence: number;
      bodyPart: string;
      recommendations: string[];
      needsDoctorReview: boolean;
      imageUrl: string;
    }>>(`${API_BASE_URL}/eczema/diagnose`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  },

  // Get all diagnoses
  getAllDiagnoses: async (): Promise<ApiResponse<Diagnosis[]>> => {
    const response = await axios.get<ApiResponse<Diagnosis[]>>(`${API_BASE_URL}/eczema/diagnoses`, {
      ...getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  },

  // Get specific diagnosis
  getDiagnosis: async (diagnosisId: string): Promise<ApiResponse<Diagnosis>> => {
    const response = await axios.get<ApiResponse<Diagnosis>>(`${API_BASE_URL}/eczema/diagnoses/${diagnosisId}`, {
      ...getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  },

  // Add doctor's review
  addDoctorReview: async (diagnosisId: string, reviewData: {
    review: string;
    updatedSeverity?: 'Mild' | 'Moderate' | 'Severe';
    treatmentPlan: string;
  }): Promise<ApiResponse<Diagnosis>> => {
    const response = await axios.post<ApiResponse<Diagnosis>>(
      `${API_BASE_URL}/eczema/diagnoses/${diagnosisId}/review`,
      reviewData,
      {
        ...getAuthHeaders(),
        withCredentials: true,
      }
    );
    return response.data;
  }
};
