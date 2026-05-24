import axios, { AxiosInstance } from "axios";

// BrandsGateway API configuration
const BRANDSGATEWAY_API_URL = "https://api.brandsgateway.com/api/v1";

// Create axios instance with default config
export const brandsGatewayAPI: AxiosInstance = axios.create({
  baseURL: BRANDSGATEWAY_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add API key
brandsGatewayAPI.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_BRANDSGATEWAY_API_KEY;
    const apiSecret = import.meta.env.VITE_BRANDSGATEWAY_API_SECRET;

    if (apiKey && apiSecret) {
      // BrandsGateway uses Basic Auth with API key and secret
      const credentials = btoa(`${apiKey}:${apiSecret}`);
      config.headers.Authorization = `Basic ${credentials}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
brandsGatewayAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("BrandsGateway API Error:", error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("BrandsGateway API: No response received");
    } else {
      // Error in request setup
      console.error("BrandsGateway API Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default brandsGatewayAPI;
