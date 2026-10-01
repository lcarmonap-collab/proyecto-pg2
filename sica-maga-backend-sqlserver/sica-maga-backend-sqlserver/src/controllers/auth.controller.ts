import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema, refreshSchema } from '../schemas/auth.schema';
import { AppError } from '../utils/AppError';

export class AuthController {
  constructor(private readonly service = new AuthService()) {}
  login = async (req: Request, res: Response) => res.json({ success: true, data: await this.service.login(loginSchema.parse(req.body)) });
  refresh = async (req: Request, res: Response) => res.json({ success: true, data: await this.service.refresh(refreshSchema.parse(req.body).refreshToken) });
  logout = async (req: Request, res: Response) => { await this.service.logout(refreshSchema.parse(req.body).refreshToken); res.json({ success: true, data: null, message: 'Sesión cerrada correctamente.' }); };
  me = async (req: Request, res: Response) => { if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Autenticación requerida.'); res.json({ success: true, data: await this.service.me(Number(req.user.sub)) }); };
}
