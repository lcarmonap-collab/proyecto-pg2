export interface Productor {
  id: number;
  cui: string;
  nombres: string;
  apellidos: string;
  telefono?: string | null;
  direccion?: string | null;
  cooperativa?: string | null;
  fechaRegistro: string;
  departamentoId: number;
  municipioId: number;
  comunidadId?: number | null;

  departamento?: {
    id: number;
    nombre: string;
  } | null;

  municipio?: {
    id: number;
    nombre: string;
  } | null;

  comunidad?: {
    id: number;
    nombre: string;
  } | null;

  parcelas?: unknown[];
}

export type Role =
  | 'SUPERADMIN'
  | 'TECNICO_CAMPO'
  | 'CONSULTOR_AUDITOR';

export interface Usuario {
  id: number;
  nombres?: string;
  apellidos?: string;
  nombre?: string;
  nombreCompleto?: string;
  correo?: string;
  usuario?: string;
  rol: Role;
  rolId?: number;
  activo?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: Usuario;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface Parcela {
  id: number;
  codigo: string;
  extension: number;
  tenenciaTierra: string;
  latitud: number;
  longitud: number;
  fechaRegistro: string;
  productorId: number;
  departamentoId: number;
  municipioId: number;
}
