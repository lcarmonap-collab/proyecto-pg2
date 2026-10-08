import { AppError } from '../utils/AppError';

import {
  ProductorRepository
} from '../repositories/productor.repository';

import {
  CreateProductorDto,
  ProductorQuery,
  UpdateProductorDto
} from '../schemas/productor.schema';

export class ProductorService {

  constructor(
    private readonly repo =
      new ProductorRepository()
  ) {}

  list(query: ProductorQuery) {
    return this.repo.list(query);
  }

  async get(id: number) {

    const productor =
      await this.repo.findById(id);

    if (!productor) {
      throw new AppError(
        404,
        'PRODUCTOR_NOT_FOUND',
        'Productor no encontrado.'
      );
    }

    return productor;
  }

  async create(
    dto: CreateProductorDto
  ) {

    const existing =
      await this.repo.findByCui(dto.cui);

    if (existing) {
      throw new AppError(
        409,
        'CUI_EXISTS',
        'El CUI/DPI ya está registrado.'
      );
    }

    return this.repo.create(dto);
  }

  async update(
    id: number,
    dto: UpdateProductorDto
  ) {

    await this.get(id);

    if (dto.cui) {

      const existing =
        await this.repo.findByCui(dto.cui);

      if (
        existing &&
        existing.id !== id
      ) {
        throw new AppError(
          409,
          'CUI_EXISTS',
          'El CUI/DPI ya está registrado.'
        );
      }
    }

    return this.repo.update(
      id,
      dto
    );
  }

  async remove(id: number) {

    await this.get(id);

    return this.repo.softDelete(id);
  }
}
