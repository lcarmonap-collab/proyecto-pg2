'use client';

import { useEffect, useState } from 'react';

import {
  useForm
} from 'react-hook-form';

import {
  zodResolver
} from '@hookform/resolvers/zod';

import {
  productorSchema,
  type ProductorForm as ProductorFormType
} from '@/schemas/productor.schema';

import {
  catalogoService,
  type Departamento,
  type Municipio,
  type Comunidad
} from '@/services/catalogo.service';

import {
  productorService,
  type ProductorPayload
} from '@/services/productor.service';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductorForm({
  onSuccess,
  onCancel
}: Props) {

  const [
    departamentos,
    setDepartamentos
  ] = useState<Departamento[]>([]);

  const [
    municipios,
    setMunicipios
  ] = useState<Municipio[]>([]);

  const [
    comunidades,
    setComunidades
  ] = useState<Comunidad[]>([]);

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    error,
    setError
  ] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {
      errors
    }
  } = useForm<ProductorFormType>({
    resolver: zodResolver(
      productorSchema
    ),

    defaultValues: {
      cui: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      direccion: '',
      cooperativa: '',
      departamentoId: 0,
      municipioId: 0
    }
  });

  const departamentoId =
    watch('departamentoId');

  const municipioId =
    watch('municipioId');

  useEffect(() => {

    const cargar =
      async () => {

        try {

          const data =
            await catalogoService
              .departamentos();

          setDepartamentos(data);

        } catch {

          setError(
            'No se pudieron cargar los departamentos.'
          );
        }
      };

    cargar();

  }, []);

  useEffect(() => {

    setMunicipios([]);
    setComunidades([]);

    setValue(
      'municipioId',
      0
    );

    setValue(
      'comunidadId',
      undefined
    );

    if (!departamentoId) {
      return;
    }

    const cargar =
      async () => {

        try {

          const data =
            await catalogoService
              .municipios(
                Number(departamentoId)
              );

          setMunicipios(data);

        } catch {

          setError(
            'No se pudieron cargar los municipios.'
          );
        }
      };

    cargar();

  }, [
    departamentoId,
    setValue
  ]);

  useEffect(() => {

    setComunidades([]);

    setValue(
      'comunidadId',
      undefined
    );

    if (!municipioId) {
      return;
    }

    const cargar =
      async () => {

        try {

          const data =
            await catalogoService
              .comunidades(
                Number(municipioId)
              );

          setComunidades(data);

        } catch {

          setError(
            'No se pudieron cargar las comunidades.'
          );
        }
      };

    cargar();

  }, [
    municipioId,
    setValue
  ]);

  const onSubmit =
    async (
      data: ProductorFormType
    ) => {

      setLoading(true);
      setError('');

      try {

        const payload:
          ProductorPayload = {

          cui: data.cui,

          nombres:
            data.nombres,

          apellidos:
            data.apellidos,

          telefono:
            data.telefono || undefined,

          direccion:
            data.direccion || undefined,

          cooperativa:
            data.cooperativa || undefined,

          departamentoId:
            Number(
              data.departamentoId
            ),

          municipioId:
            Number(
              data.municipioId
            ),

          comunidadId:
            data.comunidadId
              ? Number(
                  data.comunidadId
                )
              : undefined
        };

        await productorService
          .create(payload);

        onSuccess();

      } catch (err: any) {

        setError(
          err?.response?.data?.error?.message ||
          'No se pudo registrar el productor.'
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-maga-greenDark">
          Nuevo productor
        </h2>

        <p className="text-sm text-slate-500">
          Registre la información del agricultor.
        </p>

      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={
          handleSubmit(onSubmit)
        }
        className="space-y-6"
      >

        <div className="grid gap-4 md:grid-cols-2">

          <div>

            <label className="mb-1 block text-sm font-medium">
              CUI / DPI *
            </label>

            <Input
              {...register('cui')}
              maxLength={13}
              placeholder="13 dígitos"
            />

            {errors.cui && (
              <p className="mt-1 text-xs text-red-600">
                {errors.cui.message}
              </p>
            )}

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Teléfono
            </label>

            <Input
              {...register('telefono')}
              maxLength={8}
              placeholder="8 dígitos"
            />

            {errors.telefono && (
              <p className="mt-1 text-xs text-red-600">
                {errors.telefono.message}
              </p>
            )}

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Nombres *
            </label>

            <Input
              {...register('nombres')}
              placeholder="Nombres"
            />

            {errors.nombres && (
              <p className="mt-1 text-xs text-red-600">
                {errors.nombres.message}
              </p>
            )}

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Apellidos *
            </label>

            <Input
              {...register('apellidos')}
              placeholder="Apellidos"
            />

            {errors.apellidos && (
              <p className="mt-1 text-xs text-red-600">
                {errors.apellidos.message}
              </p>
            )}

          </div>

          <div className="md:col-span-2">

            <label className="mb-1 block text-sm font-medium">
              Dirección
            </label>

            <Input
              {...register('direccion')}
              placeholder="Dirección"
            />

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Cooperativa
            </label>

            <Input
              {...register('cooperativa')}
              placeholder="Cooperativa"
            />

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Departamento *
            </label>

            <select
              {...register(
                'departamentoId',
                {
                  valueAsNumber: true
                }
              )}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >

              <option value={0}>
                Seleccione departamento
              </option>

              {departamentos.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nombre}
                  </option>
                )
              )}

            </select>

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Municipio *
            </label>

            <select
              {...register(
                'municipioId',
                {
                  valueAsNumber: true
                }
              )}
              disabled={!departamentoId}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
            >

              <option value={0}>
                Seleccione municipio
              </option>

              {municipios.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nombre}
                  </option>
                )
              )}

            </select>

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Comunidad
            </label>

            <select
              {...register(
                'comunidadId',
                {
                  valueAsNumber: true
                }
              )}
              disabled={!municipioId}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
            >

              <option value="">
                Seleccione comunidad
              </option>

              {comunidades.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nombre}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t pt-5">

          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Guardando...'
              : 'Guardar productor'}
          </Button>

        </div>

      </form>

    </div>
  );
}
