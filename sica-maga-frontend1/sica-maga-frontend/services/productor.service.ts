import { api } from '@/lib/api';
import type { Productor, ProductorListResponse } from '@/types';
import type { ProductorForm } from '@/schemas/productor.schema';

export const productorService = {
  async list(params: { page: number; limit: number; search?: string }): Promise<ProductorListResponse> {
    const response = await api.get<ProductorListResponse>('/productores', { params });
    return response.data;
  },
  async get(id: number): Promise<Productor> {
    const response = await api.get<Productor>(`/productores/${id}`);
    return response.data;
  },
  async create(payload: ProductorForm): Promise<Productor> {
    const response = await api.post<Productor>('/productores', payload);
    return response.data;
  },
  async update(id: number, payload: Partial<ProductorForm>): Promise<Productor> {
    const response = await api.put<Productor>(`/productores/${id}`, payload);
    return response.data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/productores/${id}`);
  },
};
