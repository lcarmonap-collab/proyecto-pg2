
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import {
  CreateProductorDto,
  ProductorQuery,
  UpdateProductorDto
} from '../schemas/productor.schema';

export class ProductorRepository {
  async list(query: ProductorQuery) {
    const {
      page,
      limit,
      cui,
      nombre,
      departamentoId,
      municipioId,
      sortBy,
      sortOrder
    } = query;

    const where: Prisma.ProductorWhereInput = {
      ...(cui ? { cui: { contains: cui } } : {}),
      ...(nombre
        ? {
            OR: [
              { nombres: { contains: nombre } },
              { apellidos: { contains: nombre } }
            ]
          }
        : {}),
      ...(departamentoId ? { departamentoId } : {}),
      ...(municipioId ? { municipioId } : {})
    };

    const [items, total] = await prisma.$transaction([
      prisma.productor.findMany({
        where,
        include: {
          departamento: true,
          municipio: true,
          comunidad: true
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.productor.count({ where })
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  findById(id: number) {
    return prisma.productor.findUnique({
      where: { id },
      include: {
        departamento: true,
        municipio: true,
        comunidad: true,
        parcelas: true
      }
    });
  }

  findByCui(cui: string) {
    return prisma.productor.findUnique({
      where: { cui }
    });
  }

  create(data: CreateProductorDto) {
    return prisma.productor.create({ data });
  }

  update(id: number, data: UpdateProductorDto) {
    return prisma.productor.update({
      where: { id },
      data
    });
  }

  async softDelete(id: number) {
    // Eliminación real: el modelo no tiene campo "activo".
    return prisma.productor.delete({
      where: { id }
    });
  }
}
