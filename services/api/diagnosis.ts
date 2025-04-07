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
    updatedSeverity: string;
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
    });
    return response.data;
  },

  // Get all diagnoses
  getAllDiagnoses: async (): Promise<DiagnosisResponse> => {
    const response = await axios.get<DiagnosisResponse>(`${API_BASE_URL}/diagnoses`);
    return response.data;
  },

  // Get specific diagnosis
  getDiagnosis: async (diagnosisId: string): Promise<DiagnosisResponse> => {
    const response = await axios.get<DiagnosisResponse>(`${API_BASE_URL}/diagnoses/${diagnosisId}`);
    return response.data;
  },

  // Add doctor's review
  addDoctorReview: async (diagnosisId: string, reviewData: {
    review: string;
    updatedSeverity?: string;
    treatmentPlan: string;
  }): Promise<DiagnosisResponse> => {
    const response = await axios.post<DiagnosisResponse>(
      `${API_BASE_URL}/diagnoses/${diagnosisId}/review`,
      reviewData
    );
    return response.data;
  }
};
