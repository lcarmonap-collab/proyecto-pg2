import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/features/auth/auth-context';

export const metadata = { title: 'SICA-MAGA', description: 'Sistema de Información y Control Agrícola del MAGA' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body><QueryProvider><AuthProvider>{children}</AuthProvider></QueryProvider></body></html>;
}
