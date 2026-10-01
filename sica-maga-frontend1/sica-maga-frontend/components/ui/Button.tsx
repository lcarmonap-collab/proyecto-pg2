import type { ButtonHTMLAttributes } from 'react';

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-lg bg-maga-green px-4 py-2 font-medium text-white transition hover:bg-maga-greenDark disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
