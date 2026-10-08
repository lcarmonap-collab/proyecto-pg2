import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/lib/env';
import type { ApiResponse, AuthResponse } from '@/types';

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

let refreshPromise: Promise<string | null> | null = null;

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('sica_maga_refresh_token')
      : null;

  if (!refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiResponse<AuthResponse>>(
        `${env.apiUrl}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      )
      .then((response) => {
        const data = response.data?.data;

        if (
          !response.data?.success ||
          !data?.accessToken ||
          !data?.refreshToken ||
          !data?.usuario
        ) {
          throw new Error('Respuesta de refresh inválida.');
        }

        sessionStorage.setItem(
          'sica_maga_token',
          data.accessToken
        );

        sessionStorage.setItem(
          'sica_maga_refresh_token',
          data.refreshToken
        );

        sessionStorage.setItem(
          'sica_maga_user',
          JSON.stringify(data.usuario)
        );

        return data.accessToken;
      })
      .catch(() => {
        sessionStorage.removeItem('sica_maga_token');
        sessionStorage.removeItem('sica_maga_user');
        sessionStorage.removeItem('sica_maga_refresh_token');

        window.dispatchEvent(
          new Event('sica-maga:unauthorized')
        );

        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('sica_maga_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (
      error.response?.status !== 401 ||
      typeof window === 'undefined'
    ) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryConfig | undefined;
    const requestUrl = originalRequest?.url ?? '';

    const isAuthRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/logout');

    if (!originalRequest || originalRequest._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization =
      `Bearer ${newAccessToken}`;

    return api(originalRequest);
  },
);
