import type { HTMLAttributes } from 'react';

export interface RevenueStampProps extends HTMLAttributes<HTMLDivElement> {}

export function RevenueStamp({
  children = 'Revenue Stamp',
  className,
  ...props
}: RevenueStampProps) {
  return (
    <div {...props} className={`pk-revenue-stamp ${className ?? ''}`}>
      {children}
    </div>
  );
}
