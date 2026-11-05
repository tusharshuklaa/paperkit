import type { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'error';
}

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span className={`pk-badge pk-badge--${variant} ${className ?? ''}`} {...props}>
      {children}
    </span>
  );
}
