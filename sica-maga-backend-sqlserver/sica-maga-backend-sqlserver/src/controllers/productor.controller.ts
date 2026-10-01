import { Request, Response } from 'express';
import { ProductorService } from '../services/productor.service';
import { createProductorSchema, productorQuerySchema, updateProductorSchema } from '../schemas/productor.schema';
import { AppError } from '../utils/AppError';

export class ProductorController {
  constructor(private readonly service = new ProductorService()) {}
  list = async (req: Request, res: Response) => res.json({ success: true, data: await this.service.list(productorQuerySchema.parse(req.query)) });
  get = async (req: Request, res: Response) => res.json({ success: true, data: await this.service.get(this.id(req)) });
  create = async (req: Request, res: Response) => res.status(201).json({ success: true, data: await this.service.create(createProductorSchema.parse(req.body)) });
  update = async (req: Request, res: Response) => res.json({ success: true, data: await this.service.update(this.id(req), updateProductorSchema.parse(req.body)) });
  remove = async (req: Request, res: Response) => { await this.service.remove(this.id(req)); res.status(204).send(); };
  private id(req: Request) { const id = Number(req.params.id); if (!Number.isInteger(id) || id <= 0) throw new AppError(400, 'INVALID_ID', 'El ID debe ser un entero positivo.'); return id; }
}
