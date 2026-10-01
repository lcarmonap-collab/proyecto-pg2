
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Registrar el error real en la terminal del backend
  console.error('\n========== ERROR SICA-MAGA ==========');
  console.error('Ruta:', req.method, req.originalUrl);

  if (error instanceof Error) {
    console.error('Tipo:', error.name);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
  } else {
    console.error('Error:', error);
  }

  console.error('====================================\n');

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {})
      }
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos.',
        details: error.flatten()
      }
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DB_UNIQUE_CONSTRAINT',
          message: 'El registro ya existe.',
          details: error.meta
        }
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DB_NOT_FOUND',
          message: 'Registro no encontrado.'
        }
      });
    }

    return res.status(400).json({
      success: false,
      error: {
        code: `DB_${error.code}`,
        message: 'La operación de base de datos no pudo completarse.',
        details: error.meta
      }
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor.'
    }
  });
};
