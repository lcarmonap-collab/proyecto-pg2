'use client';

import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  parcelaSchema,
  type ParcelaForm as ParcelaValues,
} from '@/schemas/parcela.schema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Productor } from '@/types';
import { useState } from 'react';

const ParcelMap = dynamic(
  () => import('./ParcelMap').then((m) => m.ParcelMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[420px] place-items-center rounded-xl bg-slate-100">
        Cargando mapa...
      </div>
    ),
  }
);

export function ParcelaForm({
  productores = [],
}: {
  productores?: Productor[];
}) {
  const [coordinates, setCoordinates] = useState<
    { lat: number; lng: number } | undefined
  >();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ParcelaValues>({
    resolver: zodResolver(parcelaSchema),
    defaultValues: {
      tenenciaTierra: 'Propia',
    },
  });

  const onSubmit = async (data: ParcelaValues) => {
    console.log('Payload listo para POST /parcelas:', data);

    // Aquí conectaremos parcelaService.create(data)
    // cuando habilitemos el alta.
  };

  const selectCoordinates = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });

    setValue('latitud', Number(lat.toFixed(7)), {
      shouldValidate: true,
    });

    setValue('longitud', Number(lng.toFixed(7)), {
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">

        {/* PRODUCTOR */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Productor
          </label>

          <select
            {...register('idProductor')}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
          >
            <option value="">Seleccione...</option>

            {productores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombres} {p.apellidos}
              </option>
            ))}
          </select>

          {errors.idProductor && (
            <p className="mt-1 text-xs text-red-600">
              {errors.idProductor.message}
            </p>
          )}
        </div>

        {/* NOMBRE DE PARCELA */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Nombre de parcela
          </label>

          <Input {...register('nombreParcela')} />

          {errors.nombreParcela && (
            <p className="mt-1 text-xs text-red-600">
              {errors.nombreParcela.message}
            </p>
          )}
        </div>

        {/* ÁREA */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Área (hectáreas)
          </label>

          <Input
            type="number"
            step="0.01"
            {...register('areaHectareas')}
          />

          {errors.areaHectareas && (
            <p className="mt-1 text-xs text-red-600">
              {errors.areaHectareas.message}
            </p>
          )}
        </div>

        {/* TENENCIA */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Tenencia
          </label>

          <select
            {...register('tenenciaTierra')}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
          >
            <option value="Propia">Propia</option>
            <option value="Arrendada">Arrendada</option>
            <option value="Comunal">Comunal</option>
            <option value="Otra">Otra</option>
          </select>
        </div>

        {/* LATITUD */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Latitud
          </label>

          <Input
            type="number"
            step="0.0000001"
            {...register('latitud')}
          />

          {errors.latitud && (
            <p className="mt-1 text-xs text-red-600">
              {errors.latitud.message}
            </p>
          )}
        </div>

        {/* LONGITUD */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Longitud
          </label>

          <Input
            type="number"
            step="0.0000001"
            {...register('longitud')}
          />

          {errors.longitud && (
            <p className="mt-1 text-xs text-red-600">
              {errors.longitud.message}
            </p>
          )}
        </div>
      </div>

      {/* MAPA */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">
            Ubicación geográfica
          </h3>

          <span className="text-xs text-slate-500">
            Haz clic sobre el mapa para seleccionar coordenadas.
          </span>
        </div>

        <ParcelMap
          lat={coordinates?.lat}
          lng={coordinates?.lng}
          onSelect={selectCoordinates}
        />
      </div>

      {/* COORDENADAS */}
      <div className="rounded-lg bg-slate-50 p-3 text-sm">
        Coordenadas seleccionadas:{' '}
        <strong>
          {coordinates
            ? `${coordinates.lat.toFixed(7)}, ${coordinates.lng.toFixed(7)}`
            : 'Ninguna'}
        </strong>
      </div>

      {/* BOTÓN */}
      <Button disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Registrar parcela'}
      </Button>
    </form>
  );
}
