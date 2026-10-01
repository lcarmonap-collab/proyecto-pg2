
import { z } from 'zod';

const latitude = z.number().min(-90).max(90);
const longitude = z.number().min(-180).max(180);

export const createParcelaSchema = z.object({
  codigo: z.string().trim().min(2).max(50),
  productorId: z.coerce.number().int().positive(),
  departamentoId: z.coerce.number().int().positive(),
  municipioId: z.coerce.number().int().positive(),
  nombre: z.string().trim().min(2).max(100),
  areaHectareas: z.coerce.number().positive().max(100000),
  areaManzanas: z.coerce.number().positive().max(100000).optional(),
  latitud: z.coerce.number().pipe(latitude),
  longitud: z.coerce.number().pipe(longitude),
  altitudMetros: z.coerce.number().min(-500).max(10000).optional(),
  tipoSuelo: z.string().trim().max(100).optional(),
  sistemaRiego: z.string().trim().max(100).optional(),
  tenencia: z.enum(['PROPIA', 'ARRENDADA', 'COMUNAL', 'OTRA'])
}).strict();

export const updateParcelaSchema =
  createParcelaSchema.partial().strict();

export const parcelaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  codigo: z.string().trim().max(50).optional(),
  productorId: z.coerce.number().int().positive().optional(),
  departamentoId: z.coerce.number().int().positive().optional(),
  municipioId: z.coerce.number().int().positive().optional(),
  sortBy: z.enum([
    'codigo',
    'nombre',
    'areaHectareas',
    'fechaRegistro'
  ]).default('fechaRegistro'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
}).strict();

export type CreateParcelaDto =
  z.infer<typeof createParcelaSchema>;

export type UpdateParcelaDto =
  z.infer<typeof updateParcelaSchema>;

export type ParcelaQuery =
  z.infer<typeof parcelaQuerySchema>;
