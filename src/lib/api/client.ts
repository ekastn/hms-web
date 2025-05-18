import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Define the shape of our API response
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Record<string, string[]>;
}

// Create axios instance with base config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // If the API response has a success flag, check it
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (!response.data.success) {
        return Promise.reject(new Error(response.data.message || 'Request failed'));
      }
      // Return just the data payload
      return response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle HTTP errors
      const { status, data } = error.response;
      let errorMessage = 'An error occurred';

      if (typeof data === 'object' && data !== null && 'message' in data) {
        errorMessage = (data as { message: string }).message;
      } else if (status === 401) {
        errorMessage = 'Unauthorized - Please log in';
      } else if (status === 403) {
        errorMessage = 'Forbidden - You do not have permission to perform this action';
      } else if (status === 404) {
        errorMessage = 'Resource not found';
      } else if (status === 422) {
        // Handle validation errors
        return Promise.reject({
          status,
          message: errorMessage,
          errors: data?.errors || {},
        });
      } else if (status >= 500) {
        errorMessage = 'Server error - Please try again later';
      }

      return Promise.reject({
        status,
        message: errorMessage,
        errors: data?.errors,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server');
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
      });
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
      return Promise.reject({
        message: error.message || 'An error occurred',
      });
    }
  }
);

// Helper function to make API requests with proper typing
export const apiRequest = async <T = any>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    });
    return response as unknown as T;
  } catch (error) {
    console.error(`API Error (${method.toUpperCase()} ${url}):`, error);
    throw error;
  }
};

// Enhanced API client with proper typing
const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiRequest('get', url, undefined, config);
  },
  
  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiRequest('post', url, data, config);
  },
  
  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return apiRequest('put', url, data, config);
  },
  
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiRequest('delete', url, undefined, config);
  },
};

export { apiClient as api, apiClient };

export default apiClient;
