import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eczema-backend.onrender.com/api';

export interface AgeDistribution {
  ageRange: string;
  count: number;
}

export interface GeographicalDistribution {
  location: string;
  count: number;
}

export interface TreatmentEffectiveness {
  type: string;
  effectiveness: number;
  totalCases: number;
}

export interface ModelConfidence {
  level: string;
  count: number;
  averageConfidence: number;
}

export interface DiagnosisHistory {
  date: string;
  totalCases: number;
  severeCases: number;
}

class AnalyticsService {
  async getAgeDistribution(): Promise<AgeDistribution[]> {
    const response = await axios.get(`${API_BASE_URL}/analytics/age-distribution`);
    return response.data.data.ageGroups;
  }

  async getGeographicalDistribution(): Promise<GeographicalDistribution[]> {
    const response = await axios.get(`${API_BASE_URL}/analytics/geographical-distribution`);
    return response.data.data.regions;
  }

  async getTreatmentEffectiveness(): Promise<TreatmentEffectiveness[]> {
    const response = await axios.get(`${API_BASE_URL}/analytics/treatment-effectiveness`);
    return response.data.data.treatments;
  }

  async getModelConfidence(): Promise<ModelConfidence[]> {
    const response = await axios.get(`${API_BASE_URL}/analytics/model-confidence`);
    return response.data.data.confidenceLevels;
  }

  async getDiagnosisHistory(startDate?: string, endDate?: string): Promise<DiagnosisHistory[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await axios.get(`${API_BASE_URL}/analytics/diagnosis-history?${params.toString()}`);
    return response.data.data.history;
  }
}

export const analyticsService = new AnalyticsService();
