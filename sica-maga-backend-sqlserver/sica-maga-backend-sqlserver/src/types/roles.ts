
// Definición de los roles del sistema SICA-MAGA
export const RolNombre = {
  SUPERADMIN: 'SUPERADMIN',
  TECNICO_CAMPO: 'TECNICO_CAMPO',
  CONSULTOR_AUDITOR: 'CONSULTOR_AUDITOR',
} as const;

// Tipo de dato para los roles
export type RolNombre =
  (typeof RolNombre)[keyof typeof RolNombre];