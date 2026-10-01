import axios from 'axios';
import { env } from '@/lib/env';

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('sica_maga_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      sessionStorage.removeItem('sica_maga_token');
      sessionStorage.removeItem('sica_maga_user');
      window.dispatchEvent(new Event('sica-maga:unauthorized'));
    }
    return Promise.reject(error);
  },
);
