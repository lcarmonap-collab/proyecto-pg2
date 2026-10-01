
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { JwtAccessPayload } from '../types/auth';

export function authenticateJWT(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(
      new AppError(
        401,
        'AUTH_REQUIRED',
        'Se requiere un token Bearer.'
      )
    );
  }

  try {
    const payload = jwt.verify(
      header.substring(7),
      env.JWT_ACCESS_SECRET
    ) as JwtAccessPayload;

    if (payload.type !== 'access') {
      throw new Error('Tipo de token inválido.');
    }

    req.user = payload;
    next();
  } catch {
    next(
      new AppError(
        401,
        'TOKEN_INVALID',
        'Token inválido o expirado.'
      )
    );
  }
}

export function authorizeRoles(
  ...roles: JwtAccessPayload['role'][]
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new AppError(
          401,
          'AUTH_REQUIRED',
          'Autenticación requerida.'
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          'FORBIDDEN',
          'No tiene permisos para esta operación.'
        )
      );
    }

    next();
  };
}
