import { LoginForm } from '@/features/auth/LoginForm';

export default function LoginPage() {
  return <main className="grid min-h-screen place-items-center bg-gradient-to-br from-maga-greenDark via-maga-green to-maga-cream p-4"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"><div className="mb-8 text-center"><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-maga-green text-2xl font-bold text-white">M</div><h1 className="text-2xl font-bold text-maga-greenDark">SICA-MAGA</h1><p className="mt-1 text-sm text-slate-500">Administración de Datos Agrícolas</p></div><LoginForm /></section></main>;
}
