import type { ComponentPropsWithRef } from 'react';

export interface InputProps extends ComponentPropsWithRef<'input'> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={error || props['aria-invalid'] || undefined}
      className={`pk-input ${className ?? ''}`}
    />
  );
}
