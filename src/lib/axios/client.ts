import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError, ApiResponse } from "../../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // Return the data directly since our backend wraps it
    return response;
  },
  (error: AxiosError<ApiError>) => {
    const { response } = error;

    // Handle specific error codes
    if (response?.status === 401) {
      // Unauthorized - clear storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Extract error message from our backend format
    const errorMessage =
      response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Create a standardized error
    const standardError = {
      success: false,
      statusCode: response?.status || 500,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: error.config?.url || "",
      method: error.config?.method?.toUpperCase() || "UNKNOWN",
    };

    return Promise.reject(standardError);
  }
);

export default apiClient;
export { API_BASE_URL };
