import { Request, Response } from 'express';
import { ParcelaService } from '../services/parcela.service';
import { createParcelaSchema, parcelaQuerySchema, updateParcelaSchema } from '../schemas/parcela.schema';
import { AppError } from '../utils/AppError';

export class ParcelaController {
  constructor(private readonly service = new ParcelaService()) {}
  list = async (req: Request, res: Response) => res.json({ success: true, data: await this.service.list(parcelaQuerySchema.parse(req.query)) });
  get = async (req: Request, res: Response) => res.json({ success: true, data: await this.service.get(this.id(req)) });
  create = async (req: Request, res: Response) => res.status(201).json({ success: true, data: await this.service.create(createParcelaSchema.parse(req.body)) });
  update = async (req: Request, res: Response) => res.json({ success: true, data: await this.service.update(this.id(req), updateParcelaSchema.parse(req.body)) });
  remove = async (req: Request, res: Response) => { await this.service.remove(this.id(req)); res.status(204).send(); };
  private id(req: Request) { const id = Number(req.params.id); if (!Number.isInteger(id) || id <= 0) throw new AppError(400, 'INVALID_ID', 'El ID debe ser un entero positivo.'); return id; }
}
