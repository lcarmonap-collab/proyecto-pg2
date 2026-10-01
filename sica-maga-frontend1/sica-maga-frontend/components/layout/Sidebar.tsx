'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Map, Sprout, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/productores', label: 'Productores', icon: Users },
  { href: '/parcelas', label: 'Parcelas', icon: Map },
  { href: '/cultivos', label: 'Cultivos', icon: Sprout },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  return (
    <aside className="flex w-64 flex-col bg-maga-greenDark text-white">
      <div className="border-b border-white/10 p-5">
        <div className="text-xl font-bold">SICA-MAGA</div>
        <div className="text-xs text-white/70">Gestión de información agrícola</div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? 'bg-white/15' : 'hover:bg-white/10'}`}><Icon size={18} />{item.label}</Link>;
        })}
        {user?.rol === 'SUPERADMIN' && <Link href="/usuarios" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10"><ShieldCheck size={18} />Usuarios</Link>}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="mb-2 px-2 text-xs text-white/70">{user?.nombreCompleto}</div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10"><LogOut size={18} />Cerrar sesión</button>
      </div>
    </aside>
  );
}
