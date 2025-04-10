import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers and check role
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;
  
  if (!token || !userData) {
    throw new Error('Authentication required');
  }
  
  // if (userData.role !== 'doctor' && userData.role !== 'admin') {
  //   throw new Error('Access denied. Only doctors and administrators can view analytics.');
  // }
  
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };
};

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
    const headers = getAuthHeaders();
    if (!headers) throw new Error('Cannot make request during SSR');
    
    const response = await axios.get(`${API_BASE_URL}/analytics/age-distribution`, headers);
    return response.data.data.ageGroups;
  }

  async getGeographicalDistribution(): Promise<GeographicalDistribution[]> {
    const headers = getAuthHeaders();
    if (!headers) throw new Error('Cannot make request during SSR');
    
    const response = await axios.get(`${API_BASE_URL}/analytics/geographical-distribution`, headers);
    return response.data.data.regions;
  }

  async getTreatmentEffectiveness(): Promise<TreatmentEffectiveness[]> {
    const headers = getAuthHeaders();
    if (!headers) throw new Error('Cannot make request during SSR');
    
    const response = await axios.get(`${API_BASE_URL}/analytics/treatment-effectiveness`, headers);
    return response.data.data.treatments;
  }

  async getModelConfidence(): Promise<ModelConfidence[]> {
    const headers = getAuthHeaders();
    if (!headers) throw new Error('Cannot make request during SSR');
    
    const response = await axios.get(`${API_BASE_URL}/analytics/model-confidence`, headers);
    return response.data.data.confidenceLevels;
  }

  async getDiagnosisHistory(startDate?: string, endDate?: string): Promise<DiagnosisHistory[]> {
    const headers = getAuthHeaders();
    if (!headers) throw new Error('Cannot make request during SSR');
    
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await axios.get(
      `${API_BASE_URL}/analytics/diagnosis-history?${params.toString()}`,
      headers
    );
    return response.data.data.history;
  }
}

export const analyticsService = new AnalyticsService();
