import { z } from 'zod';

export const productorSchema = z.object({
  idComunidad: z.coerce.number().int().positive(),
  nombres: z.string().trim().min(2).max(100),
  apellidos: z.string().trim().min(2).max(100),
  dpi: z.string().regex(/^\d{13}$/, 'El CUI/DPI debe contener exactamente 13 dígitos').optional().or(z.literal('')),
  telefono: z.string().regex(/^\d{8}$/, 'El teléfono debe contener 8 dígitos').optional().or(z.literal('')),
  correo: z.string().email('Correo inválido').optional().or(z.literal('')),
  direccion: z.string().max(250).optional(),
  genero: z.enum(['Masculino', 'Femenino', 'Otro']).optional(),
  cooperativa: z.string().max(150).optional(),
});

export type ProductorForm = z.infer<typeof productorSchema>;
