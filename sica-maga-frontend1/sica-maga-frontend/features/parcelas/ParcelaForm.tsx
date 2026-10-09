'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  parcelaSchema,
  type ParcelaForm as ParcelaValues,
} from '@/schemas/parcela.schema';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import {
  catalogoService,
  type Departamento,
  type Municipio,
} from '@/services/catalogo.service';

import { productorService } from '@/services/productor.service';
import { parcelaService } from '@/services/parcela.service';
import type { Productor } from '@/types';

const ParcelMap = dynamic(
  () => import('./ParcelMap').then((module) => module.ParcelMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[420px] place-items-center rounded-xl bg-slate-100">
        Cargando mapa...
      </div>
    ),
  }
);

export function ParcelaForm() {
  const [productores, setProductores] = useState<Productor[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [coordinates, setCoordinates] = useState<
    { lat: number; lng: number } | undefined
  >();

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ParcelaValues>({
    resolver: zodResolver(parcelaSchema),
    defaultValues: {
      codigo: '',
      productorId: 0,
      departamentoId: 0,
      municipioId: 0,
      tenencia: 'PROPIA',
    },
  });

  const departamentoId = watch('departamentoId');

  useEffect(() => {
    const cargarCatalogos = async () => {
      setLoadingCatalogos(true);
      setError('');

      try {
        const [productoresResponse, departamentosResponse] =
          await Promise.all([
            productorService.list({
              page: 1,
              limit: 100,
            }),
            catalogoService.departamentos(),
          ]);

        setProductores(productoresResponse.data.items);
        setDepartamentos(departamentosResponse);
      } catch (err: any) {
        setError(
          err?.response?.data?.error?.message ||
            'No se pudieron cargar los datos necesarios para registrar la parcela.'
        );
      } finally {
        setLoadingCatalogos(false);
      }
    };

    cargarCatalogos();
  }, []);

  useEffect(() => {
    setMunicipios([]);
    setValue('municipioId', 0);

    if (!departamentoId) {
      return;
    }

    const cargarMunicipios = async () => {
      try {
        const data = await catalogoService.municipios(
          Number(departamentoId)
        );

        setMunicipios(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.error?.message ||
            'No se pudieron cargar los municipios.'
        );
      }
    };

    cargarMunicipios();
  }, [departamentoId, setValue]);

  const selectCoordinates = (lat: number, lng: number) => {
    const next = {
      lat: Number(lat.toFixed(7)),
      lng: Number(lng.toFixed(7)),
    };

    setCoordinates(next);

    setValue('latitud', next.lat, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue('longitud', next.lng, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: ParcelaValues) => {
    setError('');
    setSuccess('');

    try {
      await parcelaService.create(data);

      setSuccess('Parcela registrada correctamente.');
      setCoordinates(undefined);

      reset({
        codigo: '',
        productorId: 0,
        departamentoId: 0,
        municipioId: 0,
        tenencia: 'PROPIA',
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.error?.message ||
          err?.message ||
          'No se pudo registrar la parcela.'
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Código de parcela *
          </label>

          <Input
            {...register('codigo')}
            placeholder="Ej. PAR-001"
            disabled={isSubmitting}
          />

          {errors.codigo && (
            <p className="mt-1 text-xs text-red-600">
              {errors.codigo.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Productor *
          </label>

          <select
            {...register('productorId', {
              valueAsNumber: true,
            })}
            disabled={loadingCatalogos || isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:bg-slate-100"
          >
            <option value={0}>Seleccione productor</option>

            {productores.map((productor) => (
              <option
                key={productor.id}
                value={productor.id}
              >
                {productor.nombres} {productor.apellidos}
              </option>
            ))}
          </select>

          {errors.productorId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.productorId.message}
            </p>
          )}

          {!loadingCatalogos && productores.length === 0 && (
            <p className="mt-1 text-xs text-amber-700">
              Debe registrar al menos un productor antes de crear una parcela.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Departamento *
          </label>

          <select
            {...register('departamentoId', {
              valueAsNumber: true,
            })}
            disabled={loadingCatalogos || isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:bg-slate-100"
          >
            <option value={0}>Seleccione departamento</option>

            {departamentos.map((departamento) => (
              <option
                key={departamento.id}
                value={departamento.id}
              >
                {departamento.nombre}
              </option>
            ))}
          </select>

          {errors.departamentoId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.departamentoId.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Municipio *
          </label>

          <select
            {...register('municipioId', {
              valueAsNumber: true,
            })}
            disabled={!departamentoId || isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:bg-slate-100"
          >
            <option value={0}>Seleccione municipio</option>

            {municipios.map((municipio) => (
              <option
                key={municipio.id}
                value={municipio.id}
              >
                {municipio.nombre}
              </option>
            ))}
          </select>

          {errors.municipioId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.municipioId.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Área (hectáreas) *
          </label>

          <Input
            type="number"
            step="0.01"
            {...register('areaHectareas', {
              valueAsNumber: true,
            })}
            disabled={isSubmitting}
          />

          {errors.areaHectareas && (
            <p className="mt-1 text-xs text-red-600">
              {errors.areaHectareas.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Tenencia *
          </label>

          <select
            {...register('tenencia')}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:bg-slate-100"
          >
            <option value="PROPIA">Propia</option>
            <option value="ARRENDADA">Arrendada</option>
            <option value="COMUNAL">Comunal</option>
            <option value="OTRA">Otra</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Latitud *
          </label>

          <Input
            type="number"
            step="0.0000001"
            {...register('latitud', {
              valueAsNumber: true,
            })}
            disabled={isSubmitting}
          />

          {errors.latitud && (
            <p className="mt-1 text-xs text-red-600">
              {errors.latitud.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Longitud *
          </label>

          <Input
            type="number"
            step="0.0000001"
            {...register('longitud', {
              valueAsNumber: true,
            })}
            disabled={isSubmitting}
          />

          {errors.longitud && (
            <p className="mt-1 text-xs text-red-600">
              {errors.longitud.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <h3 className="font-semibold">
            Ubicación geográfica
          </h3>

          <span className="text-xs text-slate-500">
            Haz clic sobre el mapa para seleccionar las coordenadas.
          </span>
        </div>

        <ParcelMap
          lat={coordinates?.lat}
          lng={coordinates?.lng}
          onSelect={selectCoordinates}
        />
      </div>

      <div className="rounded-lg bg-slate-50 p-3 text-sm">
        Coordenadas seleccionadas:{' '}
        <strong>
          {coordinates
            ? `${coordinates.lat.toFixed(7)}, ${coordinates.lng.toFixed(7)}`
            : 'Ninguna'}
        </strong>
      </div>

      <Button
        type="submit"
        disabled={
          isSubmitting ||
          loadingCatalogos ||
          productores.length === 0
        }
      >
        {isSubmitting
          ? 'Guardando...'
          : 'Registrar parcela'}
      </Button>
    </form>
  );
}
