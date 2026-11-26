import type { HTMLAttributes } from 'react';

export interface StampProps extends HTMLAttributes<HTMLSpanElement> {}

export function Stamp({ children, className, ...props }: StampProps) {
  return (
    <span {...props} className={`pk-stamp ${className ?? ''}`}>
      {children}
    </span>
  );
}
