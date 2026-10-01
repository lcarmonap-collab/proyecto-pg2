import { z } from 'zod';

export const loginSchema = z.object({
  correo: z.string().trim().email().max(150),
  password: z.string().min(8).max(128)
}).strict();

export const refreshSchema = z.object({
  refreshToken: z.string().min(20)
}).strict();

export type LoginDto = z.infer<typeof loginSchema>;
