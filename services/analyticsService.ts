import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/age-distribution`, {
        withCredentials: true, // Send cookies with the request
      });
      return response.data.data.ageGroups;
    } catch (error: any) {
      console.error('Age Distribution Error:', error?.response?.data || error?.message);
      throw error;
    }
  }

  async getGeographicalDistribution(): Promise<GeographicalDistribution[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/geographical-distribution`, {
        withCredentials: true, // Send cookies with the request
      });
      return response.data.data.regions;
    } catch (error: any) {
      console.error('Geographical Distribution Error:', error?.response?.data || error?.message);
      throw error;
    }
  }

  async getTreatmentEffectiveness(): Promise<TreatmentEffectiveness[]> {
    try { 
      const response = await axios.get(`${API_BASE_URL}/analytics/treatment-effectiveness`, {
        withCredentials: true, // Send cookies with the request
      });
      return response.data.data.treatments;
    } catch (error: any) {
      console.error('Treatment Effectiveness Error:', error?.response?.data || error?.message);
      throw error;
    }
  }

  async getModelConfidence(): Promise<ModelConfidence[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/model-confidence`, {
        withCredentials: true, // Send cookies with the request
      });
      return response.data.data.confidenceLevels;
    } catch (error: any) {
      console.error('Model Confidence Error:', error?.response?.data || error?.message);
      throw error;
    }
  }

  async getDiagnosisHistory(startDate?: string, endDate?: string): Promise<DiagnosisHistory[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
    
      const response = await axios.get(
        `${API_BASE_URL}/analytics/diagnosis-history?${params.toString()}`,
        {
          withCredentials: true, // Send cookies with the request
        }
      );
      return response.data.data.history;
    } catch (error: any) {
      console.error('Diagnosis History Error:', error?.response?.data || error?.message);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
