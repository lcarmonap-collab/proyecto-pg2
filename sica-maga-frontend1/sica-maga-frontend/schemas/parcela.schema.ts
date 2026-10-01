import { z } from 'zod';

export const parcelaSchema = z.object({
  idProductor: z.coerce.number().int().positive('Seleccione un productor'),
  nombreParcela: z.string().trim().min(2, 'Ingrese el nombre de la parcela').max(100),
  areaHectareas: z.coerce.number().positive('El área debe ser mayor a 0').max(100000),
  latitud: z.coerce.number().min(-90).max(90).optional(),
  longitud: z.coerce.number().min(-180).max(180).optional(),
  altitudMetros: z.coerce.number().min(0).max(10000).optional(),
  tipoSuelo: z.string().max(100).optional(),
  sistemaRiego: z.string().max(100).optional(),
  tenenciaTierra: z.enum(['Propia', 'Arrendada', 'Comunal', 'Otra']).optional(),
});

export type ParcelaForm = z.infer<typeof parcelaSchema>;
