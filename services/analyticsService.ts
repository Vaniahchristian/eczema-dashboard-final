import axios from 'axios';
import { API_URL } from '../lib/config';

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

export type ExportType = 'patients' | 'diagnoses' | 'analytics';

class AnalyticsService {
  private axiosInstance = axios.create({
    baseURL: `${API_URL}/analytics`,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log('🚀 Making request:', {
          url: config.url,
          method: config.method,
          withCredentials: config.withCredentials,
          headers: config.headers,
        });
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('✅ Response received:', {
          url: response.config.url,
          status: response.status,
          statusText: response.statusText,
        });
        return response;
      },
      (error) => {
        console.error('❌ Response error:', {
          url: error.config?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        });
        return Promise.reject(error);
      }
    );
  }

  async getAgeDistribution(): Promise<AgeDistribution[]> {
    try {
      const response = await this.axiosInstance.get('/age-distribution');
      return response.data.data.ageGroups;
    } catch (error: any) {
      console.error('Age Distribution Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        cookies: document.cookie
      });
      throw error;
    }
  }

  async getGeographicalDistribution(): Promise<GeographicalDistribution[]> {
    try {
      const response = await this.axiosInstance.get('/geographical-distribution');
      return response.data.data.regions;
    } catch (error: any) {
      console.error('Geographical Distribution Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        cookies: document.cookie
      });
      throw error;
    }
  }

  async getTreatmentEffectiveness(): Promise<TreatmentEffectiveness[]> {
    try { 
      const response = await this.axiosInstance.get('/treatment-effectiveness');
      return response.data.data.treatments;
    } catch (error: any) {
      console.error('Treatment Effectiveness Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        cookies: document.cookie
      });
      throw error;
    }
  }

  async getModelConfidence(): Promise<ModelConfidence[]> {
    try {
      const response = await this.axiosInstance.get('/model-confidence');
      return response.data.data.confidenceLevels;
    } catch (error: any) {
      console.error('Model Confidence Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        cookies: document.cookie
      });
      throw error;
    }
  }

  async getDiagnosisHistory(startDate?: string, endDate?: string): Promise<DiagnosisHistory[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
    
      const response = await this.axiosInstance.get(
        `/diagnosis-history?${params.toString()}`
      );
      return response.data.data.history;
    } catch (error: any) {
      console.error('Diagnosis History Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        cookies: document.cookie,
        params: { startDate, endDate }
      });
      throw error;
    }
  }

  async exportData(type: ExportType, dateRange?: [Date, Date]): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append('startDate', dateRange[0].toISOString());
        params.append('endDate', dateRange[1].toISOString());
      }

      const response = await this.axiosInstance.get(`/export/${type}?${params.toString()}`, {
        responseType: 'blob'
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { 
        type: type === 'analytics' ? 'application/pdf' : 'text/csv' 
      });

      // Create a link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-export-${new Date().toISOString().split('T')[0]}.${type === 'analytics' ? 'pdf' : 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Export Error:', {
        type,
        dateRange,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        cookies: document.cookie
      });
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
