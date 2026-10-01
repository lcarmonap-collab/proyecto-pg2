
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

// Estructura del contexto de autenticación
interface AuthContextValue {
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginForm) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

// Crear contexto
const AuthContext = createContext<AuthContextValue | null>(null);

// Proveedor de autenticación
export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Recuperar sesión almacenada
  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem('sica_maga_token');
      const storedUser = sessionStorage.getItem('sica_maga_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as Usuario);
      }
    } catch (error) {
      console.error('Error al recuperar la sesión:', error);

      sessionStorage.removeItem('sica_maga_token');
      sessionStorage.removeItem('sica_maga_user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cerrar sesión
  const logout = useCallback(() => {
    sessionStorage.removeItem('sica_maga_token');
    sessionStorage.removeItem('sica_maga_user');

    setToken(null);
    setUser(null);

    router.replace('/login');
  }, [router]);

  // Escuchar errores de autenticación
  useEffect(() => {
    const handler = () => logout();

    window.addEventListener('sica-maga:unauthorized', handler);

    return () => {
      window.removeEventListener('sica-maga:unauthorized', handler);
    };
  }, [logout]);

  // Iniciar sesión
  const login = useCallback(
    async (payload: LoginForm) => {
      // Solicitar autenticación al backend
      const result = await authService.login(payload);

      // Validar respuesta
      if (!result?.accessToken || !result?.usuario) {
        throw new Error(
          'La respuesta del servidor no contiene los datos de autenticación esperados.'
        );
      }

      // Guardar accessToken
      sessionStorage.setItem(
        'sica_maga_token',
        result.accessToken
      );

      // Guardar datos del usuario
      sessionStorage.setItem(
        'sica_maga_user',
        JSON.stringify(result.usuario)
      );

      // Actualizar estado global
      setToken(result.accessToken);
      setUser(result.usuario);

      // Redirigir al dashboard
      router.replace('/dashboard');
    },
    [router]
  );

  // Verificar permisos por rol
  const hasRole = useCallback(
    (...roles: Role[]) => {
      return !!user && roles.includes(user.rol);
    },
    [user]
  );

  // Valores disponibles para los componentes
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

// Hook para consumir el contexto
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider'
    );
  }

  return context;
}

