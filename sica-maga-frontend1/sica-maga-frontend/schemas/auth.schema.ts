
import { z } from 'zod';

export const loginSchema = z.object({
  correo: z.string()
    .trim()
    .email('Ingresa un correo electrónico válido')
    .max(150, 'El correo es demasiado largo'),

  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña es demasiado larga'),
});

export type LoginForm = z.infer<typeof loginSchema>;
