import { Request, Response } from 'express';

import {
  ProductorService
} from '../services/productor.service';

import {
  createProductorSchema,
  productorQuerySchema,
  updateProductorSchema
} from '../schemas/productor.schema';

import { AppError } from '../utils/AppError';

export class ProductorController {

  constructor(
    private readonly service =
      new ProductorService()
  ) {}

  list = async (
    req: Request,
    res: Response
  ) => {

    const query =
      productorQuerySchema.parse(
        req.query
      );

    const data =
      await this.service.list(query);

    res.json({
      success: true,
      data
    });
  };

  get = async (
    req: Request,
    res: Response
  ) => {

    const id = this.getId(req);

    const data =
      await this.service.get(id);

    res.json({
      success: true,
      data
    });
  };

  create = async (
    req: Request,
    res: Response
  ) => {

    const data =
      createProductorSchema.parse(
        req.body
      );

    const productor =
      await this.service.create(data);

    res.status(201).json({
      success: true,
      data: productor
    });
  };

  update = async (
    req: Request,
    res: Response
  ) => {

    const id =
      this.getId(req);

    const data =
      updateProductorSchema.parse(
        req.body
      );

    const productor =
      await this.service.update(
        id,
        data
      );

    res.json({
      success: true,
      data: productor
    });
  };

  remove = async (
    req: Request,
    res: Response
  ) => {

    const id =
      this.getId(req);

    await this.service.remove(id);

    res.status(204).send();
  };

  private getId(
    req: Request
  ): number {

    const id =
      Number(req.params.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      throw new AppError(
        400,
        'INVALID_ID',
        'El ID debe ser un entero positivo.'
      );
    }

    return id;
  }
}
