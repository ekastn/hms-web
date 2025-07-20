import axios, { type AxiosInstance, type AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5021/api";

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
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
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
        // The backend wrapper returns a `data` property, we want to return that directly
        if (response.data && typeof response.data === "object" && "data" in response.data) {
            return response.data.data;
        }
        return response.data;
    },
    (error) => {
        if (error.response) {
            // Handle HTTP errors
            const { status, data } = error.response;
            let errorMessage = "An error occurred";

            if (typeof data === "object" && data !== null && "message" in data) {
                errorMessage = (data as { message: string }).message;
            } else if (status === 401) {
                errorMessage = "Unauthorized - Please log in";
                // The AuthContext will handle the logout
                window.dispatchEvent(new Event("unauthorized"));
            } else if (status === 403) {
                errorMessage = "Forbidden - You do not have permission to perform this action";
            } else if (status === 404) {
                errorMessage = "Resource not found";
            } else if (status >= 500) {
                errorMessage = "Server error - Please try again later";
            }

            return Promise.reject({
                status,
                message: errorMessage,
                errors: data?.errors,
            });
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject({
                message: "No response from server. Please check your connection.",
            });
        } else {
            // Something happened in setting up the request
            return Promise.reject({
                message: error.message || "An error occurred",
            });
        }
    }
);

export { api };
export default api;

