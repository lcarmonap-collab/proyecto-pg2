import { api } from '@/lib/api';

export interface Departamento {
  id: number;
  nombre: string;
}

export interface Municipio {
  id: number;
  nombre: string;
  departamentoId: number;
}

export interface Comunidad {
  id: number;
  nombre: string;
  municipioId: number;
}

export const catalogoService = {

  async departamentos(): Promise<Departamento[]> {

    const response =
      await api.get<{
        success: boolean;
        data: Departamento[];
      }>(
        '/catalogos/departamentos'
      );

    return response.data.data;
  },

  async municipios(
    departamentoId: number
  ): Promise<Municipio[]> {

    const response =
      await api.get<{
        success: boolean;
        data: Municipio[];
      }>(
        '/catalogos/municipios',
        {
          params: {
            departamentoId
          }
        }
      );

    return response.data.data;
  },

  async comunidades(
    municipioId: number
  ): Promise<Comunidad[]> {

    const response =
      await api.get<{
        success: boolean;
        data: Comunidad[];
      }>(
        '/catalogos/comunidades',
        {
          params: {
            municipioId
          }
        }
      );

    return response.data.data;
  }
};
