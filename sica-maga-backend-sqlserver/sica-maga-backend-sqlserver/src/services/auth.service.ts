
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { LoginDto } from '../schemas/auth.schema';
import { JwtAccessPayload, JwtRefreshPayload } from '../types/auth';

export class AuthService {
  constructor(private readonly usuarios = new UsuarioRepository()) {}

  // INICIAR SESIÓN
  async login(dto: LoginDto) {
    const usuario = await this.usuarios.findByCorreo(
      dto.correo.toLowerCase()
    );

    if (!usuario || !usuario.activo) {
      throw new AppError(
        401,
        'AUTH_INVALID',
        'Credenciales inválidas.'
      );
    }

    // El modelo de Prisma utiliza el campo password.
    const valid = await bcrypt.compare(
      dto.password,
      usuario.password
    );

    if (!valid) {
      throw new AppError(
        401,
        'AUTH_INVALID',
        'Credenciales inválidas.'
      );
    }

    return this.generarTokens(usuario);
  }

  // GENERAR TOKENS
  private async generarTokens(
    usuario: NonNullable<
      Awaited<ReturnType<UsuarioRepository['findByCorreo']>>
    >
  ) {
    const accessPayload: JwtAccessPayload = {
      sub: String(usuario.id),
      email: usuario.correo,
      role: usuario.rol.nombre as JwtAccessPayload['role'],
      type: 'access'
    };

    const refreshPayload: JwtRefreshPayload = {
      sub: String(usuario.id),
      type: 'refresh'
    };

    const accessToken = jwt.sign(
      accessPayload,
      env.JWT_ACCESS_SECRET,
      {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    );

    const refreshToken = jwt.sign(
      refreshPayload,
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    );

    // Guardar el refresh token usando el campo definido en Prisma.
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        usuarioId: usuario.id
      }
    });

    return {
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        nombreCompleto: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol.nombre
      }
    };
  }

  // RENOVAR TOKEN
  async refresh(refreshToken: string) {
    let payload: JwtRefreshPayload;

    try {
      payload = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
      ) as JwtRefreshPayload;
    } catch {
      throw new AppError(
        401,
        'REFRESH_INVALID',
        'Refresh token inválido o expirado.'
      );
    }

    if (payload.type !== 'refresh') {
      throw new AppError(
        401,
        'REFRESH_INVALID',
        'Tipo de token inválido.'
      );
    }

    // Buscar el token en la base de datos.
    const stored = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken
      },
      include: {
        usuario: {
          include: {
            rol: true
          }
        }
      }
    });

    if (!stored || !stored.usuario.activo) {
      throw new AppError(
        401,
        'REFRESH_INVALID',
        'Refresh token inválido o expirado.'
      );
    }

    // Eliminar el token anterior para evitar su reutilización.
    await prisma.refreshToken.delete({
      where: {
        id: stored.id
      }
    });

    // Generar nuevos tokens.
    return this.generarTokens(stored.usuario);
  }

  // CERRAR SESIÓN
  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken
      }
    });
  }

  // OBTENER USUARIO AUTENTICADO
  async me(id: number) {
    const usuario = await this.usuarios.findById(id);

    if (!usuario || !usuario.activo) {
      throw new AppError(
        404,
        'USER_NOT_FOUND',
        'Usuario no encontrado.'
      );
    }

    return {
      id: usuario.id,
      nombreCompleto: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol.nombre
    };
  }
}
