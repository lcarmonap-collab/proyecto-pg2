'use client';

import { useState } from 'react';

import {
  useQuery,
  useQueryClient
} from '@tanstack/react-query';

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';

import {
  productorService
} from '@/services/productor.service';

import {
  Input
} from '@/components/ui/Input';

import {
  Button
} from '@/components/ui/Button';

import {
  ProductorForm
} from './ProductorForm';

export function ProductoresTable() {

  const queryClient =
    useQueryClient();

  const [search, setSearch] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const limit = 10;

  const query =
    useQuery({
      queryKey: [
        'productores',
        page,
        search
      ],

      queryFn: () =>
        productorService.list({
          page,
          limit,
          nombre: search || undefined
        })
    });

  const resultado =
    query.data?.data;

  const productores =
    resultado?.items ?? [];

  const total =
    resultado?.total ?? 0;

  const totalPages =
    resultado?.totalPages ?? 1;

  if (mostrarFormulario) {

    return (

      <ProductorForm
        onCancel={() =>
          setMostrarFormulario(false)
        }

        onSuccess={() => {

          setMostrarFormulario(false);

          queryClient.invalidateQueries({
            queryKey: ['productores']
          });

        }}
      />

    );
  }

  return (

    <div className="space-y-4">

      <div className="flex justify-end">

        <Button
          onClick={() =>
            setMostrarFormulario(true)
          }

          className="flex items-center gap-2"
        >

          <Plus size={18} />

          Nuevo productor

        </Button>

      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="font-semibold">
              Productores registrados
            </h2>

            <p className="text-sm text-slate-500">
              Consulta y administra agricultores del sistema.
            </p>

          </div>

          <div className="relative w-full md:w-80">

            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={18}
            />

            <Input
              value={search}

              onChange={(event) => {

                setSearch(
                  event.target.value
                );

                setPage(1);

              }}

              placeholder="Buscar por nombre..."
              className="pl-10"
            />

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">

              <tr>

                <th className="px-4 py-3">
                  Productor
                </th>

                <th className="px-4 py-3">
                  CUI/DPI
                </th>

                <th className="px-4 py-3">
                  Ubicación
                </th>

                <th className="px-4 py-3">
                  Teléfono
                </th>

                <th className="px-4 py-3">
                  Registro
                </th>

              </tr>

            </thead>

            <tbody>

              {query.isLoading && (

                <tr>

                  <td
                    colSpan={5}
                    className="p-8 text-center"
                  >
                    Cargando...
                  </td>

                </tr>

              )}

              {!query.isLoading &&
                productores.length === 0 && (

                  <tr>

                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-500"
                    >
                      No hay productores registrados.
                    </td>

                  </tr>

                )}

              {productores.map(
                (productor) => (

                  <tr
                    key={productor.id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="px-4 py-3 font-medium">

                      {productor.nombres}{' '}
                      {productor.apellidos}

                    </td>

                    <td className="px-4 py-3">

                      {productor.cui}

                    </td>

                    <td className="px-4 py-3">

                      {[
                        productor.comunidad?.nombre,
                        productor.municipio?.nombre,
                        productor.departamento?.nombre
                      ]
                        .filter(Boolean)
                        .join(', ') || '—'}

                    </td>

                    <td className="px-4 py-3">

                      {productor.telefono ||
                        '—'}

                    </td>

                    <td className="px-4 py-3">

                      {new Date(
                        productor.fechaRegistro
                      ).toLocaleDateString(
                        'es-GT'
                      )}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        <div className="flex items-center justify-between border-t p-4 text-sm">

          <span>
            Total: {total}
          </span>

          <div className="flex items-center gap-2">

            <Button
              onClick={() =>
                setPage(
                  (current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                )
              }

              disabled={
                page === 1 ||
                query.isFetching
              }
            >

              <ChevronLeft size={18} />

            </Button>

            <span className="px-2">

              Página {page} de{' '}
              {totalPages}

            </span>

            <Button
              onClick={() =>
                setPage(
                  (current) =>
                    current + 1
                )
              }

              disabled={
                page >= totalPages ||
                query.isFetching
              }
            >

              <ChevronRight size={18} />

            </Button>

          </div>

        </div>

      </div>

    </div>
  );
}
