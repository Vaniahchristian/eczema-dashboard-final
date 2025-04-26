import axios from 'axios';
import { API_URL } from '../lib/config';
import { apiClient } from './apiClient';

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

export interface AnalyticsTimeRange {
  start: Date;
  end: Date;
}

export interface PreDiagnosisAnalytics {
  totalResponses: number;
  eczemaHistoryDistribution: Record<string, number>;
  commonTriggers: Record<string, number>;
  severityDistribution: Record<string, number>;
}

export interface PostDiagnosisAnalytics {
  totalFeedbacks: number;
  avgDiagnosisAccuracy: number;
  avgHelpfulness: number;
  avgTreatmentClarity: number;
  avgUserConfidence: number;
  recommendationRate: number;
  feedbackSentiments: string[];
}

export interface SurveyAnalytics {
  preDiagnosisAnalytics: PreDiagnosisAnalytics;
  postDiagnosisAnalytics: PostDiagnosisAnalytics;
}

export interface SurveyAnalyticsNew {
  preDiagnosis: {
    totalResponses: number;
    eczemaHistoryDistribution: { history: string; count: number }[];
    commonTriggers: { trigger: string; count: number }[];
    severityDistribution: { severity: string; count: number }[];
  };
  postDiagnosis: {
    totalFeedbacks: number;
    avgDiagnosisAccuracy: number;
    avgHelpfulness: number;
    avgTreatmentClarity: number;
    avgUserConfidence: number;
    recommendationRate: number;
    feedbackSentiments: string[];
  };
}

export interface CorrelationAnalytics {
  severity: string;
  avgAccuracy: number;
  avgConfidence: number;
  count: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface DailyActiveUser {
  date: string;
  count: number;
}

export interface HourlyDiagnosis {
  hour: number;
  count: number;
}

export interface UserRetention {
  week: string;
  retained: number;
  total: number;
}

export interface UserActivity {
  date: string;
  diagnoses: number;
  messages: number;
  appointments: number;
}

export interface PatientSummary {
  totalDiagnoses: number;
  averageModelConfidence: number;
  mostCommonSeverity: string;
}

export interface BodyPartFrequency {
  bodyPart: string;
  count: number;
}

export interface ConfidenceTrend {
  date: string;
  confidence: number;
}

export interface RecentDiagnosis {
  diagnosisId: string;
  severity: string;
  confidence: number;
  bodyPart: string;
  recommendations: string[];
  needsDoctorReview: boolean;
  imageUrl: string;
  status: string;
  createdAt: string;
  doctorReview: {
    updatedSeverity?: string;
    review?: string;
    reviewedAt?: string;
    treatmentPlan?: string;
  };
}

class AnalyticsService {
  private axiosInstance = axios.create({
    baseURL: `${API_URL}/analytics`,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    // Add request interceptor to include auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

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

  async getUserDemographics(timeRange: TimeRange) {
    const response = await apiClient.get('/analytics/user-demographics', { params: timeRange });
    return response.data;
  }

  async getDiagnosisPatterns(timeRange: TimeRange) {
    const response = await apiClient.get('/analytics/diagnosis-patterns', { params: timeRange });
    return response.data;
  }

  async getTreatmentAnalytics(timeRange: TimeRange) {
    const response = await apiClient.get('/analytics/treatment-analytics', { params: timeRange });
    return response.data;
  }

  async getSurveyAnalytics(timeRange: TimeRange): Promise<SurveyAnalytics> {
    const response = await apiClient.get('/analytics/survey-analytics', { params: timeRange });
    return response.data;
  }

  async getSurveyAnalyticsNew(timeRange: TimeRange): Promise<SurveyAnalyticsNew> {
    try {
      const response = await apiClient.get('/analytics/surveys', { params: timeRange });
      return response.data;
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch survey analytics');
      }
      throw error;
    }
  }

  async getCorrelationAnalytics(timeRange: TimeRange): Promise<CorrelationAnalytics[]> {
    try {
      const response = await apiClient.get('/analytics/correlations', { params: timeRange });
      return response.data;
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch correlation analytics');
      }
      throw error;
    }
  }

  async getDoctorPerformance(timeRange: TimeRange) {
    const response = await apiClient.get('/analytics/doctor-performance', { params: timeRange });
    return response.data;
  }

  async getAppointmentAnalytics(timeRange: TimeRange) {
    const response = await apiClient.get('/analytics/appointment-analytics', { params: timeRange });
    return response.data;
  }

  async getClinicalInsights(timeRange: TimeRange) {
    const response = await apiClient.get('/analytics/clinical-insights', { params: timeRange });
    return response.data;
  }

  async getDailyActiveUsers(timeRange: TimeRange): Promise<DailyActiveUser[]> {
    const response = await apiClient.get('/analytics/daily-active-users', { params: timeRange });
    return response.data;
  }

  async getHourlyDiagnosisDistribution(timeRange: TimeRange): Promise<HourlyDiagnosis[]> {
    const response = await apiClient.get('/analytics/hourly-diagnoses', { params: timeRange });
    return response.data;
  }

  async getUserRetention(timeRange: TimeRange): Promise<UserRetention[]> {
    const response = await apiClient.get('/analytics/user-retention', { params: timeRange });
    return response.data;
  }

  async getUserActivity(timeRange: TimeRange): Promise<UserActivity[]> {
    const response = await apiClient.get('/analytics/user-activity', { params: timeRange });
    return response.data;
  }

  async exportEngagementData(type: ExportType, timeRange: TimeRange) {
    const response = await apiClient.get(`/analytics/export/${type}`, {
      params: {
        start: timeRange.start.toISOString(),
        end: timeRange.end.toISOString(),
      },
      responseType: "blob",
    });

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], {
      type: type === "analytics" ? "application/pdf" : "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-${timeRange.start.toISOString().split("T")[0]}-to-${
      timeRange.end.toISOString().split("T")[0]
    }.${type === "analytics" ? "pdf" : "csv"}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async getPatientSummary(): Promise<PatientSummary> {
    const response = await this.axiosInstance.get('/me/summary');
    return response.data.data;
  }

  async getPatientBodyPartFrequency(): Promise<BodyPartFrequency[]> {
    const response = await this.axiosInstance.get('/me/body-part-frequency');
    return response.data.data;
  }

  async getPatientModelConfidenceTrend(): Promise<ConfidenceTrend[]> {
    const response = await this.axiosInstance.get('/me/model-confidence-trend');
    return response.data.data;
  }

  async getPatientRecentDiagnoses(): Promise<RecentDiagnosis[]> {
    const response = await this.axiosInstance.get('/me/recent-diagnoses');
    return response.data.data;
  }

  async getPatientSeverityDistribution(): Promise<{ _id: string; count: number; }[]> {
    const response = await this.axiosInstance.get('/me/severity-distribution');
    return response.data.data;
  }

  async getPatientAvgConfidenceBySeverity(): Promise<{ _id: string; avgConfidence: number; count: number; }[]> {
    const response = await this.axiosInstance.get('/me/avg-confidence-by-severity');
    return response.data.data;
  }
}

export const analyticsService = new AnalyticsService();

export const analyticsApi = {
  getSurveyAnalytics: analyticsService.getSurveyAnalyticsNew.bind(analyticsService),
  getCorrelationAnalytics: analyticsService.getCorrelationAnalytics.bind(analyticsService)
};
