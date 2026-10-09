import { z } from 'zod';

export const parcelaSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(2, 'El código debe tener al menos 2 caracteres.')
    .max(50, 'El código no puede superar 50 caracteres.'),

  productorId: z
    .number()
    .int()
    .positive('Seleccione un productor.'),

  departamentoId: z
    .number()
    .int()
    .positive('Seleccione un departamento.'),

  municipioId: z
    .number()
    .int()
    .positive('Seleccione un municipio.'),

  areaHectareas: z
    .number()
    .positive('El área debe ser mayor a 0.')
    .max(100000, 'El área indicada es demasiado grande.'),

  latitud: z
    .number()
    .min(-90, 'Latitud inválida.')
    .max(90, 'Latitud inválida.'),

  longitud: z
    .number()
    .min(-180, 'Longitud inválida.')
    .max(180, 'Longitud inválida.'),

  tenencia: z.enum([
    'PROPIA',
    'ARRENDADA',
    'COMUNAL',
    'OTRA',
  ]),
});

export type ParcelaForm = z.infer<typeof parcelaSchema>;
