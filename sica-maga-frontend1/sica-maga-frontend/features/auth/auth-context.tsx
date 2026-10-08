'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import type { Role, Usuario } from '@/types';
import type { LoginForm } from '@/schemas/auth.schema';

interface AuthContextValue {
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginForm) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = sessionStorage.getItem('sica_maga_token');
        const storedUser = sessionStorage.getItem('sica_maga_user');
        const storedRefreshToken = sessionStorage.getItem(
          'sica_maga_refresh_token'
        );

        if (storedToken && storedUser && storedRefreshToken) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser) as Usuario);

          const currentUser = await authService.me();

          setUser(currentUser);

          sessionStorage.setItem(
            'sica_maga_user',
            JSON.stringify(currentUser)
          );
        }
      } catch (error) {
        console.error('Error al recuperar/verificar la sesión:', error);

        sessionStorage.removeItem('sica_maga_token');
        sessionStorage.removeItem('sica_maga_user');
        sessionStorage.removeItem('sica_maga_refresh_token');

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const logout = useCallback(() => {
    const refreshToken = sessionStorage.getItem(
      'sica_maga_refresh_token'
    );

    if (refreshToken) {
      authService.logout(refreshToken).catch((error) => {
        console.error('Error al cerrar sesión en el servidor:', error);
      });
    }

    sessionStorage.removeItem('sica_maga_token');
    sessionStorage.removeItem('sica_maga_user');
    sessionStorage.removeItem('sica_maga_refresh_token');

    setToken(null);
    setUser(null);

    router.replace('/login');
  }, [router]);

  useEffect(() => {
    const handler = () => logout();

    window.addEventListener('sica-maga:unauthorized', handler);

    return () => {
      window.removeEventListener('sica-maga:unauthorized', handler);
    };
  }, [logout]);

  const login = useCallback(
    async (payload: LoginForm) => {
      const result = await authService.login(payload);

      if (
        !result?.accessToken ||
        !result?.refreshToken ||
        !result?.usuario
      ) {
        throw new Error(
          'La respuesta del servidor no contiene los datos de autenticación esperados.'
        );
      }

      sessionStorage.setItem(
        'sica_maga_token',
        result.accessToken
      );

      sessionStorage.setItem(
        'sica_maga_refresh_token',
        result.refreshToken
      );

      sessionStorage.setItem(
        'sica_maga_user',
        JSON.stringify(result.usuario)
      );

      setToken(result.accessToken);
      setUser(result.usuario);

      router.replace('/dashboard');
    },
    [router]
  );

  const hasRole = useCallback(
    (...roles: Role[]) => {
      return !!user && roles.includes(user.rol);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      hasRole,
    }),
    [user, token, loading, login, logout, hasRole]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider'
    );
  }

  return context;
}
