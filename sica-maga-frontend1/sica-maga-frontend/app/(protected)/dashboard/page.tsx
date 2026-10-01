'use client';

import { useAuth } from '@/features/auth/auth-context';

const cards = [
  ['Productores registrados', '—'],
  ['Parcelas registradas', '—'],
  ['Hectáreas cultivadas', '—'],
  ['Producción total', '—'],
];

export default function DashboardPage() {
  const { user } = useAuth();
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold text-maga-greenDark">Dashboard</h1><p className="text-slate-500">Bienvenido, {user?.nombreCompleto}. Rol: {user?.rol}.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-maga-greenDark">{value}</p></div>)}</div><div className="rounded-xl border border-slate-200 bg-white p-6"><h2 className="font-semibold">Producción agrícola</h2><p className="mt-2 text-sm text-slate-500">Aquí conectaremos los indicadores y gráficos de producción mediante React Query y Recharts.</p></div></div>;
}
