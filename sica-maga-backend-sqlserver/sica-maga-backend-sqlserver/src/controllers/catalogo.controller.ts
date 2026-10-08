import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class CatalogoController {

  async departamentos(
    _req: Request,
    res: Response
  ) {
    const departamentos =
      await prisma.departamento.findMany({
        orderBy: {
          nombre: 'asc'
        }
      });

    res.json({
      success: true,
      data: departamentos
    });
  }

  async municipios(
    req: Request,
    res: Response
  ) {
    const departamentoId =
      Number(req.query.departamentoId);

    if (
      !Number.isInteger(departamentoId) ||
      departamentoId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DEPARTAMENTO',
          message:
            'El departamentoId debe ser un entero positivo.'
        }
      });
    }

    const municipios =
      await prisma.municipio.findMany({
        where: {
          departamentoId
        },

        orderBy: {
          nombre: 'asc'
        }
      });

    return res.json({
      success: true,
      data: municipios
    });
  }

  async comunidades(
    req: Request,
    res: Response
  ) {
    const municipioId =
      Number(req.query.municipioId);

    if (
      !Number.isInteger(municipioId) ||
      municipioId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MUNICIPIO',
          message:
            'El municipioId debe ser un entero positivo.'
        }
      });
    }

    const comunidades =
      await prisma.comunidad.findMany({
        where: {
          municipioId
        },

        orderBy: {
          nombre: 'asc'
        }
      });

    return res.json({
      success: true,
      data: comunidades
    });
  }
}
