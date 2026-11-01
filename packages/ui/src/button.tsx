import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const base = 'ui:px-4 ui:py-2 ui:rounded-md ui:font-medium ui:transition-colors';
  const variants = {
    primary: 'ui:bg-blue-1000 ui:text-white ui:hover:opacity-90',
    secondary: 'ui:bg-purple-1000 ui:text-white ui:hover:opacity-90',
    outline: 'ui:border ui:border-current ui:hover:bg-black/5',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className ?? ''}`} {...props}>
      {children}
    </button>
  );
}
