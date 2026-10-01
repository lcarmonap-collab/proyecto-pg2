import { prisma } from '../config/prisma';

export class UsuarioRepository {
  findByCorreo(correo: string) {
    return prisma.usuario.findUnique({
      where: { correo },
      include: { rol: true }
    });
  }

  findById(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      include: { rol: true }
    });
  }
}
