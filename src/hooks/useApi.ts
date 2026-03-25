import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sct-backend-tt4g.onrender.com/api', // Your backend API URL
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const useApi = <T = any>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<T>(url);
      
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const post = async (body: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(url, body);
      // Do NOT set data here, as this hook might be used for different data types
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.msg || 'An unexpected error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, post, refetch: fetchData };
};

export default useApi;