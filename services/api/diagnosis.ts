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

export interface DiagnosisResponse {
  success: boolean;
  data: Diagnosis | Diagnosis[];
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
  uploadImage: async (imageFile: File): Promise<DiagnosisResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post<DiagnosisResponse>(`${API_BASE_URL}/eczema/diagnose`, formData, {
      ...getAuthHeaders()
    });
    return response.data;
  },

  // Get all diagnoses
  getAllDiagnoses: async (): Promise<DiagnosisResponse> => {
    const response = await axios.get<DiagnosisResponse>(`${API_BASE_URL}/eczema/diagnoses`, {
      ...getAuthHeaders()
    });
    return response.data;
  },

  // Get specific diagnosis
  getDiagnosis: async (diagnosisId: string): Promise<DiagnosisResponse> => {
    const response = await axios.get<DiagnosisResponse>(`${API_BASE_URL}/eczema/diagnoses/${diagnosisId}`, {
      ...getAuthHeaders()
    });
    return response.data;
  },

  // Add doctor's review
  addDoctorReview: async (diagnosisId: string, reviewData: {
    review: string;
    updatedSeverity?: 'Mild' | 'Moderate' | 'Severe';
    treatmentPlan: string;
  }): Promise<DiagnosisResponse> => {
    const response = await axios.post<DiagnosisResponse>(
      `${API_BASE_URL}/eczema/diagnoses/${diagnosisId}/review`,
      reviewData,
      {
        ...getAuthHeaders()
      }
    );
    return response.data;
  }
};
