
export type Role =
  | 'SUPERADMIN'
  | 'TECNICO_CAMPO'
  | 'CONSULTOR_AUDITOR';

export interface Usuario {
  // Identificador del usuario
  id: number;

  // Información personal
  nombreCompleto: string;
  correo: string;

  // Rol asignado
  rol: Role;

  // Información geográfica opcional
  departamentoId?: number;
  municipioId?: number;

  // Campos de compatibilidad con componentes existentes
  idUsuario?: number;
  usuario?: string;
  estado?: boolean;
}

// Respuesta de autenticación del backend
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: Usuario;
}

// Respuesta de renovación de token
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Productores agrícolas
export interface Productor {
  idProductor: number;
  idComunidad: number;
  nombres: string;
  apellidos: string;
  dpi?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  genero?: 'Masculino' | 'Femenino' | 'Otro';
  fechaNacimiento?: string;
  cooperativa?: string;
  fechaRegistro: string;
  estado: boolean;
  comunidad?: string;
  municipio?: string;
  departamento?: string;
}

// Respuesta de listado de productores
export interface ProductorListResponse {
  data: Productor[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Parcelas agrícolas
export interface Parcela {
  idParcela: number;
  idProductor: number;
  nombreParcela: string;
  areaHectareas: number;
  areaManzanas?: number;
  latitud?: number;
  longitud?: number;
  altitudMetros?: number;
  tipoSuelo?: string;
  sistemaRiego?: string;
  tenenciaTierra?: 'Propia' | 'Arrendada' | 'Comunal' | 'Otra';
  estado: boolean;
  productor?: string;
}

// Cultivos
export interface Cultivo {
  idCultivo: number;
  idTipoCultivo: number;
  nombreCultivo: string;
  unidadMedida: string;
  estado: boolean;
}

// Programas de apoyo
export interface ProgramaApoyo {
  idPrograma: number;
  nombrePrograma: string;
  descripcion?: string;
  tipoPrograma?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado: boolean;
}

// Respuesta estándar de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
