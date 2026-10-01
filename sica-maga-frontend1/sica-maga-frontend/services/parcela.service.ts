import { api } from '@/lib/api';
import type { Parcela } from '@/types';
import type { ParcelaForm } from '@/schemas/parcela.schema';

export const parcelaService = {
  async list(params?: { page?: number; limit?: number; productorId?: number }): Promise<Parcela[]> {
    const response = await api.get<Parcela[]>('/parcelas', { params });
    return response.data;
  },
  async get(id: number): Promise<Parcela> {
    const response = await api.get<Parcela>(`/parcelas/${id}`);
    return response.data;
  },
  async create(payload: ParcelaForm): Promise<Parcela> {
    const response = await api.post<Parcela>('/parcelas', payload);
    return response.data;
  },
  async update(id: number, payload: Partial<ParcelaForm>): Promise<Parcela> {
    const response = await api.put<Parcela>(`/parcelas/${id}`, payload);
    return response.data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/parcelas/${id}`);
  },
};
