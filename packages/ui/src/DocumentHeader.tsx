import type { HTMLAttributes, ReactNode } from 'react';

export interface DocumentHeaderProps extends HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: ReactNode;
  reference?: ReactNode;
}

export function DocumentHeader({
  title,
  subtitle,
  reference,
  children,
  className,
  ...props
}: DocumentHeaderProps) {
  return (
    <header {...props} className={`pk-document-header ${className ?? ''}`}>
      <div className="pk-document-header__heading">
        <h2 className="pk-document-header__title">{title}</h2>
        {subtitle && <div className="pk-document-header__subtitle">{subtitle}</div>}
      </div>
      {reference && <div className="pk-document-header__reference">{reference}</div>}
      {children}
    </header>
  );
}
