// src/hooks/useApi.js

import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';

// --- 1. Axios Instance Setup (Internal to the hook) ---

// Get base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Inject the JWT token into every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Global error handling, especially for 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("401 Unauthorized: Session may have expired. Logging out.");
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
    }
    return Promise.reject(error);
  }
);


// --- 2. The Custom Hook ---

/**
 * Custom hook for making API calls with Axios and managing loading/error states.
 * * @returns {object} { execute, data, error, isLoading, apiClient }
 */
export const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const execute = useCallback(async (url, method = 'get', body = null, config = {}) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      let response;
      const lowerCaseMethod = method.toLowerCase();

      switch (lowerCaseMethod) {
        case 'get':
          response = await apiClient.get(url, config);
          break;
        case 'post':
          response = await apiClient.post(url, body, config);
          break;
        case 'put':
          response = await apiClient.put(url, body, config);
          break;
        case 'delete':
          response = await apiClient.delete(url, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      setData(response.data);
      setIsLoading(false);
      return response.data;

    } catch (err) {
      setError(err.response ? err.response.data : { message: err.message });
      setIsLoading(false);
      throw err; 
    }
  }, []);

  return { execute, data, error, isLoading, setData, setError, apiClient };
};