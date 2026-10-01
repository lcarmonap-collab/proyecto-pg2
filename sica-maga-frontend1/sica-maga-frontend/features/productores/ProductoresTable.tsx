'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { productorService } from '@/services/productor.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ProductoresTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const query = useQuery({ queryKey: ['productores', page, search], queryFn: () => productorService.list({ page, limit, search }) });

  return <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
      <div><h2 className="font-semibold">Productores registrados</h2><p className="text-sm text-slate-500">Consulta y administra agricultores del sistema.</p></div>
      <div className="relative w-full md:w-80"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nombre o CUI..." className="pl-10" /></div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Productor</th><th className="px-4 py-3">CUI/DPI</th><th className="px-4 py-3">Ubicación</th><th className="px-4 py-3">Teléfono</th><th className="px-4 py-3">Estado</th></tr></thead>
      <tbody>{query.isLoading ? <tr><td colSpan={5} className="p-8 text-center">Cargando...</td></tr> : query.data?.data.map((p) => <tr key={p.idProductor} className="border-t hover:bg-slate-50"><td className="px-4 py-3 font-medium">{p.nombres} {p.apellidos}</td><td className="px-4 py-3">{p.dpi || '—'}</td><td className="px-4 py-3">{[p.comunidad, p.municipio, p.departamento].filter(Boolean).join(', ') || '—'}</td><td className="px-4 py-3">{p.telefono || '—'}</td><td className="px-4 py-3">{p.estado ? <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Activo</span> : <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">Inactivo</span>}</td></tr>)}</tbody></table>
    </div>
    <div className="flex items-center justify-between border-t p-4 text-sm"><span>Total: {query.data?.meta.total ?? 0}</span><div className="flex gap-2"><Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || query.isFetching}><ChevronLeft size={18} /></Button><span className="px-2 py-2">Página {page} de {query.data?.meta.totalPages ?? 1}</span><Button onClick={() => setPage((p) => p + 1)} disabled={page >= (query.data?.meta.totalPages ?? 1) || query.isFetching}><ChevronRight size={18} /></Button></div></div>
  </div>;
}
