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
      ...(cui
        ? {
            cui: {
              contains: cui
            }
          }
        : {}),

      ...(nombre
        ? {
            OR: [
              {
                nombres: {
                  contains: nombre
                }
              },
              {
                apellidos: {
                  contains: nombre
                }
              }
            ]
          }
        : {}),

      ...(departamentoId
        ? {
            departamentoId
          }
        : {}),

      ...(municipioId
        ? {
            municipioId
          }
        : {})
    };

    const [items, total] =
      await prisma.$transaction([
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

        prisma.productor.count({
          where
        })
      ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: number) {

    return prisma.productor.findUnique({
      where: {
        id
      },

      include: {
        departamento: true,
        municipio: true,
        comunidad: true,
        parcelas: true
      }
    });
  }

  async findByCui(cui: string) {

    return prisma.productor.findUnique({
      where: {
        cui
      }
    });
  }

  async create(data: CreateProductorDto) {

    return prisma.productor.create({
      data: {
        cui: data.cui,
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono || null,
        direccion: data.direccion || null,
        cooperativa: data.cooperativa || null,
        departamentoId: data.departamentoId,
        municipioId: data.municipioId,
        comunidadId: data.comunidadId || null
      },

      include: {
        departamento: true,
        municipio: true,
        comunidad: true
      }
    });
  }

  async update(
    id: number,
    data: UpdateProductorDto
  ) {

    return prisma.productor.update({
      where: {
        id
      },

      data: {
        ...(data.cui !== undefined
          ? {
              cui: data.cui
            }
          : {}),

        ...(data.nombres !== undefined
          ? {
              nombres: data.nombres
            }
          : {}),

        ...(data.apellidos !== undefined
          ? {
              apellidos: data.apellidos
            }
          : {}),

        ...(data.telefono !== undefined
          ? {
              telefono: data.telefono || null
            }
          : {}),

        ...(data.direccion !== undefined
          ? {
              direccion: data.direccion || null
            }
          : {}),

        ...(data.cooperativa !== undefined
          ? {
              cooperativa:
                data.cooperativa || null
            }
          : {}),

        ...(data.departamentoId !== undefined
          ? {
              departamentoId:
                data.departamentoId
            }
          : {}),

        ...(data.municipioId !== undefined
          ? {
              municipioId:
                data.municipioId
            }
          : {}),

        ...(data.comunidadId !== undefined
          ? {
              comunidadId:
                data.comunidadId || null
            }
          : {})
      },

      include: {
        departamento: true,
        municipio: true,
        comunidad: true
      }
    });
  }

  async softDelete(id: number) {

    return prisma.productor.delete({
      where: {
        id
      }
    });
  }
}
