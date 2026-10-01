import { AppError } from '../utils/AppError';
import { ParcelaRepository } from '../repositories/parcela.repository';
import { CreateParcelaDto, ParcelaQuery, UpdateParcelaDto } from '../schemas/parcela.schema';

export class ParcelaService {
  constructor(private readonly repo = new ParcelaRepository()) {}
  list(query: ParcelaQuery) { return this.repo.list(query); }
  async get(id: number) {
    const item = await this.repo.findById(id);
    if (!item) throw new AppError(404, 'PARCELA_NOT_FOUND', 'Parcela no encontrada.');
    return item;
  }
  async create(dto: CreateParcelaDto) {
    if (await this.repo.findByCodigo(dto.codigo)) throw new AppError(409, 'PLOT_CODE_EXISTS', 'El código de parcela ya está registrado.');
    return this.repo.create(dto);
  }
  async update(id: number, dto: UpdateParcelaDto) {
    await this.get(id);
    if (dto.codigo) {
      const existing = await this.repo.findByCodigo(dto.codigo);
      if (existing && existing.id !== id) throw new AppError(409, 'PLOT_CODE_EXISTS', 'El código de parcela ya está registrado.');
    }
    return this.repo.update(id, dto);
  }
  async remove(id: number) { await this.get(id); return this.repo.softDelete(id); }
}
