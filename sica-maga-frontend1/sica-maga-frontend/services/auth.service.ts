import { api } from '@/lib/api';

import type {
  ApiResponse,
  AuthResponse,
  Usuario,
} from '@/types';

import type {
  LoginForm,
} from '@/schemas/auth.schema';

export const authService = {
  async login(
    payload: LoginForm
  ): Promise<AuthResponse> {
    const response =
      await api.post<ApiResponse<AuthResponse>>(
        '/auth/login',
        payload
      );

    if (
      !response.data?.success ||
      !response.data?.data
    ) {
      throw new Error(
        'El servidor no devolvió una respuesta de autenticación válida.'
      );
    }

    return response.data.data;
  },

  async me(): Promise<Usuario> {
    const response =
      await api.get<ApiResponse<Usuario>>(
        '/auth/me'
      );

    if (
      !response.data?.success ||
      !response.data?.data
    ) {
      throw new Error(
        'No fue posible obtener los datos del usuario.'
      );
    }

    return response.data.data;
  },
};