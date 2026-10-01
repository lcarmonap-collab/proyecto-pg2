import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/AppError';

export const validate = (schema: z.ZodTypeAny, target: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) return next(new AppError(400, 'VALIDATION_ERROR', 'Los datos enviados no son válidos.', result.error.flatten()));
    (req as any)[target] = result.data;
    next();
  };
