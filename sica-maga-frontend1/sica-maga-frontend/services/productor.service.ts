import { api } from '@/lib/api';
import type { Productor } from '@/types';

export interface ProductorListResponse {
  success: boolean;

  data: {
    items: Productor[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductorPayload {
  cui: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  direccion?: string;
  cooperativa?: string;
  departamentoId: number;
  municipioId: number;
  comunidadId?: number;
}

export const productorService = {

  async list(params: {
    page: number;
    limit: number;
    cui?: string;
    nombre?: string;
    departamentoId?: number;
    municipioId?: number;
  }): Promise<ProductorListResponse> {

    const response =
      await api.get<ProductorListResponse>(
        '/productores',
        {
          params
        }
      );

    return response.data;
  },

  async get(id: number) {

    const response =
      await api.get<{
        success: boolean;
        data: Productor;
      }>(
        `/productores/${id}`
      );

    return response.data.data;
  },

  async create(
    payload: ProductorPayload
  ) {

    const response =
      await api.post<{
        success: boolean;
        data: Productor;
      }>(
        '/productores',
        payload
      );

    return response.data.data;
  },

  async update(
    id: number,
    payload: Partial<ProductorPayload>
  ) {

    const response =
      await api.put<{
        success: boolean;
        data: Productor;
      }>(
        `/productores/${id}`,
        payload
      );

    return response.data.data;
  },

  async remove(id: number) {

    await api.delete(
      `/productores/${id}`
    );
  }
};
