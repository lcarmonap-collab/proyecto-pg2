import { z } from 'zod';

const cui = z
  .string()
  .regex(
    /^\d{13}$/,
    'El CUI/DPI debe contener exactamente 13 dígitos.'
  );

const telefono = z
  .string()
  .regex(
    /^\d{8}$/,
    'El teléfono debe contener exactamente 8 dígitos.'
  )
  .optional()
  .or(z.literal(''));

export const createProductorSchema = z
  .object({

    cui,

    nombres: z
      .string()
      .trim()
      .min(2)
      .max(100),

    apellidos: z
      .string()
      .trim()
      .min(2)
      .max(100),

    telefono,

    direccion: z
      .string()
      .trim()
      .max(255)
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
      .optional()

  })
  .strict();

export const updateProductorSchema =
  createProductorSchema
    .partial()
    .strict();

export const productorQuerySchema =
  z.object({

    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    cui: z
      .string()
      .regex(/^\d{0,13}$/)
      .optional(),

    nombre: z
      .string()
      .trim()
      .max(100)
      .optional(),

    departamentoId: z.coerce
      .number()
      .int()
      .positive()
      .optional(),

    municipioId: z.coerce
      .number()
      .int()
      .positive()
      .optional(),

    sortBy: z
      .enum([
        'nombres',
        'apellidos',
        'cui',
        'fechaRegistro'
      ])
      .default('fechaRegistro'),

    sortOrder: z
      .enum([
        'asc',
        'desc'
      ])
      .default('desc')

  })
  .strict();

export type CreateProductorDto =
  z.infer<typeof createProductorSchema>;

export type UpdateProductorDto =
  z.infer<typeof updateProductorSchema>;

export type ProductorQuery =
  z.infer<typeof productorQuerySchema>;