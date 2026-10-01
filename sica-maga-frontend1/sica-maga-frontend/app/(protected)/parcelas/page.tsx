'use client';

import { ParcelaForm } from '@/features/parcelas/ParcelaForm';

export default function ParcelasPage() {
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold text-maga-greenDark">Registro de parcela</h1><p className="text-slate-500">Registra terrenos agrícolas y selecciona su ubicación en el mapa.</p></div><div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><ParcelaForm /></div></div>;
}
