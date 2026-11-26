import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button className={`pk-button pk-button--${variant} ${className ?? ''}`} {...props}>
      {children}
    </button>
  );
}
