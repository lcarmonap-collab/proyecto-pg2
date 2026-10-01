
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import {
  CreateParcelaDto,
  ParcelaQuery,
  UpdateParcelaDto
} from '../schemas/parcela.schema';

export class ParcelaRepository {
  async list(query: ParcelaQuery) {
    const {
      page,
      limit,
      codigo,
      productorId,
      departamentoId,
      municipioId,
      sortBy,
      sortOrder
    } = query;

    const where: Prisma.ParcelaWhereInput = {
      ...(codigo ? { codigo: { contains: codigo } } : {}),
      ...(productorId ? { productorId } : {}),
      ...(departamentoId ? { departamentoId } : {}),
      ...(municipioId ? { municipioId } : {})
    };

    const [items, total] = await prisma.$transaction([
      prisma.parcela.findMany({
        where,
        include: {
          productor: true,
          departamento: true,
          municipio: true
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.parcela.count({ where })
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
    return prisma.parcela.findUnique({
      where: { id },
      include: {
        productor: true,
        departamento: true,
        municipio: true,
        cosechas: true
      }
    });
  }

  findByCodigo(codigo: string) {
    return prisma.parcela.findUnique({
      where: { codigo }
    });
  }

  create(data: CreateParcelaDto) {
    const {
      codigo,
      productorId,
      departamentoId,
      municipioId,
      areaHectareas,
      tenencia,
      latitud,
      longitud
    } = data;

    return prisma.parcela.create({
      data: {
        codigo,
        productorId,
        departamentoId,
        municipioId,
        extension: areaHectareas,
        tenenciaTierra: tenencia,
        latitud,
        longitud
      }
    });
  }

  update(id: number, data: UpdateParcelaDto) {
    const {
      areaHectareas,
      tenencia,
      ...resto
    } = data;

    const datosActualizados: Prisma.ParcelaUncheckedUpdateInput = {
      ...resto,
      ...(areaHectareas !== undefined
        ? { extension: areaHectareas }
        : {}),
      ...(tenencia !== undefined
        ? { tenenciaTierra: tenencia }
        : {})
    };

    return prisma.parcela.update({
      where: { id },
      data: datosActualizados
    });
  }

  async softDelete(id: number) {
    // El modelo actual no tiene campo "activo".
    // Se realiza una eliminación definitiva.
    return prisma.parcela.delete({
      where: { id }
    });
  }
}
