import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eczema-backend.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to attach auth token and log requests
apiClient.interceptors.request.use((config) => {
  console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✓ Token attached to request');
  } else {
    console.warn('⚠️ No auth token found in localStorage');
  }
  return config;
});

// Add response interceptor to handle errors and log responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error(`❌ Error in request to ${error.config?.url}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      error: error.message
    });

    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized access - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
