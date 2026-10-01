import { api } from '@/lib/api';
import type { AuthResponse, Usuario } from '@/types';
import type { LoginForm } from '@/schemas/auth.schema';

export const authService = {
  async login(payload: LoginForm): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },
  async me(): Promise<Usuario> {
    const response = await api.get<Usuario>('/auth/me');
    return response.data;
  },
};
