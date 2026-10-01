
import type { RolNombre } from './roles';

export interface JwtAccessPayload {
  sub: string;
  email: string;
  role: RolNombre;
  type: 'access';
}

export interface JwtRefreshPayload {
  sub: string;
  type: 'refresh';
}
