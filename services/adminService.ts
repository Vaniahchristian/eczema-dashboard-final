import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class AdminService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });

    // Attach JWT token from localStorage automatically
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // USERS
  async getUsers() {
    const response = await this.axiosInstance.get('/users');
    return response.data;
  }

  async updateUser(id: string, data: any) {
    const response = await this.axiosInstance.put(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await this.axiosInstance.delete(`/users/${id}`);
    return response.data;
  }

  // ANALYTICS
  async getTotalUsers() {
    const response = await this.axiosInstance.get('/analytics/total-users');
    return response.data;
  }

  async getSystemUptime() {
    const response = await this.axiosInstance.get('/analytics/system-uptime');
    return response.data;
  }

  async getActiveSessions() {
    const response = await this.axiosInstance.get('/analytics/active-sessions');
    return response.data;
  }

  async getErrorRate() {
    const response = await this.axiosInstance.get('/analytics/error-rate');
    return response.data;
  }

  async getRecentActivity() {
    const response = await this.axiosInstance.get('/analytics/recent-activity');
    return response.data;
  }

  async getAlerts() {
    const response = await this.axiosInstance.get('/analytics/alerts');
    return response.data;
  }

  async getDiagnosesCount() {
    const response = await this.axiosInstance.get('/analytics/diagnoses-count');
    return response.data;
  }

  async exportAnalyticsReport() {
    const response = await this.axiosInstance.get('/analytics/export/analytics', { responseType: 'blob' });
    return response.data;
  }

  // System Monitoring
  async getCpuLoad() {
    const response = await this.axiosInstance.get('/analytics/cpu-load');
    return response.data;
  }

  async getMemoryUsage() {
    const response = await this.axiosInstance.get('/analytics/memory-usage');
    return response.data;
  }

  async getDatabaseStats() {
    const response = await this.axiosInstance.get('/analytics/database-stats');
    return response.data;
  }

  async getApiResponseTimes() {
    const response = await this.axiosInstance.get('/analytics/api-response-times')
    return response.data
  }

  async getSystemLogs() {
    const response = await this.axiosInstance.get('/analytics/system-logs')
    return response.data
  }

  // HEALTH CHECK
  async healthCheck() {
    const response = await this.axiosInstance.get('/health');
    return response.data;
  }
}

export const adminService = new AdminService();
