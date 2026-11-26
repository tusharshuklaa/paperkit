import { ChevronDown } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'multiple' | 'size'> {
  error?: boolean;
}

export function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <span className="pk-select-control">
      <select
        {...props}
        aria-invalid={error || props['aria-invalid'] || undefined}
        className={`pk-input pk-select ${className ?? ''}`}
      >
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pk-select-control__chevron" />
    </span>
  );
}
