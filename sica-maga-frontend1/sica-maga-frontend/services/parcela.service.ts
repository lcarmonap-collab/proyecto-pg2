import { api } from '@/lib/api';
import type { Parcela } from '@/types';
import type { ParcelaForm } from '@/schemas/parcela.schema';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface ParcelaListData {
  items: Parcela[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function unwrap<T>(response: ApiEnvelope<T>): T {
  if (!response?.success || response.data === undefined) {
    throw new Error('La API devolvió una respuesta inválida.');
  }

  return response.data;
}

export const parcelaService = {
  async list(params?: {
    page?: number;
    limit?: number;
    productorId?: number;
    departamentoId?: number;
    municipioId?: number;
    codigo?: string;
  }): Promise<ParcelaListData> {
    const response = await api.get<ApiEnvelope<ParcelaListData>>(
      '/parcelas',
      { params }
    );

    return unwrap(response.data);
  },

  async get(id: number): Promise<Parcela> {
    const response = await api.get<ApiEnvelope<Parcela>>(
      `/parcelas/${id}`
    );

    return unwrap(response.data);
  },

  async create(payload: ParcelaForm): Promise<Parcela> {
    const response = await api.post<ApiEnvelope<Parcela>>(
      '/parcelas',
      payload
    );

    return unwrap(response.data);
  },

  async update(
    id: number,
    payload: Partial<ParcelaForm>
  ): Promise<Parcela> {
    const response = await api.put<ApiEnvelope<Parcela>>(
      `/parcelas/${id}`,
      payload
    );

    return unwrap(response.data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/parcelas/${id}`);
  },
};
