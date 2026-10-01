
import React, { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-maga-green focus:ring-2 focus:ring-maga-green/20 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
