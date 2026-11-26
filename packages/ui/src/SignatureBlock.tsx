import type { HTMLAttributes, ReactNode } from 'react';

export interface SignatureBlockProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  name?: ReactNode;
}

export function SignatureBlock({
  label,
  name,
  children,
  className,
  ...props
}: SignatureBlockProps) {
  return (
    <div {...props} className={`pk-signature-block ${className ?? ''}`}>
      <div className="pk-signature-block__signature">{children}</div>
      {name && <div className="pk-signature-block__name">{name}</div>}
      <div className="pk-signature-block__label">{label}</div>
    </div>
  );
}
