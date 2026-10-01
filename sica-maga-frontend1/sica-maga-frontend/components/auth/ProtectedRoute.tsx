'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Role } from '@/types';
import { useAuth } from '@/features/auth/auth-context';

export function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: Role[] }) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && user && roles && !hasRole(...roles)) router.replace('/dashboard');
  }, [loading, user, roles, hasRole, router]);

  if (loading || !user) return <div className="grid min-h-screen place-items-center">Cargando...</div>;
  if (roles && !hasRole(...roles)) return null;
  return <>{children}</>;
}
