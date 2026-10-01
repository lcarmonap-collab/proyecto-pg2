'use client';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
export default function UsuariosPage() { return <ProtectedRoute roles={['SUPERADMIN']}><div><h1 className="text-3xl font-bold text-maga-greenDark">Usuarios</h1><p className="mt-2 text-slate-500">Administración de usuarios institucionales.</p></div></ProtectedRoute>; }
