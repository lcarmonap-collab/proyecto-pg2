import { z } from 'zod';

export const productorSchema = z.object({
  cui: z
    .string()
    .regex(/^\d{13}$/, 'El CUI/DPI debe contener exactamente 13 dígitos.'),

  nombres: z
    .string()
    .trim()
    .min(2, 'Los nombres deben tener al menos 2 caracteres.')
    .max(100),

  apellidos: z
    .string()
    .trim()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres.')
    .max(100),

  telefono: z
    .string()
    .regex(/^\d{8}$/, 'El teléfono debe contener 8 dígitos.')
    .optional()
    .or(z.literal('')),

  correo: z
    .string()
    .trim()
    .email('Correo inválido.')
    .max(150)
    .optional()
    .or(z.literal('')),

  nit: z
    .string()
    .regex(/^\d{7,9}-?[0-9Kk]$/, 'Formato de NIT inválido.')
    .optional()
    .or(z.literal('')),

  direccion: z
    .string()
    .trim()
    .max(250)
    .optional()
    .or(z.literal('')),

  cooperativa: z
    .string()
    .trim()
    .max(150)
    .optional()
    .or(z.literal('')),

  departamentoId: z.coerce
    .number()
    .int()
    .positive(),

  municipioId: z.coerce
    .number()
    .int()
    .positive(),

  comunidadId: z.coerce
    .number()
    .int()
    .positive()
    .optional(),
});

export type ProductorForm = z.infer<typeof productorSchema>;
