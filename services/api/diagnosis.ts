import axios, { AxiosError } from 'axios';
import { apiClient } from '../apiClient';

export interface PreDiagnosisData {
  eczemaHistory: 'new' | '<1' | '1-5' | '5-10' | '>10';
  lastFlareup: 'current' | '<1w' | '1-4w' | '1-6m' | '>6m';
  flareupTriggers: string[];
  currentSymptoms: string;
  previousTreatments: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface PostDiagnosisData {
  diagnosisAccuracy: number;
  diagnosisHelpfulness: number;
  treatmentClarity: number;
  userConfidence: number;
  feedback: string;
  wouldRecommend: boolean;
}

export interface Diagnosis {
  id: string;
  _id: string;
  patientId: string;
  imageUrl: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  confidenceScore: number;
  bodyPart: string;
  isEczema: string;
  recommendations: string[];
  needsDoctorReview: boolean;
  status: 'pending_review' | 'completed' | 'reviewed';
  confidence: number;
  bodyPartConfidence: number;
  createdAt: string;
  preDiagnosisSurvey?: PreDiagnosisData;
  postDiagnosisSurvey?: PostDiagnosisData;
  doctorReview?: {
    doctorId: string;
    review: string;
    reviewedAt: string;
    updatedSeverity: 'Mild' | 'Moderate' | 'Severe';
    treatmentPlan: string;
  };
}

export interface DiagnosisFeedback {
  preDiagnosisSurvey?: PreDiagnosisData;
  postDiagnosisSurvey?: PostDiagnosisData;
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
  uploadImage: async (imageFile: File, preDiagnosisData?: PreDiagnosisData): Promise<ApiResponse<{
    diagnosisId: string;
    isEczema: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    confidence: number;
    bodyPart: string;
    recommendations: string[];
    needsDoctorReview: boolean;
    imageUrl: string;
  }>> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    if (preDiagnosisData) {
      formData.append('preDiagnosisData', JSON.stringify(preDiagnosisData));
    }

    try {
      const response = await apiClient.post('/eczema/diagnose', formData, {
        headers: {
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
      const response = await apiClient.get('/eczema/diagnoses');
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
      const response = await apiClient.get(`/eczema/diagnoses/${diagnosisId}`);
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
      const response = await apiClient.post(`/eczema/diagnoses/${diagnosisId}/review`, reviewData);
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

  // Fetch diagnoses that requested a doctor review (for doctors)
  getDoctorReviewRequests: async (): Promise<ApiResponse<Diagnosis[]>> => {
    try {
      const response = await apiClient.get('/eczema/doctor-reviews');
      return {
        ...response.data,
        data: response.data.data.map((d: any) => ({
          ...d,
          _id: d.diagnosisId || d._id,
          confidenceScore: d.confidence || d.confidenceScore,
        })),
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error((error.response?.data as any)?.message || 'Failed to fetch doctor review requests');
      }
      throw error;
    }
  },

  // Fetch diagnoses reviewed by the logged-in doctor (for doctors)
  getReviewedDiagnosesByDoctor: async (): Promise<ApiResponse<Diagnosis[]>> => {
    try {
      const response = await apiClient.get('/eczema/doctor/reviewed-diagnoses');
      return {
        ...response.data,
        data: response.data.data.map((d: any) => ({
          ...d,
          _id: d.diagnosisId || d._id,
          confidenceScore: d.confidence || d.confidenceScore,
        })),
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error((error.response?.data as any)?.message || 'Failed to fetch reviewed diagnoses');
      }
      throw error;
    }
  },

  // Submit feedback (pre/post diagnosis)
  submitFeedback: async (
    diagnosisId: string,
    feedbackData: Partial<{
      preDiagnosisSurvey: PreDiagnosisData;
      postDiagnosisSurvey: PostDiagnosisData;
    }> & Partial<PostDiagnosisData> // for legacy support
  ): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const response = await apiClient.post(
        `/eczema/diagnoses/${diagnosisId}/feedback`,
        feedbackData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error((error.response?.data as any)?.message || 'Failed to submit feedback');
      }
      throw error;
    }
  },
  
  // Get feedback (pre/post diagnosis)
  getFeedback: async (
    diagnosisId: string
  ): Promise<ApiResponse<DiagnosisFeedback>> => {
    try {
      const response = await apiClient.get(
        `/eczema/diagnoses/${diagnosisId}/feedback`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error((error.response?.data as any)?.message || 'Failed to fetch feedback');
      }
      throw error;
    }
  },

  // Claim diagnosis
  claimDiagnosis: async (diagnosisId: string): Promise<ApiResponse<Diagnosis>> => {
    try {
      const response = await apiClient.post(
        `/eczema/diagnoses/${diagnosisId}/claim`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error((error.response?.data as any)?.message || 'Failed to claim diagnosis');
      }
      throw error;
    }
  },
};