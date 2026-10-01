'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm as LoginValues } from '@/schemas/auth.schema';
import { useAuth } from './auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setServerError('');

    try {
      await login(data);
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ??
        'No fue posible iniciar sesión.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Correo electrónico */}
      <div>
        <label
          htmlFor="correo"
          className="mb-1 block text-sm font-medium"
        >
          Correo electrónico
        </label>

        <Input
          id="correo"
          type="email"
          {...register('correo')}
          autoComplete="username"
          placeholder="admin@maga.gob.gt"
        />

        {errors.correo && (
          <p className="mt-1 text-xs text-red-600">
            {errors.correo.message}
          </p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium"
        >
          Contraseña
        </label>

        <Input
          id="password"
          type="password"
          {...register('password')}
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
        />

        {errors.password && (
          <p className="mt-1 text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Error del servidor */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      {/* Botón de acceso */}
      <Button
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
      </Button>

    </form>
  );
}
