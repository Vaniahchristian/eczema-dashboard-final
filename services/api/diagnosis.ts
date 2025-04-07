import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eczema-backend.onrender.com/api/eczema';

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

export const diagnosisApi = {
  // Upload image and get diagnosis
  uploadImage: async (imageFile: File): Promise<DiagnosisResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post<DiagnosisResponse>(`${API_BASE_URL}/diagnose`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  },

  // Get all diagnoses
  getAllDiagnoses: async (): Promise<DiagnosisResponse> => {
    const response = await axios.get<DiagnosisResponse>(`${API_BASE_URL}/diagnoses`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get specific diagnosis
  getDiagnosis: async (diagnosisId: string): Promise<DiagnosisResponse> => {
    const response = await axios.get<DiagnosisResponse>(`${API_BASE_URL}/diagnoses/${diagnosisId}`, {
      withCredentials: true,
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
      `${API_BASE_URL}/diagnoses/${diagnosisId}/review`,
      reviewData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
};
